const logos = ["ACME CORP", "AXIOM INC", "FORGE LAB", "NEXUS CO.", "VORTEX SYS"];

export default function Logos() {
  return (
    <section className="flex flex-col items-center w-full bg-[#0F0F0F] py-[48px] px-6 md:px-[120px] gap-[32px]">
      <span className="font-ibm-mono text-[11px] text-[#444444] tracking-[3px]">
        TRUSTED BY TEAMS AT
      </span>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-[64px] w-full">
        {logos.map((logo) => (
          <span
            key={logo}
            className="font-grotesk text-[13px] md:text-[14px] font-bold text-[#333333] tracking-[2px]"
          >
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
}
