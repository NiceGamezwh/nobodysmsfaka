import StoreNav from "@/components/store/StoreNav";
import RechargeHero from "@/components/store/RechargeHero";
import PixelDivider from "@/components/PixelDivider";
import StoreCards from "@/components/store/StoreCards";
import StoreSteps from "@/components/store/StoreSteps";
import StoreFAQ from "@/components/store/StoreFAQ";
import StoreFooter from "@/components/store/StoreFooter";

export const metadata = {
  title: "充值卡密 | NobodySMS",
  description: "NobodySMS 充值卡密专区：单码充值，面额 ¥15 / ¥30 / ¥60，现价 ¥14 / ¥27 / ¥53，支付宝付款后智能合约自动发放。",
};

export default function RechargePage() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">
      <StoreNav />
      <RechargeHero />
      <PixelDivider />
      <StoreCards kind="recharge" />
      <StoreSteps variant="recharge" />
      <StoreFAQ variant="recharge" />
      <StoreFooter />
    </main>
  );
}
