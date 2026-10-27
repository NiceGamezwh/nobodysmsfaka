// 商品档位配置（客户端与服务端共享，不含任何密钥）
// 每个档位对应一个链上卡密合约（Sepolia 测试网）
// 三种面值共用同一种卡密类型：账号----密码（MemberCardQueue）

export type Tier = "3" | "15" | "30";

export interface Product {
  tier: Tier;
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
   * 全档位均为 true：卡密格式 账号----密码，合约按完整字符串存储。
   */
  member?: boolean;
  features: string[];
}

export const PRODUCTS: Record<Tier, Product> = {
  "3": {
    tier: "3",
    name: "入门卡密",
    amount: "3.00",
    contract: "0xE482CC61DF0dBca6AB3A694a8813Bacf13A04976",
    member: true,
    desc: "少量测试首选，卡密价格即账户余额",
    accent: "#888888",
    features: ["链上唯一卡密", "账号+密码", "付款即时发放", "永久有效", "适合先行测试"],
  },
  "15": {
    tier: "15",
    name: "标准卡密",
    amount: "15.00",
    contract: "0x4F3C14b4cFC5D3a27B00FF737Eab28D948517c9e",
    member: true,
    desc: "常用之选，余额更充足",
    accent: "#F5F5F0",
    features: ["链上唯一卡密", "账号+密码", "付款即时发放", "永久有效", "优先出库"],
  },
  "30": {
    tier: "30",
    name: "高级卡密",
    amount: "30.00",
    contract: "0xFC76E223573BC92F24a2A956cd6f771D1059de6d",
    member: true,
    desc: "高面值卡密，余额更充足",
    accent: "#FFD600",
    featured: true,
    features: ["链上唯一卡密", "账号+密码", "付款即时发放", "永久有效", "高面值优先"],
  },
};

export const TIER_LIST: Tier[] = ["3", "15", "30"];

export function getProduct(tier: string): Product | null {
  if (tier === "3" || tier === "15" || tier === "30") {
    return PRODUCTS[tier];
  }
  return null;
}
