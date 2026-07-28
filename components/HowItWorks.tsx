import SectionHeader from "./SectionHeader";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  bgColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

function StepCard({
  number,
  title,
  description,
  bgColor = "#0A0A0A",
  borderColor = "#2D2D2D",
  borderWidth = 1,
}: StepCardProps) {
  return (
    <div
      className="flex flex-col gap-4 p-8 md:p-[40px] border w-full md:flex-1 md:h-[260px]"
      style={{ backgroundColor: bgColor, borderColor, borderWidth }}
    >
      <span className="font-grotesk text-[48px] font-bold text-[#FFD600] tracking-[-2px]">
        {number}
      </span>
      <h3 className="font-grotesk text-[20px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
        {title}
      </h3>
      <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px] leading-[1.5]">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="flex flex-col w-full bg-[#0D0D0D] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[02] // HOW IT WORKS"
        title={"THREE STEPS.\nINFINITE BUILDS."}
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <StepCard
          number="01"
          title={"INSTALL THE\nSYSTEM"}
          description="ONE COMMAND. EVERYTHING CONFIGURED."
        />
        <StepCard
          number="02"
          title={"COMPOSE\nYOUR UI"}
          description="DRAG. SNAP. BUILD. EVERY COMPONENT CLICKS INTO PLACE."
          bgColor="#111111"
          borderColor="#FFD600"
          borderWidth={1}
        />
        <StepCard
          number="03"
          title={"SHIP TO\nPRODUCTION"}
          description="EXPORT. DEPLOY. DONE. PIXEL-PERFECT ON EVERY SCREEN."
        />
      </div>
    </section>
  );
}
