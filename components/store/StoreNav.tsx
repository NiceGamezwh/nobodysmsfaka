"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "商品", section: "products" },
  { label: "购买流程", section: "steps" },
  { label: "常见问题", section: "faq" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function StoreNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid #1E1E1E" : "1px solid transparent",
      }}
    >
      <div className="flex items-center justify-between h-[60px] px-6 md:px-[48px] max-w-[1400px] mx-auto">
        <a href="#" className="flex items-center gap-[10px] shrink-0 group">
          <span className="w-[10px] h-[10px] bg-[#FFD600] group-hover:scale-110 transition-transform" />
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
            NobodySMS 官方卡密
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-[36px]">
          {links.map(({ label, section }) => (
            <button
              key={label}
              onClick={() => scrollTo(section)}
              className="font-ibm-mono text-[11px] text-[#666] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors bg-transparent border-none cursor-pointer"
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => scrollTo("products")}
          className="font-grotesk text-[11px] font-bold text-[#0A0A0A] bg-[#FFD600] tracking-[1.5px] px-[18px] py-[9px] hover:bg-[#F5F5F0] transition-colors cursor-pointer border-none"
        >
          立即购买
        </button>
      </div>
    </header>
  );
}
