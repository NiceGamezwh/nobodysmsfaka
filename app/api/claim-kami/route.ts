import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { queryOutOrder, verifyReturnPaid } from "@/lib/zhifu";
import { claimKami } from "@/lib/contract";
import { redisGet, redisSet, redisAcquireLock, redisDel } from "@/lib/redis";

// 用户支付完成返回成功页后，由此接口领取卡密。
// 安全闸门：必须先核实该订单确实已支付，才会调用链上 getKami()。
// 核实方式（任一通过即可）：
//   1) 支付FM 跳回时携带的已签名参数（state=1 且 sign 校验通过）——最可信；
//   2) 主动调用 /queryOutOrder 查询订单状态——作兜底。
// 幂等：领取结果按 orderNo 持久化到 Upstash Redis，并用 Redis 锁做并发互斥，
// 确保同一订单无论刷新/换设备/并发，都只会调用一次合约 getKami()。
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

    // 3. 服务端幂等：同一订单只会调用一次合约 getKami()。
    //    无论刷新、换标签页/设备/浏览器还是并发请求，重复请求都直接返回已发放的同一张卡密。
    const doneKey = `kami:done:${orderNo}`;
    const lockKey = `kami:lock:${orderNo}`;

    // 3.1 已发放过 → 直接返回同一张卡密，绝不再调用合约
    const already = await redisGet(doneKey);
    if (already) {
      console.log("[v0] 幂等命中，订单已发放过卡密：", orderNo);
      return NextResponse.json({ success: true, paid: true, kami: already });
    }

    // 3.2 抢占并发锁（30 秒过期防死锁），抢不到说明另一请求正在领取
    const locked = await redisAcquireLock(lockKey, 30);
    if (!locked) {
      // 轮询等待另一请求完成写入，最多约 6 秒
      for (let i = 0; i < 12; i++) {
        await new Promise((r) => setTimeout(r, 500));
        const k = await redisGet(doneKey);
        if (k) {
          console.log("[v0] 等待到并发请求完成，返回同一卡密：", orderNo);
          return NextResponse.json({ success: true, paid: true, kami: k });
        }
      }
      return NextResponse.json({
        success: false,
        paid: true,
        msg: "正在领取中，请勿刷新，稍候将自动展示卡密",
      });
    }

    // 3.3 拿到锁后二次确认（防止 3.1~3.2 之间已被其他请求写入）
    try {
      const recheck = await redisGet(doneKey);
      if (recheck) {
        return NextResponse.json({ success: true, paid: true, kami: recheck });
      }

      // 4. 链上领取唯一卡密（会员卡密走 MemberCardQueue 合约，返回三段式卡密）
      //    说明：支付平台会对金额做微调（如 30.00 → 29.97/30.01）用于订单识别，
      //    因此这里不再做金额等值校验，只要订单已支付成功即按 tier 发放对应卡密。
      const kami = await claimKami(product.contract, product.member === true);

      // 5. 领取成功后立即永久写入 Redis，后续该订单的任何请求都走幂等命中
      await redisSet(doneKey, kami);
      console.log("[v0] 首次领取并写入幂等记录：", orderNo);

      return NextResponse.json({ success: true, paid: true, kami });
    } finally {
      // 6. 释放锁（幂等记录已写入 doneKey，锁仅用于并发互斥）
      await redisDel(lockKey);
    }
  } catch (err: any) {
    console.log("[v0] claim-kami 异常:", err?.message);
    return NextResponse.json(
      { success: false, msg: err?.message || "领取失败，请联系管理员" },
      { status: 500 },
    );
  }
}
