export default function StoreFooter() {
  return (
    <footer className="flex flex-col w-full bg-[#050505]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 md:px-[120px] py-12 md:py-[56px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[28px] h-[28px] bg-[#FFD600] shrink-0" />
          <span className="font-grotesk text-[15px] font-bold text-[#FFD600] tracking-[3px]">
            NobodySMS 官方卡密
          </span>
        </div>
        <p className="font-ibm-mono text-[11px] text-[#666666] tracking-[1px] leading-relaxed max-w-[420px]">
          智能合约自动发卡 卡密链上唯一。请勿用于任何违法违规用途。
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-6 md:px-[120px] py-4 md:h-[56px] border-t border-t-[#1D1D1D] gap-3 sm:gap-0">
        <span className="font-ibm-mono text-[11px] text-[#666666] tracking-[1px]">
          © 2026 NobodySMS 官方卡密
        </span>
        <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[1px]">
          SEPOLIA TESTNET
        </span>
      </div>
    </footer>
  );
}
