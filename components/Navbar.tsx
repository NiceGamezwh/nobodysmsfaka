"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "FEATURES",  section: "features"  },
  { label: "COMPARE",   section: "comparison"},
  { label: "SHOWCASE",  section: "showcase"  },
  { label: "FAQ",       section: "faq"       },
  { label: "PRICING",   section: "pricing"   },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false);
  const [active, setActive]               = useState("");
  const [menuOpen, setMenuOpen]           = useState(false);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── active section via IntersectionObserver ── */
  useEffect(() => {
    const ids = links.map((l) => l.section).filter(Boolean);
    const obs: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-35% 0px -60% 0px" }
      );
      o.observe(el);
      obs.push(o);
    });

    return () => obs.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:       scrolled ? "rgba(10,10,10,0.88)" : "transparent",
        backdropFilter:   scrolled ? "blur(14px)"          : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)"      : "none",
        borderBottom:     scrolled ? "1px solid #1E1E1E"   : "1px solid transparent",
      }}
    >
      <div className="flex items-center justify-between h-[60px] px-6 md:px-[48px] max-w-[1400px] mx-auto">

        {/* ── Logo ── */}
        <a href="#" className="flex items-center gap-[10px] shrink-0 group">
          <span className="w-[10px] h-[10px] bg-[#FFD600] group-hover:scale-110 transition-transform" />
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
            PIXELCRAFT
          </span>
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-[36px]">
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                onClick={() => scrollTo(section)}
                className="relative font-ibm-mono text-[10px] tracking-[1.5px] transition-colors duration-150 bg-transparent border-none cursor-pointer"
                style={{ color: isActive ? "#FFD600" : "#555" }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "#F5F5F0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = isActive ? "#FFD600" : "#555";
                }}
              >
                {label}
                <span
                  className="absolute left-0 -bottom-[3px] h-[1.5px] bg-[#FFD600] transition-all duration-300"
                  style={{ width: isActive ? "100%" : "0%" }}
                />
              </button>
            );
          })}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-[14px]">
          <a
            href="#"
            className="font-ibm-mono text-[10px] text-[#555] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors"
          >
            LOG IN
          </a>
          <a
            href="#"
            className="font-grotesk text-[11px] font-bold text-[#0A0A0A] bg-[#FFD600] tracking-[1.5px] px-[18px] py-[9px] hover:bg-[#F5F5F0] transition-colors"
          >
            START FREE
          </a>
        </div>

        {/* ── Mobile burger ── */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-[20px] h-[1.5px] bg-[#F5F5F0] transition-transform duration-200 origin-center"
            style={{ transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }}
          />
          <span
            className="block w-[20px] h-[1.5px] bg-[#F5F5F0] transition-opacity duration-200"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-[20px] h-[1.5px] bg-[#F5F5F0] transition-transform duration-200 origin-center"
            style={{ transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight:    menuOpen ? "400px" : "0px",
          background:   "rgba(10,10,10,0.97)",
          backdropFilter: "blur(14px)",
          borderBottom: menuOpen ? "1px solid #1E1E1E" : "none",
        }}
      >
        <nav className="flex flex-col px-6 py-5 gap-0">
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                onClick={() => { scrollTo(section); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full font-ibm-mono text-[12px] tracking-[2px] py-[14px] border-b border-[#141414] transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer"
                style={{ color: isActive ? "#FFD600" : "#666" }}
              >
                <span
                  className="w-[4px] h-[4px] rounded-full shrink-0 transition-colors"
                  style={{ background: isActive ? "#FFD600" : "#2D2D2D" }}
                />
                {label}
              </button>
            );
          })}
          <div className="flex flex-col gap-[10px] pt-5">
            <a href="#" className="font-ibm-mono text-[12px] text-[#555] tracking-[1.5px]">LOG IN</a>
            <a
              href="#"
              className="font-grotesk text-[11px] font-bold text-[#0A0A0A] bg-[#FFD600] tracking-[1.5px] px-[18px] py-[11px] text-center hover:bg-[#F5F5F0] transition-colors"
            >
              START FREE
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
