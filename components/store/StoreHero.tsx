"use client";

import GlitchText from "@/components/GlitchText";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function StoreHero() {
  return (
    <section className="relative flex flex-col items-center w-full bg-[#0A0A0A] py-16 px-6 md:py-[110px] md:px-[120px] overflow-hidden">
      {/* 徽标 */}
      <div className="flex items-center justify-center gap-[8px] h-[32px] px-[12px] md:px-[16px] bg-[#1A1A1A] border-2 border-[#FFD600]">
        <div className="w-[8px] h-[8px] bg-[#FFD600] shrink-0" />
        <span className="font-ibm-mono text-[9px] md:text-[11px] font-bold text-[#FFD600] tracking-[1px] md:tracking-[2px] whitespace-nowrap">
          [LIVE] // 智能合约自动发卡
        </span>
      </div>

      <div className="h-8 md:h-[32px]" />

      {/* 主标题 */}
      <h1 className="font-grotesk text-[clamp(32px,9vw,88px)] font-bold text-[#F5F5F0] tracking-[-1px] leading-none text-center w-full max-w-[1000px]">
        <GlitchText text="付款即发卡" speed={70} delay={100} />
      </h1>
      <h1 className="font-grotesk text-[clamp(32px,9vw,88px)] font-bold text-[#FFD600] tracking-[-1px] leading-none text-center w-full max-w-[1000px]">
        <GlitchText text="卡密永久有效" speed={70} delay={500} />
      </h1>

      <div className="h-8 md:h-[32px]" />

      {/* 副标题 */}
      <p className="font-ibm-mono text-[13px] md:text-[15px] text-[#888888] tracking-[1px] leading-[1.7] text-center w-full max-w-[720px] text-pretty">
        请提前看完教程再拍卡密使用，如需少量测试建议购买 3 元卡密。卡密价格对应其余额，
        <br className="hidden md:block" />
        高级卡密自动激活永久会员，后续充值享 9 折优惠。
      </p>

      <div className="h-10 md:h-[48px]" />

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-[16px] w-full sm:w-auto">
        <button
          onClick={() => scrollTo("products")}
          className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors cursor-pointer border-none"
        >
          <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
            浏览商品
          </span>
        </button>
        <button
          onClick={() => scrollTo("steps")}
          className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#0A0A0A] border-2 border-[#3D3D3D] hover:border-[#888888] transition-colors cursor-pointer"
        >
          <span className="font-ibm-mono text-[12px] text-[#888888] tracking-[2px]">购买流程 &gt;</span>
        </button>
      </div>
    </section>
  );
}
