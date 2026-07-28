import { NextRequest } from "next/server";
import { verifyNotifySign } from "@/lib/zhifu";

// 支付FM 异步回调。默认 GET，也可能是 POST（表单）。
// 本站采用「无持久化」方案：卡密在用户返回的成功页按订单实时领取，
// 因此这里只做验签并返回 success，避免支付FM反复重试。
export const dynamic = "force-dynamic";

function extractParams(searchParams: URLSearchParams, form?: URLSearchParams) {
  const pick = (k: string) => form?.get(k) ?? searchParams.get(k) ?? "";
  return {
    state: pick("state"),
    merchantNum: pick("merchantNum"),
    orderNo: pick("orderNo"),
    amount: pick("amount"),
    sign: pick("sign"),
  };
}

async function handle(req: NextRequest) {
  const url = new URL(req.url);
  let form: URLSearchParams | undefined;

  if (req.method === "POST") {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      form = new URLSearchParams(text);
    }
  }

  const p = extractParams(url.searchParams, form);

  if (!p.merchantNum || !p.orderNo || !p.amount || !p.state || !p.sign) {
    return new Response("fail", { status: 200, headers: { "Content-Type": "text/plain" } });
  }

  const ok = verifyNotifySign(p);
  if (!ok || p.state !== "1") {
    return new Response("fail", { status: 200, headers: { "Content-Type": "text/plain" } });
  }

  // 验签通过。必须返回纯文本 success，支付FM才会停止重试。
  return new Response("success", { status: 200, headers: { "Content-Type": "text/plain" } });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
