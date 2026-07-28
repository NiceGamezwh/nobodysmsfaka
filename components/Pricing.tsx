import SectionHeader from "./SectionHeader";

interface PricingCardProps {
  tier: string;
  tierColor?: string;
  name: string;
  nameColor?: string;
  price: string;
  priceColor?: string;
  btnLabel: string;
  btnLabelColor?: string;
  bgColor?: string;
  borderColor?: string;
  borderWidth?: number;
  btnBg?: string;
  btnBorderColor?: string;
  tierBg?: string;
  tierBorderColor?: string;
  features: { label: string; included: boolean }[];
  accentColor?: string;
}

function PricingCard({
  tier,
  tierColor = "#888888",
  name,
  nameColor = "#F5F5F0",
  price,
  priceColor = "#F5F5F0",
  btnLabel,
  btnLabelColor = "#888888",
  bgColor = "#0F0F0F",
  borderColor = "#2D2D2D",
  borderWidth = 1,
  btnBg = "#1A1A1A",
  btnBorderColor = "#3D3D3D",
  tierBg = "#1A1A1A",
  tierBorderColor = "#3D3D3D",
  features,
  accentColor = "#555555",
}: PricingCardProps) {
  return (
    <div
      className="flex flex-col gap-8 p-8 md:p-[40px] w-full md:flex-1"
      style={{ backgroundColor: bgColor, border: `${borderWidth}px solid ${borderColor}` }}
    >
      <div
        className="flex items-center justify-center h-[28px] px-[12px] w-fit"
        style={{ backgroundColor: tierBg, border: `1px solid ${tierBorderColor}` }}
      >
        <span className="font-ibm-mono text-[11px] tracking-[2px]" style={{ color: tierColor }}>
          {tier}
        </span>
      </div>
      <span className="font-grotesk text-[28px] font-bold tracking-[1px]" style={{ color: nameColor }}>
        {name}
      </span>
      <div className="flex items-end gap-[4px]">
        <span className="font-grotesk text-[48px] font-bold tracking-[-2px] leading-none" style={{ color: priceColor }}>
          {price}
        </span>
        <span className="font-ibm-mono text-[13px] text-[#555555] tracking-[1px] mb-[6px]">/MO</span>
      </div>

      {/* Feature list */}
      <div className="flex flex-col gap-[10px]" style={{ borderTop: `1px solid ${borderColor === "#0F0F0F" ? "#2D2D2D" : borderColor}` }}>
        <div className="pt-6 flex flex-col gap-[10px]">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="font-ibm-mono text-[14px] leading-none shrink-0"
                style={{ color: f.included ? accentColor : "#333333" }}
              >
                {f.included ? "+" : "—"}
              </span>
              <span
                className="font-ibm-mono text-[11px] tracking-[1px]"
                style={{ color: f.included ? "#A0A09A" : "#3D3D3D" }}
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="flex items-center justify-center w-full h-[48px] mt-auto"
        style={{ backgroundColor: btnBg, border: `2px solid ${btnBorderColor}` }}
      >
        <span className="font-ibm-mono text-[12px] tracking-[2px]" style={{ color: btnLabelColor }}>
          {btnLabel}
        </span>
      </button>
    </div>
  );
}

const BUILDER_FEATURES = [
  { label: "UP TO 3 PROJECTS", included: true },
  { label: "1 GB STORAGE", included: true },
  { label: "COMMUNITY SUPPORT", included: true },
  { label: "BASIC ANALYTICS", included: true },
  { label: "CUSTOM DOMAINS", included: false },
  { label: "TEAM COLLABORATION", included: false },
  { label: "PRIORITY RENDERING", included: false },
  { label: "API ACCESS", included: false },
];

const ARCHITECT_FEATURES = [
  { label: "UNLIMITED PROJECTS", included: true },
  { label: "50 GB STORAGE", included: true },
  { label: "PRIORITY SUPPORT", included: true },
  { label: "ADVANCED ANALYTICS", included: true },
  { label: "CUSTOM DOMAINS", included: true },
  { label: "TEAM COLLABORATION", included: true },
  { label: "PRIORITY RENDERING", included: false },
  { label: "API ACCESS", included: false },
];

const SYSTEM_FEATURES = [
  { label: "UNLIMITED PROJECTS", included: true },
  { label: "UNLIMITED STORAGE", included: true },
  { label: "DEDICATED SUPPORT", included: true },
  { label: "FULL ANALYTICS SUITE", included: true },
  { label: "CUSTOM DOMAINS", included: true },
  { label: "TEAM COLLABORATION", included: true },
  { label: "PRIORITY RENDERING", included: true },
  { label: "API ACCESS", included: true },
];

export default function Pricing() {
  return (
    <section id="pricing" className="flex flex-col w-full bg-[#080808] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[09] // PRICING"
        title={"TRANSPARENT.\nNO SURPRISES."}
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <PricingCard
          tier="FREE TIER"
          name="BUILDER"
          price="$0"
          btnLabel="GET STARTED FREE"
          features={BUILDER_FEATURES}
          accentColor="#555555"
        />
        <PricingCard
          tier="MOST POPULAR"
          tierColor="#0A0A0A"
          tierBg="#FFD600"
          tierBorderColor="#FFD600"
          name="ARCHITECT"
          nameColor="#FFD600"
          price="$49"
          priceColor="#FFD600"
          btnLabel="START BUILDING"
          btnLabelColor="#0A0A0A"
          bgColor="#111111"
          borderColor="#FFD600"
          borderWidth={2}
          btnBg="#FFD600"
          btnBorderColor="transparent"
          features={ARCHITECT_FEATURES}
          accentColor="#FFD600"
        />
        <PricingCard
          tier="ENTERPRISE"
          tierColor="#FF6B35"
          tierBorderColor="#FF6B35"
          name="SYSTEM"
          price="$149"
          btnLabel="CONTACT SALES"
          btnLabelColor="#FF6B35"
          btnBorderColor="#FF6B35"
          features={SYSTEM_FEATURES}
          accentColor="#FF6B35"
        />
      </div>
    </section>
  );
}
