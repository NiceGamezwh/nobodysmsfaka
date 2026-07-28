import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { createOrder, genOrderNo } from "@/lib/zhifu";

// 默认支付方式：支付宝免签收款码。若与你在支付FM后台配置的收款号编码不一致，可通过请求体覆盖。
const DEFAULT_PAY_TYPE = "alipay";

function getOrigin(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const tier = String(body.tier ?? "");
    const payType = String(body.payType ?? DEFAULT_PAY_TYPE);

    const product = getProduct(tier);
    if (!product) {
      return NextResponse.json({ success: false, msg: "无效的商品档位" }, { status: 400 });
    }

    const orderNo = genOrderNo();
    const origin = getOrigin(req);
    // notifyUrl 必须是公网可访问的 HTTPS 且不带查询参数
    const notifyUrl = `${origin}/api/notify`;
    // 与最初可正常跳转的版本保持一致：returnUrl 自带 orderNo + tier。
    // 成功页读取 orderNo 时 URLSearchParams.get 取第一个值，仍是我们自己的 orderNo，领取正常。
    const returnUrl = `${origin}/success?orderNo=${orderNo}&tier=${product.tier}`;

    const result = await createOrder({
      orderNo,
      amount: product.amount,
      notifyUrl,
      returnUrl,
      payType,
    });

    if (result.success && result.payUrl) {
      return NextResponse.json({ success: true, orderNo, payUrl: result.payUrl });
    }
    return NextResponse.json(
      { success: false, msg: result.msg || "创建订单失败" },
      { status: 400 },
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, msg: err?.message || "服务器错误" }, { status: 500 });
  }
}
