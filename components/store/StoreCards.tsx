"use client";

import { useEffect, useState } from "react";
import { PRODUCTS, TIER_LIST, type Tier } from "@/lib/products";
import SectionHeader from "@/components/SectionHeader";

export default function StoreCards() {
  const [loadingTier, setLoadingTier] = useState<Tier | null>(null);
  const [error, setError] = useState<string>("");
  const [stock, setStock] = useState<Record<string, number | null> | null>(null);

  useEffect(() => {
    let alive = true;
    async function loadStock() {
      try {
        const res = await fetch("/api/stock");
        const data = await res.json();
        if (alive && data.success) setStock(data.stock);
      } catch {
        // 库存拉取失败时静默，不阻塞购买
      }
    }
    loadStock();
    const timer = setInterval(loadStock, 30000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  async function handleBuy(tier: Tier) {
    setError("");
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.success && data.payUrl) {
        // 预览环境处于 iframe 中，跳转到外部支付页需新开标签页
        if (window.self !== window.top) {
          window.open(data.payUrl, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = data.payUrl;
        }
      } else {
        setError(data.msg || "创建订单失败，请稍后重试");
      }
    } catch (e: any) {
      setError(e?.message || "网络错误，请稍后重试");
    } finally {
      setLoadingTier(null);
    }
  }

  return (
    <section
      id="products"
      className="flex flex-col w-full bg-[#080808] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader label="[01] // 商品" title={"选择档位。\n即买即得。"} />

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1A0F0F] border-2 border-[#FF6B35]">
          <span className="w-[8px] h-[8px] bg-[#FF6B35] shrink-0" />
          <span className="font-ibm-mono text-[12px] text-[#FF6B35] tracking-[1px]">{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        {TIER_LIST.map((tier) => {
          const p = PRODUCTS[tier];
          const featured = p.featured;
          const isLoading = loadingTier === tier;
          const count = stock ? stock[tier] : undefined;
          const soldOut = count === 0;
          return (
            <div
              key={tier}
              className="flex flex-col gap-8 p-8 md:p-[40px] w-full md:flex-1"
              style={{
                backgroundColor: featured ? "#111111" : "#0F0F0F",
                border: `${featured ? 2 : 1}px solid ${featured ? "#FFD600" : "#2D2D2D"}`,
              }}
            >
              {/* 档位标签 */}
              <div
                className="flex items-center justify-center h-[28px] px-[12px] w-fit"
                style={{
                  backgroundColor: featured ? "#FFD600" : "#1A1A1A",
                  border: `1px solid ${featured ? "#FFD600" : "#3D3D3D"}`,
                }}
              >
                <span
                  className="font-ibm-mono text-[11px] tracking-[2px]"
                  style={{ color: featured ? "#0A0A0A" : p.accent }}
                >
                  {featured ? "最受欢迎" : p.name.toUpperCase()}
                </span>
              </div>

              <span
                className="font-grotesk text-[28px] font-bold tracking-[1px]"
                style={{ color: featured ? "#FFD600" : "#F5F5F0" }}
              >
                {p.name}
              </span>

              <div className="flex items-end gap-[6px]">
                <span
                  className="font-grotesk text-[48px] font-bold tracking-[-2px] leading-none"
                  style={{ color: featured ? "#FFD600" : "#F5F5F0" }}
                >
                  ¥{p.tier}
                </span>
                <span className="font-ibm-mono text-[13px] text-[#555555] tracking-[1px] mb-[6px]">/ 张</span>
              </div>

              <p className="font-ibm-mono text-[12px] text-[#888888] tracking-[1px] leading-relaxed">
                {p.desc}
              </p>

              {/* 库存 */}
              <div className="flex items-center gap-[8px]">
                <span
                  className="w-[8px] h-[8px] shrink-0"
                  style={{
                    backgroundColor:
                      count === undefined ? "#555555" : soldOut ? "#FF6B35" : "#3DDC84",
                  }}
                />
                <span className="font-ibm-mono text-[11px] tracking-[1px] text-[#A0A09A]">
                  {count === undefined
                    ? "库存查询中…"
                    : count === null
                      ? "库存查询失败"
                      : soldOut
                        ? "已售罄"
                        : `剩余库存 ${count} 张`}
                </span>
              </div>

              {/* 权益列表 */}
              <div className="flex flex-col gap-[10px]" style={{ borderTop: "1px solid #2D2D2D" }}>
                <div className="pt-6 flex flex-col gap-[10px]">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span
                        className="font-ibm-mono text-[14px] leading-none shrink-0"
                        style={{ color: p.accent }}
                      >
                        +
                      </span>
                      <span className="font-ibm-mono text-[11px] text-[#A0A09A] tracking-[1px]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleBuy(tier)}
                disabled={isLoading}
                className="flex items-center justify-center w-full h-[48px] mt-auto transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: featured ? "#FFD600" : "#1A1A1A",
                  border: `2px solid ${featured ? "transparent" : "#3D3D3D"}`,
                }}
              >
                <span
                  className="font-ibm-mono text-[12px] tracking-[2px]"
                  style={{ color: featured ? "#0A0A0A" : "#F5F5F0" }}
                >
                  {isLoading ? "创建订单中…" : "立即购买 >"}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px] leading-relaxed text-center">
        支付宝扫码支付 // 卡密由智能合约链上唯一发放 // 付款后自动跳转领取
      </p>
    </section>
  );
}
