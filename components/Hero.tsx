"use client";

import { useEffect, useState } from "react";
import GlitchText from "@/components/GlitchText";
import CollabCursors from "@/components/CollabCursors";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative flex flex-col items-center w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] overflow-hidden">
      {/* Badge */}
      <div className="flex items-center justify-center gap-[8px] h-[32px] px-[12px] md:px-[16px] bg-[#1A1A1A] border-2 border-[#FFD600]">
        <div className="w-[8px] h-[8px] bg-[#FFD600] shrink-0" />
        <span className="font-ibm-mono text-[9px] md:text-[11px] font-bold text-[#FFD600] tracking-[1px] md:tracking-[2px] whitespace-nowrap">
          [NEW] // VERSION 2.0 NOW LIVE
        </span>
      </div>

      <div className="h-8 md:h-[32px]" />

      {/* Headline */}
      <h1 className="font-grotesk text-[clamp(32px,10vw,96px)] font-bold text-[#F5F5F0] tracking-[-1px] leading-none text-center w-full max-w-[1100px]">
        <GlitchText text="BUILD WITHOUT" speed={45} delay={100} />
        <br />
        <GlitchText text="LIMITS." speed={45} delay={400} />
      </h1>
      <h1 className="font-grotesk text-[clamp(32px,10vw,96px)] font-bold text-[#FFD600] tracking-[-1px] leading-none text-center w-full max-w-[1100px]">
        <GlitchText text="PIXEL-PERFECT." speed={45} delay={700} />
      </h1>

      <div className="h-8 md:h-[32px]" />

      {/* Subheading */}
      <p className="font-ibm-mono text-[13px] md:text-[15px] text-[#888888] tracking-[1px] leading-[1.6] text-center w-full max-w-[800px]">
        THE INDUSTRIAL-GRADE DESIGN SYSTEM FOR BUILDERS WHO DON&apos;T
        COMPROMISE.
        <br />
        FROM PIXEL 01 TO PRODUCTION DEPLOY.
      </p>

      <div className="h-10 md:h-[48px]" />

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-[16px] w-full sm:w-auto">
        <button className="flex items-center justify-center w-full sm:w-[220px] h-[56px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors">
          <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
            START BUILDING FREE
          </span>
        </button>
        <button className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#0A0A0A] border-2 border-[#3D3D3D] hover:border-[#888888] transition-colors">
          <span className="font-ibm-mono text-[12px] text-[#888888] tracking-[2px]">
            VIEW DOCS &gt;
          </span>
        </button>
      </div>

      <div className="h-6 md:h-[24px]" />

      <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[2px] text-center">
        NO CREDIT CARD // FREE FOREVER PLAN // 10,000+ BUILDERS
      </p>

      <div className="h-12 md:h-[64px]" />

      {/* Animated Design Interface */}
      <div
        className="w-full max-w-[1100px] bg-[#0F0F0F] overflow-hidden"
        style={{ border: "2px solid #2D2D2D" }}
      >
        <DesignInterfaceSVG mounted={mounted} />
      </div>

      {/* Collab cursors on the full hero */}
      <CollabCursors />
    </section>
  );
}

/* ──────────────────────────────── SVG ──────────────────────────────── */

const layers = [
  { label: "FRAME / HERO", color: "#FFD600", indent: 0, active: true },
  { label: "NAVBAR", color: "#888", indent: 12 },
  { label: "HEADLINE", color: "#4ADE80", indent: 12 },
  { label: "SUBTEXT", color: "#888", indent: 12 },
  { label: "CTA GROUP", color: "#FF6B35", indent: 12 },
  { label: "BTN / PRIMARY", color: "#FF6B35", indent: 24 },
  { label: "BTN / GHOST", color: "#888", indent: 24 },
  { label: "MEDIA BLOCK", color: "#60A5FA", indent: 12 },
  { label: "FOOTER", color: "#888", indent: 0 },
];

const inspectProps = [
  { key: "W", val: "1100px" },
  { key: "H", val: "580px" },
  { key: "X", val: "0" },
  { key: "Y", val: "0" },
  { key: "FILL", val: "#0F0F0F", swatch: "#0F0F0F" },
  { key: "BORDER", val: "#FFD600", swatch: "#FFD600" },
  { key: "RADIUS", val: "0px" },
  { key: "OPACITY", val: "100%" },
];

const tokens = [
  { name: "primary", hex: "#FFD600" },
  { name: "accent", hex: "#FF6B35" },
  { name: "surface", hex: "#111111" },
  { name: "text", hex: "#F5F5F0" },
  { name: "muted", hex: "#555555" },
];

