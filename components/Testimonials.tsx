import SectionHeader from "./SectionHeader";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  bgColor?: string;
  accentColor: string;
}

function TestimonialCard({
  quote,
  name,
  role,
  bgColor = "#111111",
  accentColor,
}: TestimonialCardProps) {
  return (
    <div
      className="flex flex-col gap-6 p-8 md:p-[40px] border-l-4 w-full md:flex-1"
      style={{ backgroundColor: bgColor, borderLeftColor: accentColor }}
    >
      <p className="font-ibm-mono text-[13px] text-[#CCCCCC] tracking-[1px] leading-[1.6]">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-[12px]">
        <div className="w-[36px] h-[36px] rounded-full bg-[#333333] shrink-0" />
        <div className="flex flex-col gap-[2px]">
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[1px]">
            {name}
          </span>
          <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[04] // WHAT BUILDERS SAY"
        title={"REAL BUILDERS.\nREAL RESULTS."}
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <TestimonialCard
          quote="PIXELCRAFT IS THE FIRST TOOL THAT ACTUALLY RESPECTS MY WORKFLOW. SHIPPED 3 PRODUCTS IN 6 WEEKS."
          name="SARAH L."
          role="FOUNDER, FORGE LAB"
          accentColor="#FFD600"
        />
        <TestimonialCard
          quote="FINALLY A SYSTEM THAT DOESN'T FIGHT ME. THE DARK MODE IS FLAWLESS. ZERO CONFIG."
          name="ALEX KIM"
          role="CTO, AXIOM INC"
          bgColor="#0D0D0D"
          accentColor="#FF6B35"
        />
        <TestimonialCard
          quote="WE REPLACED 4 TOOLS WITH PIXELCRAFT. TEAM ONBOARDING DROPPED FROM 2 WEEKS TO 2 DAYS."
          name="MORGAN HAYES"
          role="VP DESIGN, NEXUS CO."
          accentColor="#F5F5F0"
        />
      </div>
    </section>
  );
}
