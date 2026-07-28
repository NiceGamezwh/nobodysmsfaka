"use client";

import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";

const FAQS = [
  {
    q: "卡密是什么格式？",
    a: "普通卡密为「账号----密码」格式，会员卡密为「账号----密码----对接码密钥」格式，账号与密码均为 64 位十六进制字符串，由智能合约校验后存储。",
  },
  {
    q: "支付后多久能拿到卡密？",
    a: "支付宝到账后自动返回领取页即可领取。拿到卡密后请妥善保存。",
  },
  {
    q: "具体如何收费？",
    a: "价格按照收到的短信次数收费，0.36 元一次，收不到不扣费。",
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

export default function StoreFAQ() {
  return (
    <section
      id="faq"
      className="flex flex-col w-full bg-[#080808] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader label="[03] // 常见问题" title={"关于卡密\n你想知道的。"} />
      <div className="flex flex-col gap-[2px] w-full max-w-[860px]">
        {FAQS.map((f, i) => (
          <Item key={i} {...f} />
        ))}
      </div>
    </section>
  );
}
