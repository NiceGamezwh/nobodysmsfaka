import SectionHeader from "./SectionHeader";

interface FeatureCardProps {
  iconColor: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  bgColor?: string;
  borderColor?: string;
}

function FeatureCard({
  iconColor,
  title,
  description,
  tag,
  tagColor,
  bgColor = "#111111",
  borderColor = "#2D2D2D",
}: FeatureCardProps) {
  return (
    <div
      className="flex flex-col gap-5 p-8 md:p-[32px] border w-full md:flex-1 md:h-[320px]"
      style={{ backgroundColor: bgColor, borderColor }}
    >
      <div className="w-[40px] h-[40px] shrink-0" style={{ backgroundColor: iconColor }} />
      <h3 className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
        {title}
      </h3>
      <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
        {description}
      </p>
      <div
        className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border w-fit"
        style={{ borderColor: tagColor }}
      >
        <span className="font-ibm-mono text-[11px] tracking-[2px]" style={{ color: tagColor }}>
          {tag}
        </span>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader
        label="[01] // FEATURES"
        title={"EVERYTHING YOU NEED.\nNOTHING YOU DON'T."}
        subtitle="ENGINEERED FOR SPEED. BUILT FOR SCALE. DESIGNED FOR BUILDERS."
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <FeatureCard
          iconColor="#FFD600"
          title={"PIXEL-ACCURATE\nDESIGN SYSTEM"}
          description="EVERY COMPONENT BUILT TO A 4PX GRID. NO EXCEPTIONS. NO COMPROMISE."
          tag="CORE"
          tagColor="#FFD600"
          borderColor="#FFD600"
        />
        <FeatureCard
          iconColor="#FF6B35"
          title={"ZERO-DEPENDENCY\nCOMPONENTS"}
          description="PURE VANILLA. NO BLOAT. SHIP EXACTLY WHAT YOUR USERS NEED, NOTHING MORE."
          tag="VANILLA"
          tagColor="#FF6B35"
          bgColor="#0F0F0F"
          borderColor="#FF6B35"
        />
        <FeatureCard
          iconColor="#F5F5F0"
          title={"DARK MODE\nFIRST."}
          description="BUILT FOR THE TERMINAL GENERATION. EVERY COLOR CALIBRATED FOR LOW-LIGHT PRECISION."
          tag="DARK"
          tagColor="#888888"
          borderColor="#555555"
        />
      </div>
    </section>
  );
}
