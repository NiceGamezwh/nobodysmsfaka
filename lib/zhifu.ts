// 支付FM 接口封装（仅服务端使用，包含接入密钥）
import crypto from "crypto";

const API_ROOT = "https://api-54kn0m8dooow.zhifu.fm.it88168.com/api";

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

  const res = await fetch(`${API_ROOT}/startOrder`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

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

  const res = await fetch(`${API_ROOT}/queryOutOrder`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

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
