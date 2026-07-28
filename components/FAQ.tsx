"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";

const faqs = [
  {
    question: "IS PIXELCRAFT REALLY FREE TO START?",
    answer:
      "YES. THE BUILDER PLAN IS FREE FOREVER. NO CREDIT CARD REQUIRED. 50 COMPONENTS, 1 PROJECT, AND FULL COMMUNITY ACCESS. UPGRADE ANYTIME — NO LOCK-IN, NO DARK PATTERNS.",
    defaultOpen: true,
  },
  { question: "DO I NEED TO KNOW HOW TO CODE?", answer: "NO. PIXELCRAFT IS DESIGNED FOR BOTH DESIGNERS AND DEVELOPERS. OUR VISUAL EDITOR REQUIRES ZERO CODING KNOWLEDGE TO BUILD PIXEL-PERFECT UIS." },
  { question: "HOW DOES EXPORT WORK?", answer: "SELECT ANY COMPONENT OR FRAME AND EXPORT TO REACT, VUE, FLUTTER, SVG, OR CSS WITH ONE CLICK. CODE IS CLEAN, PRODUCTION-READY, AND FOLLOWS YOUR CHOSEN FRAMEWORK CONVENTIONS." },
  { question: "CAN I MIGRATE FROM FIGMA?", answer: "YES. USE OUR FIGMA IMPORT PLUGIN TO BRING YOUR EXISTING DESIGNS INTO PIXELCRAFT. COMPONENTS, STYLES, AND LAYOUTS ARE AUTOMATICALLY CONVERTED." },
  { question: "WHAT FORMATS CAN I EXPORT TO?", answer: "REACT, VUE, ANGULAR, SVELTE, FLUTTER, HTML/CSS, SVG, AND TAILWIND. MORE FRAMEWORKS COMING SOON." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
      <section id="faq" className="flex flex-col w-full bg-[#060606] py-16 px-6 md:py-[100px] md:px-[120px]">
      <div className="w-full max-w-[480px]">
        <SectionHeader
          label="[08] // FAQ"
          title={"GOT\nQUESTIONS?"}
          subtitle="EVERYTHING YOU NEED TO KNOW BEFORE SHIPPING YOUR FIRST PIXEL."
          titleWidth="w-full"
          subtitleWidth="w-full"
        />
      </div>

      <div className="h-10 md:h-[64px]" />

      {/* FAQ items */}
      <div className="flex flex-col w-full">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="flex flex-col w-full border-t border-t-[#1D1D1D]">
              <button
                className="flex items-center justify-between w-full py-5 md:h-[72px] text-left gap-4"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
              >
                <span className="font-grotesk text-[14px] md:text-[16px] font-bold text-[#F5F5F0] tracking-[1px]">
                  {faq.question}
                </span>
                <div
                  className="flex items-center justify-center w-[32px] h-[32px] shrink-0"
                  style={{ backgroundColor: isOpen ? "#FFD600" : "#1A1A1A", border: isOpen ? "none" : "1px solid #3D3D3D" }}
                >
                  <span
                    className="font-ibm-mono text-[14px] font-bold"
                    style={{ color: isOpen ? "#0A0A0A" : "#888888" }}
                  >
                    {isOpen ? "—" : "+"}
                  </span>
                </div>
              </button>
              {isOpen && faq.answer && (
                <div className="pb-8">
                  <p className="font-ibm-mono text-[12px] md:text-[13px] text-[#888888] tracking-[1px] leading-[1.6]">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <div className="border-t border-t-[#1D1D1D]" />
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-[16px] pt-10 md:pt-[48px]">
        <span className="font-ibm-mono text-[13px] text-[#555555] tracking-[1px]">
          STILL HAVE QUESTIONS?
        </span>
        <span className="font-ibm-mono text-[13px] font-bold text-[#FFD600] tracking-[1px] cursor-pointer hover:underline">
          TALK TO A HUMAN &gt;
        </span>
      </div>
    </section>
  );
}
