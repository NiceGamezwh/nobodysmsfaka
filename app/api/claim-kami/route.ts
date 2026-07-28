import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { queryOutOrder, verifyReturnPaid } from "@/lib/zhifu";
import { claimKami } from "@/lib/contract";

// 用户支付完成返回成功页后，由此接口领取卡密。
// 安全闸门：必须先核实该订单确实已支付，才会调用链上 getKami()。
// 核实方式（任一通过即可）：
//   1) 支付FM 跳回时携带的已签名参数（state=1 且 sign 校验通过）——最可信；
//   2) 主动调用 /queryOutOrder 查询订单状态——作兜底。
// 注意：本站未做持久化，同一订单重复请求会重复领取新卡密，请提醒用户及时保存。
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNo = searchParams.get("orderNo") || "";
    const tier = searchParams.get("tier") || "";

    const product = getProduct(tier);
    if (!orderNo || !product) {
      return NextResponse.json({ success: false, msg: "参数无效" }, { status: 400 });
    }

    // 1. 优先：校验支付FM 跳回携带的签名参数
    let paid = false;
    let paidAmount: string | undefined;
    let diag: unknown;
    const returnCheck = verifyReturnPaid(searchParams);
    if (returnCheck.ok) {
      paid = true;
      paidAmount = returnCheck.amount;
      console.log("[v0] 支付核实：返回参数验签通过", orderNo);
    } else {
      console.log("[v0] 返回参数验签未通过：", returnCheck.reason, "→ 改用查询接口");
      // 2. 兜底：主动查询订单一次。支付确认有延迟（尤其免签类型），
      //    未支付时由前端每隔几秒自动重试，无需服务端长阻塞。
      const q = await queryOutOrder(orderNo);
      paid = q.paid;
      paidAmount = q.amount;
      diag = q.raw;
      console.log("[v0] 查询接口结果 paid=", q.paid, "amount=", q.amount);
    }

    if (!paid) {
      return NextResponse.json({
        success: false,
        paid: false,
        msg: "订单尚未支付成功，请稍后重试",
        // 透出查询原始返回，便于核对支付平台实际字段/状态
        diag: process.env.NODE_ENV === "production" ? undefined : diag,
      });
    }

    // 3. 金额校验（防止用低价订单领高价卡密）
    if (paidAmount != null) {
      const got = Number(paidAmount);
      const need = Number(product.amount);
      if (Number.isFinite(got) && Math.abs(got - need) > 0.001) {
        return NextResponse.json(
          { success: false, paid: true, msg: `支付金额(${paidAmount})与商品价格(${product.amount})不符` },
          { status: 400 },
        );
      }
    }

    // 4. 链上领取唯一卡密（会员卡密走 MemberCardQueue 合约，返回三段式卡密）
    const kami = await claimKami(product.contract, product.member === true);

    return NextResponse.json({ success: true, paid: true, kami });
  } catch (err: any) {
    console.log("[v0] claim-kami 异常:", err?.message);
    return NextResponse.json(
      { success: false, msg: err?.message || "领取失败，请联系管理员" },
      { status: 500 },
    );
  }
}
