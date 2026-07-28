// 商品档位配置（客户端与服务端共享，不含任何密钥）
// 每个档位对应一个链上卡密合约（Sepolia 测试网）

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
   * 是否为会员卡密（三段式：账号----密码----对接码密钥）。
   * 会员卡密使用 MemberCardQueue 合约（getNextCard / CardTaken），
   * 普通卡密使用原合约（getKami / KamiClaimed）。
   */
  member?: boolean;
  features: string[];
}

export const PRODUCTS: Record<Tier, Product> = {
  "3": {
    tier: "3",
    name: "入门卡密",
    amount: "3.00",
    contract: "0x50ffFc85D98c65e6CFf8cF4F19fe26717A5f50bB",
    desc: "少量测试首选，卡密价格即账户余额",
    accent: "#888888",
    features: ["链上唯一卡密", "付款即时发放", "永久有效", "适合先行测试", "后续无法充值", "无对接码密钥"],
  },
  "15": {
    tier: "15",
    name: "标准卡密",
    amount: "15.00",
    contract: "0x7AB6dc1bE49C133cd3be5F55BcfADE21a62088AD",
    desc: "常用之选，余额更充足",
    accent: "#F5F5F0",
    features: ["链上唯一卡密", "付款即时发放", "永久有效", "优先出库", "后续无法充值", "无对接码密钥"],
  },
  "30": {
    tier: "30",
    name: "高级卡密",
    amount: "30.00",
    // MemberCardQueue（会员卡密队列）合约，三段式：账号----密码----对接码密钥。
    // 旧合约 0xccab3fFbFB420B2F5B7ac4633946ef1A0F710696 已弃用（仅两段式，无对接码密钥）。
    contract: "0xD33FA1B603B3e4c14EAcf63b0D78eA6FA0fA3754",
    member: true,
    desc: "自动激活永久会员，尊享专属权益",
    accent: "#FFD600",
    featured: true,
    features: [
      "自动激活永久会员",
      "后续充值永久享 9 折优惠",
      "邀请返利：下级消费 5% 返还",
      "新功能优先体验 & 专属定制服务",
      "赠送专属对接码密钥",
    ],
  },
};

export const TIER_LIST: Tier[] = ["3", "15", "30"];

export function getProduct(tier: string): Product | null {
  if (tier === "3" || tier === "15" || tier === "30") {
    return PRODUCTS[tier];
  }
  return null;
}
