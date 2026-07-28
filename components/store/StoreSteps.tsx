import SectionHeader from "@/components/SectionHeader";

const STEPS = [
  {
    no: "01",
    title: "选择档位下单",
    desc: "挑选 ¥3 / ¥15 / ¥30 卡密档位，点击购买后系统创建订单并生成支付宝支付链接。",
  },
  {
    no: "02",
    title: "支付宝扫码支付",
    desc: "跳转到支付宝收款页完成付款。免签模式下由收款监测自动确认到账状态。",
  },
  {
    no: "03",
    title: "链上领取卡密",
    desc: "支付成功后自动返回领取页，服务端核实订单并调用合约弹出唯一卡密，即时展示给你。",
  },
];

export default function StoreSteps() {
  return (
    <section
      id="steps"
      className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader label="[02] // 购买流程" title={"三步。\n即可拿到卡密。"} />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        {STEPS.map((s) => (
          <div
            key={s.no}
            className="flex flex-col gap-5 p-8 md:p-[40px] w-full md:flex-1 bg-[#0F0F0F] border border-[#2D2D2D]"
          >
            <span className="font-grotesk text-[40px] font-bold text-[#FFD600] tracking-[-1px] leading-none">
              {s.no}
            </span>
            <span className="font-grotesk text-[20px] font-bold text-[#F5F5F0] tracking-[1px]">
              {s.title}
            </span>
            <p className="font-ibm-mono text-[12px] text-[#888888] tracking-[0.5px] leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
