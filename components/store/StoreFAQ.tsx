"use client";

import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";

const REGISTER_FAQS = [
  {
    q: "为什么注册卡密标价 ¥0.01？实付会不一样吗？",
    a: "这是注册专用卡密，下单金额固定为 ¥0.01，方便开户并防止恶意批量注册。支付渠道可能在约 ¥0.01～¥0.10 间微调实付金额，请以支付页显示为准。本页不出售 15/30 元注册档。",
  },
  {
    q: "卡密是什么格式？",
    a: "注册卡密统一为「账号----密码」格式，仅用于新账号注册，卡密永久有效。",
  },
  {
    q: "支付后多久能拿到卡密？",
    a: "支付宝到账后自动返回领取页即可领取。拿到卡密后请妥善保存。",
  },
  {
    q: "具体如何收费？",
    a: "价格按照收到的短信次数收费，0.36 元一次，收不到不扣费。",
  },
  {
    q: "卡密已售罄怎么办？",
    a: "如果卡密已售罄请不要购买，联系管理员进行补货，请在卡密有库存的时候购买。",
  },
];

const RECHARGE_FAQS = [
  {
    q: "充值卡密是什么格式？",
    a: "充值卡密为单码（无分隔符），例如一串字母数字；卡密永久有效。",
  },
  {
    q: "支付后多久能拿到卡密？",
    a: "支付宝到账后自动返回领取页即可领取。请立即复制保存充值码。",
  },
  {
    q: "和注册卡密有什么区别？",
    a: "注册卡密用于新开账号（账号----密码）；本页充值卡密用于给已有账号充值余额。",
  },
  {
    q: "卡密已售罄怎么办？",
    a: "如果卡密已售罄请不要购买，联系管理员进行补货，请在卡密有库存的时候购买。",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-4 w-full px-6 py-5 text-left cursor-pointer bg-transparent border-none"
      >
        <span className="font-grotesk text-[15px] font-bold text-[#F5F5F0] tracking-[0.5px]">{q}</span>
        <span
          className="font-ibm-mono text-[18px] text-[#FFD600] shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "240px" : "0px" }}
      >
        <p className="font-ibm-mono text-[12px] text-[#888888] tracking-[0.5px] leading-relaxed px-6 pb-6">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function StoreFAQ({
  variant = "register",
}: {
  variant?: "register" | "recharge";
}) {
  const faqs = variant === "recharge" ? RECHARGE_FAQS : REGISTER_FAQS;
  return (
    <section
      id="faq"
      className="flex flex-col w-full bg-[#080808] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader label="[03] // 常见问题" title={"关于卡密\n你想知道的。"} />
      <div className="flex flex-col gap-[2px] w-full max-w-[860px]">
        {faqs.map((f, i) => (
          <Item key={i} {...f} />
        ))}
      </div>
    </section>
  );
}