const codeLines = [
  { w: 80, color: "#4ADE80", x: 325 },
  { w: 140, color: "#60A5FA", x: 345 },
  { w: 100, color: "#888", x: 355 },
  { w: 120, color: "#FF6B35", x: 345 },
  { w: 90, color: "#888", x: 355 },
  { w: 160, color: "#4ADE80", x: 355 },
  { w: 80, color: "#888", x: 345 },
  { w: 110, color: "#60A5FA", x: 325 },
];

const handles: [number, number][] = [
  [280, 90], [570, 90], [860, 90],
  [280, 280], [860, 280],
  [280, 470], [570, 470], [860, 470],
];

const tickerItems = [
  "BUTTON", "INPUT", "CARD", "MODAL", "BADGE",
  "TOOLTIP", "TOGGLE", "SLIDER", "TABLE", "NAVBAR",
];

function DesignInterfaceSVG({ mounted }: { mounted: boolean }) {
  return (
    <>
      {/* Global CSS keyframes for SVG animations */}
      <style>{`
        @keyframes hero-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hero-scan { 0%{transform:translateY(-580px)} 100%{transform:translateY(580px)} }
        @keyframes hero-pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes hero-ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-700px)} }
        .hero-cursor { animation: hero-blink 1.1s step-end infinite; }
        .hero-scan { animation: hero-scan 4s linear infinite; }
        .hero-pulse { animation: hero-pulse 2s ease-in-out infinite; }
        .hero-ticker-track { animation: hero-ticker 14s linear infinite; }
      `}</style>

      <svg
        viewBox="0 0 1100 580"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        {/* BG */}
        <rect width="1100" height="580" fill="#0F0F0F" />

        {/* Scanline */}
        <rect className="hero-scan" x="0" y="0" width="1100" height="6" fill="rgba(255,214,0,0.03)" />

        {/* Grid dots */}
        {Array.from({ length: 22 }, (_, c) =>
          Array.from({ length: 12 }, (_, r) => (
            <circle key={`d${c}-${r}`} cx={c * 50 + 25} cy={r * 50 + 25} r="1" fill="#1A1A1A" />
          ))
        )}

        {/* ── LEFT PANEL ── */}
        <rect x="0" y="0" width="200" height="580" fill="#111111" />
        <line x1="200" y1="0" x2="200" y2="580" stroke="#2D2D2D" strokeWidth="1" />

        {/* Panel header */}
        <rect x="0" y="0" width="200" height="36" fill="#161616" />
        <text x="12" y="23" fontFamily="monospace" fontSize="9" fill="#FFD600" letterSpacing={2} fontWeight="700">LAYERS</text>
        <text x="176" y="23" fontFamily="monospace" fontSize="12" fill="#444">+</text>

        {/* Layer list */}
        {layers.map((l, i) => {
          const y = 36 + i * 32;
          return (
            <g
              key={i}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(6px)",
                transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
              }}
            >
              {l.active && <rect x="0" y={y} width="200" height="32" fill="#1E1E1E" />}
              {l.active && <rect x="0" y={y} width="2" height="32" fill="#FFD600" />}
              <circle cx={20 + l.indent} cy={y + 16} r="3" fill={l.color} opacity="0.8" />
              <text x={32 + l.indent} y={y + 20} fontFamily="monospace" fontSize="9" fill={l.active ? "#F5F5F0" : "#555"} letterSpacing={0.5}>
                {l.label}
              </text>
            </g>
          );
        })}

        {/* ── RIGHT PANEL ── */}
        <rect x="899" y="0" width="201" height="580" fill="#111111" />
        <line x1="899" y1="0" x2="899" y2="580" stroke="#2D2D2D" strokeWidth="1" />
        <rect x="899" y="0" width="201" height="36" fill="#161616" />
        <text x="912" y="23" fontFamily="monospace" fontSize="9" fill="#FFD600" letterSpacing={2} fontWeight="700">INSPECT</text>

        {/* Inspect props */}
        {inspectProps.map((p, i) => {
          const y = 56 + i * 26;
          return (
            <g
              key={i}
              style={{
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.4s ease ${0.1 + i * 0.06}s`,
              }}
            >
              <text x="912" y={y} fontFamily="monospace" fontSize="8" fill="#555" letterSpacing={1}>{p.key}</text>
              {p.swatch && <rect x="970" y={y - 9} width="10" height="10" fill={p.swatch} rx="1" />}
              <text x={p.swatch ? "986" : "970"} y={y} fontFamily="monospace" fontSize="8" fill="#888" letterSpacing={0.5}>{p.val}</text>
            </g>
          );
        })}

        {/* Separator + Tokens title */}
        <line x1="899" y1="278" x2="1100" y2="278" stroke="#222" strokeWidth="1" />
        <text x="912" y="300" fontFamily="monospace" fontSize="9" fill="#FFD600" letterSpacing={2} fontWeight="700">TOKENS</text>

        {/* Token swatches */}
        {tokens.map((t, i) => {
          const y = 316 + i * 28;
          return (
            <g key={i}>
              <rect x="912" y={y} width="12" height="12" fill={t.hex} rx="1" />
              <text x="932" y={y + 10} fontFamily="monospace" fontSize="8" fill="#666" letterSpacing={0.5}>{t.name}</text>
              <text x="990" y={y + 10} fontFamily="monospace" fontSize="8" fill="#444" letterSpacing={0.5}>{t.hex}</text>
            </g>
          );
        })}

        {/* ── CENTER CANVAS ── */}

        {/* Toolbar */}
        <rect x="200" y="0" width="700" height="36" fill="#141414" />
        <line x1="200" y1="36" x2="900" y2="36" stroke="#2D2D2D" strokeWidth="1" />

        {/* Tool buttons */}
        {["V", "F", "T", "P"].map((label, t) => (
          <g key={t}>
            <rect x={218 + t * 28} y="9" width="18" height="18" rx="2" fill={t === 0 ? "#FFD600" : "#1E1E1E"} />
            <text x={223 + t * 28} y="22" fontFamily="monospace" fontSize="9" fill={t === 0 ? "#0A0A0A" : "#444"}>{label}</text>
          </g>
        ))}
        <line x1="340" y1="11" x2="340" y2="25" stroke="#2D2D2D" strokeWidth="1" />
        <text x="356" y="23" fontFamily="monospace" fontSize="9" fill="#555" letterSpacing={1}>100%</text>

        {/* Rulers */}
        <rect x="200" y="36" width="700" height="16" fill="#131313" />
        {Array.from({ length: 35 }, (_, i) => (
          <g key={`rh${i}`}>
            <rect x={200 + i * 20} y="36" width="1" height={i % 5 === 0 ? 8 : 4} fill="#2A2A2A" />
            {i % 5 === 0 && (
              <text x={202 + i * 20} y="50" fontFamily="monospace" fontSize="6" fill="#333">{i * 20}</text>
            )}
          </g>
        ))}
        <rect x="200" y="52" width="16" height="528" fill="#131313" />
        {Array.from({ length: 26 }, (_, i) => (
          <g key={`rv${i}`}>
            <rect x="200" y={52 + i * 20} width={i % 5 === 0 ? 8 : 4} height="1" fill="#2A2A2A" />
          </g>
        ))}

        {/* ── Frame (selected) ── */}
        <rect x="280" y="90" width="540" height="380" fill="#0A0A0A" stroke="#FFD600" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="280" y="84" fontFamily="monospace" fontSize="8" fill="#FFD600" letterSpacing={1}>FRAME / HERO — 1100 x 580</text>

        {/* Selection handles */}
        {handles.map(([hx, hy], i) => (
          <rect key={`h${i}`} x={hx - 3} y={hy - 3} width="6" height="6" fill="#FFD600" stroke="#0A0A0A" strokeWidth="1" />
        ))}

        {/* Mock UI inside the frame */}
        {/* Navbar */}
        <rect x="280" y="90" width="540" height="36" fill="#111111" />
        <line x1="280" y1="126" x2="820" y2="126" stroke="#2D2D2D" strokeWidth="1" />
        <rect x="295" y="102" width="44" height="10" rx="1" fill="#FFD600" opacity="0.9" />
        <rect x="640" y="103" width="28" height="8" rx="1" fill="#222" />
        <rect x="676" y="103" width="28" height="8" rx="1" fill="#222" />
        <rect x="715" y="101" width="38" height="12" fill="#FFD600" />

        {/* Headline blocks */}
        <rect x="310" y="148" width="300" height="18" rx="1" fill="#F5F5F0" opacity="0.9" />
        <rect x="310" y="172" width="220" height="18" rx="1" fill="#FFD600" opacity="0.9" />

        {/* Subtext lines */}
        <rect x="310" y="204" width="240" height="5" rx="1" fill="#444" />
        <rect x="310" y="215" width="200" height="5" rx="1" fill="#333" />

        {/* CTA buttons */}
        <rect x="310" y="236" width="100" height="24" fill="#FFD600" />
        <text x="325" y="252" fontFamily="monospace" fontSize="7" fill="#0A0A0A" fontWeight="700" letterSpacing={0.5}>START FREE</text>
        <rect x="418" y="236" width="90" height="24" fill="none" stroke="#3D3D3D" strokeWidth="1.5" />
        <text x="430" y="252" fontFamily="monospace" fontSize="7" fill="#555" letterSpacing={0.5}>VIEW DOCS</text>

        {/* Code editor block */}
        <rect x="310" y="280" width="490" height="168" fill="#161616" stroke="#222" strokeWidth="1" />
        {/* Title bar */}
        <rect x="310" y="280" width="490" height="18" fill="#1A1A1A" />
        <circle cx="322" cy="289" r="3" fill="#FF5F57" />
        <circle cx="332" cy="289" r="3" fill="#FEBC2E" />
        <circle cx="342" cy="289" r="3" fill="#28C840" />
        <text x="360" y="293" fontFamily="monospace" fontSize="7" fill="#333" letterSpacing={1}>preview.tsx — PixelCraft</text>

        {/* Code lines */}
        {codeLines.map((cl, i) => (
          <rect key={`cl${i}`} x={cl.x} y={308 + i * 16} width={cl.w} height="5" rx="1" fill={cl.color} opacity="0.35" />
        ))}

        {/* Blinking cursor */}
        <rect className="hero-cursor" x="465" y="340" width="6" height="10" fill="#FFD600" opacity="0.9" />

        {/* ── Measurement guides ── */}
        {/* Right side spacing */}
        <line x1="820" y1="148" x2="860" y2="148" stroke="#FF6B35" strokeWidth="0.75" strokeDasharray="3 2" />
        <line x1="820" y1="190" x2="860" y2="190" stroke="#FF6B35" strokeWidth="0.75" strokeDasharray="3 2" />
        <line x1="850" y1="148" x2="850" y2="190" stroke="#FF6B35" strokeWidth="0.75" />
        <text x="835" y="173" fontFamily="monospace" fontSize="7" fill="#FF6B35" letterSpacing={0.5}>42px</text>

        {/* Gap guide */}
        <line x1="310" y1="226" x2="310" y2="236" stroke="#60A5FA" strokeWidth="0.75" strokeDasharray="2 2" />
        <line x1="410" y1="226" x2="410" y2="236" stroke="#60A5FA" strokeWidth="0.75" strokeDasharray="2 2" />
        <text x="345" y="233" fontFamily="monospace" fontSize="7" fill="#60A5FA" letterSpacing={0.5}>12px</text>

        {/* ── Bottom ticker ── */}
        <line x1="200" y1="514" x2="900" y2="514" stroke="#2D2D2D" strokeWidth="1" />
        <rect x="200" y="515" width="700" height="32" fill="#0F0F0F" />
        <clipPath id="tickerClip">
          <rect x="200" y="515" width="700" height="32" />
        </clipPath>
        <g clipPath="url(#tickerClip)">
          <g className="hero-ticker-track">
            {[...tickerItems, ...tickerItems].map((name, i) => (
              <g key={`t${i}`}>
                <circle cx={220 + i * 70} cy="531" r="3" fill="#FFD600" opacity="0.5" />
                <text x={230 + i * 70} y="535" fontFamily="monospace" fontSize="8" fill="#444" letterSpacing={1.5}>{name}</text>
              </g>
            ))}
          </g>
        </g>

        {/* ── Status bar ── */}
        <line x1="200" y1="547" x2="900" y2="547" stroke="#222" strokeWidth="1" />
        <rect x="200" y="548" width="700" height="32" fill="#0D0D0D" />
        <circle className="hero-pulse" cx="220" cy="564" r="4" fill="#4ADE80" />
        <text x="232" y="568" fontFamily="monospace" fontSize="8" fill="#555" letterSpacing={1}>READY</text>
        <text x="330" y="568" fontFamily="monospace" fontSize="8" fill="#333" letterSpacing={1}>9 LAYERS</text>
        <text x="430" y="568" fontFamily="monospace" fontSize="8" fill="#333" letterSpacing={1}>AUTO-LAYOUT ON</text>
        <text x="600" y="568" fontFamily="monospace" fontSize="8" fill="#333" letterSpacing={1}>GRID: 12 COL</text>
        <text x="730" y="568" fontFamily="monospace" fontSize="8" fill="#333" letterSpacing={1}>v2.0.1</text>

        {/* Corner accents */}
        <rect x="200" y="548" width="6" height="6" fill="#FFD600" opacity="0.5" />
        <rect x="894" y="548" width="6" height="6" fill="#FF6B35" opacity="0.4" />
      </svg>
    </>
  );
}
