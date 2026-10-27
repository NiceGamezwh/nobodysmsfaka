// 商品档位配置（客户端与服务端共享，不含任何密钥）
// 每个档位对应一个链上卡密合约（Sepolia 测试网）
// 注册卡密：账号----密码；充值卡密：单码不透明字符串（同 MemberCardQueue）

export type ProductKind = "register" | "recharge";

export type RegisterTier = "3" | "15" | "30";
export type RechargeTier = "r15" | "r30" | "r60";
export type Tier = RegisterTier | RechargeTier;

export interface Product {
  tier: Tier;
  /** 商品类型 */
  kind: ProductKind;
  /** 展示名 */
  name: string;
  /** 价格，单位：元，字符串形式（用于支付金额与签名，必须两位小数） */
  amount: string;
  /** 卡密合约地址（Sepolia） */
  contract: string;
  /** 卖点描述 */
  desc: string;
  /** 卡片主色 */
  accent: string;
  /** 是否高亮推荐 */
  featured?: boolean;
  /**
   * 是否使用 MemberCardQueue（getNextCard / CardTaken）。
   * 全档位均为 true：合约按完整字符串存储。
   */
  member?: boolean;
  features: string[];
}

/** 展示用价格（元），从 amount 解析，避免 r15 等 tier id 直接当价格 */
export function displayYuan(p: Pick<Product, "amount">): string {
  const n = Number(p.amount);
  if (!Number.isFinite(n)) return p.amount;
  return Number.isInteger(n) ? String(n) : String(n);
}

export const PRODUCTS: Record<Tier, Product> = {
  "3": {
    tier: "3",
    kind: "register",
    name: "入门卡密",
    amount: "3.00",
    contract: "0xE482CC61DF0dBca6AB3A694a8813Bacf13A04976",
    member: true,
    desc: "少量测试首选，卡密价格即账户余额",
    accent: "#888888",
    features: ["链上唯一卡密", "账号+密码", "付款即时发放", "永久有效", "适合先行测试", "3元余额账号"],
  },
  "15": {
    tier: "15",
    kind: "register",
    name: "标准卡密",
    amount: "15.00",
    contract: "0x4F3C14b4cFC5D3a27B00FF737Eab28D948517c9e",
    member: true,
    desc: "常用之选，余额更充足",
    accent: "#F5F5F0",
    features: ["链上唯一卡密", "账号+密码", "付款即时发放", "永久有效", "优先出库", "15元余额账号"],
  },
  "30": {
    tier: "30",
    kind: "register",
    name: "高级卡密",
    amount: "30.00",
    contract: "0xFC76E223573BC92F24a2A956cd6f771D1059de6d",
    member: true,
    desc: "高面值卡密，余额更充足",
    accent: "#FFD600",
    featured: true,
    features: ["链上唯一卡密", "账号+密码", "付款即时发放", "永久有效", "高面值优先", "30元余额账号"],
  },
  r15: {
    tier: "r15",
    kind: "recharge",
    name: "充值卡密 ¥15",
    amount: "15.00",
    contract: "0x4668114059aF15AC701045AD311DFa974370Ef0e",
    member: true,
    desc: "单码充值，付款后即时发放",
    accent: "#7EC8E3",
    features: ["链上唯一卡密", "单码充值", "付款即时发放", "永久有效", "15元充值卡密"],
  },
  r30: {
    tier: "r30",
    kind: "recharge",
    name: "充值卡密 ¥30",
    amount: "30.00",
    contract: "0x0785Bf86A9B9869940F4F605c58386a4BFD0E1CB",
    member: true,
    desc: "单码充值，余额更充足",
    accent: "#A8E6CF",
    featured: true,
    features: ["链上唯一卡密", "单码充值", "付款即时发放", "永久有效", "30元充值卡密"],
  },
  r60: {
    tier: "r60",
    kind: "recharge",
    name: "充值卡密 ¥60",
    amount: "60.00",
    contract: "0x9aCDfa778ED64AB2D1297FB735862ebdEC97Bc12",
    member: true,
    desc: "高面值单码充值",
    accent: "#FFB347",
    features: ["链上唯一卡密", "单码充值", "付款即时发放", "永久有效", "60元充值卡密"],
  },
};

export const REGISTER_TIERS: RegisterTier[] = ["3", "15", "30"];
export const RECHARGE_TIERS: RechargeTier[] = ["r15", "r30", "r60"];
export const TIER_LIST: Tier[] = [...REGISTER_TIERS, ...RECHARGE_TIERS];

export function getProduct(tier: string): Product | null {
  if (
    tier === "3" ||
    tier === "15" ||
    tier === "30" ||
    tier === "r15" ||
    tier === "r30" ||
    tier === "r60"
  ) {
    return PRODUCTS[tier];
  }
  return null;
}
