"use client";

import Link from "next/link";
import GlitchText from "@/components/GlitchText";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function RechargeHero() {
  return (
    <section className="relative flex flex-col items-center w-full bg-[#0A0A0A] py-16 px-6 md:py-[110px] md:px-[120px] overflow-hidden">
      <div className="flex items-center justify-center gap-[8px] h-[32px] px-[12px] md:px-[16px] bg-[#1A1A1A] border-2 border-[#7EC8E3]">
        <div className="w-[8px] h-[8px] bg-[#7EC8E3] shrink-0" />
        <span className="font-ibm-mono text-[9px] md:text-[11px] font-bold text-[#7EC8E3] tracking-[1px] md:tracking-[2px] whitespace-nowrap">
          [LIVE] // 充值卡密专区
        </span>
      </div>

      <div className="h-8 md:h-[32px]" />

      <h1 className="font-grotesk text-[clamp(32px,9vw,88px)] font-bold text-[#F5F5F0] tracking-[-1px] leading-none text-center w-full max-w-[1000px]">
        <GlitchText text="账户充值" speed={70} delay={100} />
      </h1>
      <h1 className="font-grotesk text-[clamp(32px,9vw,88px)] font-bold text-[#7EC8E3] tracking-[-1px] leading-none text-center w-full max-w-[1000px]">
        <GlitchText text="付款即到账" speed={70} delay={500} />
      </h1>

      <div className="h-8 md:h-[32px]" />

      <p className="font-ibm-mono text-[13px] md:text-[15px] text-[#888888] tracking-[1px] leading-[1.7] text-center w-full max-w-[720px] text-pretty">
        没有看完教程的请勿购买，售出不退。充值卡密为单码格式，面额对应充值金额；付款后自动发放。
        <br className="hidden md:block" />
        本页仅售充值卡密：面额 ¥15 / ¥30 / ¥150，现价 ¥14 / ¥27 / ¥120。尽量用多少充多少，避免余额闲置。
      </p>

      <div className="h-5 md:h-6" />

      <p className="font-ibm-mono text-[12px] md:text-[13px] text-[#888888] tracking-[1px] leading-[1.7] text-center w-full max-w-[720px]">
        <a
          href="https://www.yuque.com/nobodysms/xlypsu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7EC8E3] hover:underline"
        >
          官方教程
        </a>
        <span className="text-[#555] mx-3">·</span>
        <Link href="/" className="text-[#FFD600] hover:underline">
          返回注册卡密
        </Link>
      </p>

      <div className="h-10 md:h-[48px]" />

      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-[16px] w-full sm:w-auto">
        <button
          onClick={() => scrollTo("products")}
          className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#7EC8E3] hover:bg-[#6bb8d4] transition-colors cursor-pointer border-none"
        >
          <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
            浏览充值档位
          </span>
        </button>
        <Link
          href="/"
          className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#0A0A0A] border-2 border-[#3D3D3D] hover:border-[#888] transition-colors no-underline"
        >
          <span className="font-ibm-mono text-[12px] text-[#888888] tracking-[2px]">注册卡密主页 &gt;</span>
        </Link>
      </div>
    </section>
  );
}
