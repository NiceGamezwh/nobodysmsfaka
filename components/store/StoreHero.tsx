"use client";

import Link from "next/link";
import GlitchText from "@/components/GlitchText";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function StoreHero() {
  return (
    <section className="relative flex flex-col items-center w-full bg-[#0A0A0A] py-16 px-6 md:py-[110px] md:px-[120px] overflow-hidden">
      <div className="flex items-center justify-center gap-[8px] h-[32px] px-[12px] md:px-[16px] bg-[#1A1A1A] border-2 border-[#FFD600]">
        <div className="w-[8px] h-[8px] bg-[#FFD600] shrink-0" />
        <span className="font-ibm-mono text-[9px] md:text-[11px] font-bold text-[#FFD600] tracking-[1px] md:tracking-[2px] whitespace-nowrap">
          [LIVE] // 注册专用卡密 · ¥0.01～¥0.1 随机
        </span>
      </div>

      <div className="h-8 md:h-[32px]" />

      <h1 className="font-grotesk text-[clamp(32px,9vw,88px)] font-bold text-[#F5F5F0] tracking-[-1px] leading-none text-center w-full max-w-[1000px]">
        <GlitchText text="付款即发卡" speed={70} delay={100} />
      </h1>
      <h1 className="font-grotesk text-[clamp(32px,9vw,88px)] font-bold text-[#FFD600] tracking-[-1px] leading-none text-center w-full max-w-[1000px]">
        <GlitchText text="卡密永久有效" speed={70} delay={500} />
      </h1>

      <div className="h-8 md:h-[32px]" />

      <p className="font-ibm-mono text-[13px] md:text-[15px] text-[#888888] tracking-[1px] leading-[1.7] text-center w-full max-w-[720px] text-pretty">
        本页仅售<strong className="text-[#FFD600] font-normal">注册专用</strong>卡密（账号+密码），价格 ¥0.01～¥0.1 随机，用于新开账号；象征性收费是为了防止恶意批量注册。
        <br className="hidden md:block" />
        没有看完教程的请勿购买，售出不退。需要给已有账号充值请前往充值卡密页。
      </p>

      <div className="h-5 md:h-6" />

      <p className="font-ibm-mono text-[12px] md:text-[13px] text-[#888888] tracking-[1px] leading-[1.7] text-center w-full max-w-[720px]">
        <a
          href="https://www.yuque.com/nobodysms/xlypsu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FFD600] hover:underline"
        >
          官方教程
        </a>
        <span className="text-[#555] mx-3">·</span>
        <a
          href="https://nobodysms.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FFD600] hover:underline"
        >
          官网
        </a>
      </p>

      <div className="h-10 md:h-[48px]" />

      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-[16px] w-full sm:w-auto">
        <button
          onClick={() => scrollTo("products")}
          className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors cursor-pointer border-none"
        >
          <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
            浏览注册卡密
          </span>
        </button>
        <Link
          href="/recharge"
          className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#0A0A0A] border-2 border-[#7EC8E3] hover:bg-[#111] transition-colors no-underline"
        >
          <span className="font-ibm-mono text-[12px] text-[#7EC8E3] tracking-[2px]">充值卡密页 &gt;</span>
        </Link>
      </div>
    </section>
  );
}
