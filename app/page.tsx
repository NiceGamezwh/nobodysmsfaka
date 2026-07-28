import StoreNav from "@/components/store/StoreNav";
import StoreHero from "@/components/store/StoreHero";
import PixelDivider from "@/components/PixelDivider";
import StoreCards from "@/components/store/StoreCards";
import StoreSteps from "@/components/store/StoreSteps";
import StoreFAQ from "@/components/store/StoreFAQ";
import StoreFooter from "@/components/store/StoreFooter";

export default function Home() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">
      <StoreNav />
      <StoreHero />
      <PixelDivider />
      <StoreCards />
      <StoreSteps />
      <StoreFAQ />
      <StoreFooter />
    </main>
  );
}
