// 支付FM 接口封装（仅服务端使用，包含接入密钥）
import crypto from "crypto";

// 接口根地址。支付FM 的网关是「轮换域名」，会不定期更换（官方文档设有「域名说明公告」）。
// 一旦域名失效，服务端 fetch 会抛出 "fetch failed"（DNS/连接失败）。
// 因此这里支持用环境变量 ZHIFU_API_ROOT 覆盖，域名更换时无需改代码即可切换。
const DEFAULT_API_ROOT = "https://api-54kn0m8dooow.zhifu.fm.it88168.com/api";
function getApiRoot(): string {
  return (process.env.ZHIFU_API_ROOT || DEFAULT_API_ROOT).replace(/\/+$/, "");
}

/**
 * 带超时与自动重试的 fetch。
 * 支付网关节点偶发抖动会让 Node 的 fetch 抛 "fetch failed"，
 * 这里对这类瞬时网络错误重试若干次，避免用户下单时随机失败。
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  opts: { retries?: number; timeoutMs?: number } = {},
): Promise<Response> {
  const retries = opts.retries ?? 2; // 首次 + 2 次重试 = 最多 3 次
  const timeoutMs = opts.timeoutMs ?? 15000;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: ac.signal, cache: "no-store" });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      console.log(
        `[v0] 支付网关请求失败（第 ${attempt + 1}/${retries + 1} 次）:`,
        (err as Error)?.message,
      );
      // 最后一次不再等待
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("支付网关请求失败");
}

// 硬编码的商户凭证（应用户要求）。如需覆盖可设置同名环境变量。
const MERCHANT_NUM = "674829285504466944";
const API_KEY = "7b1bf42f066eda6c8b0396d7c2d3537d";

export function getMerchantNum(): string {
  return process.env.ZHIFU_MERCHANT_NUM || MERCHANT_NUM;
}

function getApiKey(): string {
  return process.env.ZHIFU_API_KEY || API_KEY;
}

export function md5(input: string): string {
  return crypto.createHash("md5").update(input, "utf8").digest("hex");
}

/** 生成唯一商户订单号：时间戳 + 随机串（去掉可能干扰签名的特殊字符） */
export function genOrderNo(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 10);
}

/** 创建订单签名：md5(merchantNum + orderNo + amount + notifyUrl + 接入密钥) */
export function signCreateOrder(orderNo: string, amount: string, notifyUrl: string): string {
  return md5(getMerchantNum() + orderNo + amount + notifyUrl + getApiKey());
}

/** 回调验签：md5(state + merchantNum + orderNo + amount + 接入密钥) */
export function verifyNotifySign(params: {
  state: string;
  merchantNum: string;
  orderNo: string;
  amount: string;
  sign: string;
}): boolean {
  const expected = md5(params.state + params.merchantNum + params.orderNo + params.amount + getApiKey());
  return expected.toLowerCase() === (params.sign || "").toLowerCase();
}

/**
 * 校验支付FM 跳回 returnUrl 时携带的参数是否为“已支付”。
 *
 * 实测支付FM 跳回携带的参数为：
 *   orderNo / mchOrderNo / platformOrderNo / orderState / amount / actualPayAmount
 * 其中 orderState=4 表示支付成功（与查询接口一致），跳回地址不含 sign。
 * 若未来带上 state+sign，也一并做签名校验（更可信）。
 */
export function verifyReturnPaid(sp: URLSearchParams): {
  ok: boolean;
  amount?: string;
  reason?: string;
} {
  const orderState = String(sp.get("orderState") ?? "").trim();
  // 实付金额优先，其次订单金额
  const amount = sp.get("actualPayAmount") ?? sp.get("amount") ?? undefined;

  // 情况一：带完整签名字段（state + sign）时，做签名校验，最可信
  const state = sp.get("state") ?? "";
  const sign = sp.get("sign") ?? "";
  const merchantNum = sp.get("merchantNum") ?? "";
  if (state && sign && merchantNum) {
    const valid = verifyNotifySign({ state, merchantNum, orderNo: sp.get("orderNo") ?? "", amount: amount ?? "", sign });
    if (!valid) return { ok: false, reason: "返回参数签名校验失败" };
    if (String(state) !== "1") return { ok: false, reason: `订单状态 state=${state}` };
    return { ok: true, amount };
  }

  // 情况二：跳回仅带 orderState（无签名），4=支付成功
  if (orderState === "4") {
    return { ok: true, amount };
  }
  if (orderState) {
    return { ok: false, reason: `跳回订单状态 orderState=${orderState}（非已支付）` };
  }

  return { ok: false, reason: "返回参数缺少支付状态字段" };
}

