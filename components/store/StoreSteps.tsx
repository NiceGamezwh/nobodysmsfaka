import SectionHeader from "@/components/SectionHeader";

const REGISTER_STEPS = [
  {
    no: "01",
    title: "选择档位下单",
    desc: "挑选注册卡密档位（¥3 / ¥15 / ¥30），点击购买后系统创建订单并生成支付宝支付链接。",
  },
  {
    no: "02",
    title: "支付宝扫码支付",
    desc: "跳转到支付宝收款页完成付款。免签模式下由收款监测自动确认到账状态。",
  },
  {
    no: "03",
    title: "链上领取卡密",
    desc: "支付成功后自动返回领取页，服务端核实订单并调用合约弹出唯一卡密（账号----密码），即时展示给你。",
  },
];

const RECHARGE_STEPS = [
  {
    no: "01",
    title: "选择充值档位",
    desc: "挑选充值卡密（现价 ¥14 / ¥27 / ¥53，对应面额 15/30/60），点击购买后系统创建订单并生成支付宝支付链接。",
  },
  {
    no: "02",
    title: "支付宝扫码支付",
    desc: "跳转到支付宝收款页完成付款。免签模式下由收款监测自动确认到账状态。",
  },
  {
    no: "03",
    title: "领取充值单码",
    desc: "支付成功后自动返回领取页，服务端核实订单并从合约发放唯一充值码，请立即复制保存。",
  },
];

export default function StoreSteps({
  variant = "register",
}: {
  variant?: "register" | "recharge";
}) {
  const steps = variant === "recharge" ? RECHARGE_STEPS : REGISTER_STEPS;
  return (
    <section
      id="steps"
      className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader label="[02] // 购买流程" title={"三步。\n即可拿到卡密。"} />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        {steps.map((s) => (
          <div
            key={s.no}
            className="flex flex-col gap-5 p-8 md:p-[40px] w-full md:flex-1 bg-[#0F0F0F] border border-[#2D2D2D]"
          >
            <span
              className="font-grotesk text-[40px] font-bold tracking-[-1px] leading-none"
              style={{ color: variant === "recharge" ? "#7EC8E3" : "#FFD600" }}
            >
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