/** 商户订单号查询签名：md5(merchantNum + orderNo + 接入密钥) */
function signQueryOutOrder(orderNo: string): string {
  return md5(getMerchantNum() + orderNo + getApiKey());
}

export interface CreateOrderResult {
  success: boolean;
  payUrl?: string;
  msg?: string;
  raw?: unknown;
}

/** 调用支付FM 创建订单，返回支付链接 */
export async function createOrder(opts: {
  orderNo: string;
  amount: string;
  notifyUrl: string;
  returnUrl: string;
  payType: string;
}): Promise<CreateOrderResult> {
  const merchantNum = getMerchantNum();
  const sign = signCreateOrder(opts.orderNo, opts.amount, opts.notifyUrl);

  const params = new URLSearchParams({
    merchantNum,
    orderNo: opts.orderNo,
    amount: opts.amount,
    notifyUrl: opts.notifyUrl,
    returnUrl: opts.returnUrl,
    payType: opts.payType,
    sign,
    returnType: "json",
  });

  let res: Response;
  try {
    res = await fetchWithRetry(`${getApiRoot()}/startOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  } catch (err: any) {
    console.log("[v0] createOrder 连接支付网关失败:", err?.message);
    return {
      success: false,
      msg: "连接支付网关失败，请稍后重试（若持续失败，可能是支付FM网关域名已更换，需更新 ZHIFU_API_ROOT）",
    };
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    return { success: false, msg: `支付FM返回非JSON: ${text.slice(0, 200)}` };
  }

  // 支付FM 返回结构容错：兼容 data.payUrl / payUrl / data.data.payUrl
  const payUrl =
    data?.data?.payUrl || data?.payUrl || data?.data?.payurl || data?.payurl;

  if (payUrl) {
    return { success: true, payUrl, raw: data };
  }
  return { success: false, msg: data?.msg || data?.message || "创建订单失败", raw: data };
}

export interface QueryOrderResult {
  paid: boolean;
  amount?: string;
  msg?: string;
  raw?: unknown;
}

/** 按商户订单号查询订单支付状态 */
export async function queryOutOrder(orderNo: string): Promise<QueryOrderResult> {
  const merchantNum = getMerchantNum();
  const sign = signQueryOutOrder(orderNo);

  const params = new URLSearchParams({ merchantNum, orderNo, sign });

  let res: Response;
  try {
    res = await fetchWithRetry(`${getApiRoot()}/queryOutOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  } catch (err: any) {
    console.log("[v0] queryOutOrder 连接支付网关失败:", err?.message);
    return { paid: false, msg: "连接支付网关失败" };
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    console.log("[v0] queryOutOrder 返回非JSON:", text.slice(0, 300));
    return { paid: false, msg: "查询返回非JSON" };
  }

  console.log("[v0] queryOutOrder 原始返回:", JSON.stringify(data));

  // 兼容多层级返回；支付FM 的支付状态字段为 orderState，支付成功=4（见文档 docs.zhifux.com）
  const d = data?.data ?? data;
  const orderState = String(d?.orderState ?? "").trim();
  const stateDesc = String(d?.orderStateDesc ?? d?.stateDesc ?? "");
  // 其它字段名兜底（不同版本接口可能不同）
  const rawState = d?.state ?? d?.status ?? d?.tradeState ?? d?.payState ?? data?.state;
  const s = String(rawState ?? "").toLowerCase();

  const paid =
    orderState === "4" || // 文档定义：4 = 支付成功
    /成功|已支付/.test(stateDesc) ||
    ["success", "paid", "ok", "true", "已支付", "支付成功"].includes(s);

  const amount = d?.tradeMoney ?? d?.amount ?? d?.money ?? d?.totalAmount ?? data?.amount;

  return { paid, amount: amount != null ? String(amount) : undefined, msg: data?.msg, raw: data };
}
