"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PRODUCTS,
  REGISTER_TIERS,
  RECHARGE_TIERS,
  displayYuan,
  displayListYuan,
  discountSaveYuan,
  type Tier,
} from "@/lib/products";
import SectionHeader from "@/components/SectionHeader";

function ProductRow({
  tiers,
  stock,
  loadingTier,
  onBuy,
}: {
  tiers: Tier[];
  stock: Record<string, number | null> | null;
  loadingTier: Tier | null;
  onBuy: (tier: Tier) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full gap-[2px]">
      {tiers.map((tier) => {
        const p = PRODUCTS[tier];
        const featured = p.featured;
        const isLoading = loadingTier === tier;
        const count = stock ? stock[tier] : undefined;
        const soldOut = count === 0;
        const yuan = displayYuan(p);
        const listYuan = displayListYuan(p);
        const save = discountSaveYuan(p);
        return (
          <div
            key={tier}
            className="flex flex-col gap-8 p-8 md:p-[40px] w-full md:flex-1"
            style={{
              backgroundColor: featured ? "#111111" : "#0F0F0F",
              border: `${featured ? 2 : 1}px solid ${featured ? "#FFD600" : "#2D2D2D"}`,
            }}
          >
            <div className="flex items-center gap-2 flex-wrap">
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
              {save != null && (
                <div className="flex items-center justify-center h-[28px] px-[10px] w-fit bg-[#FF3B30] border border-[#FF3B30]">
                  <span className="font-ibm-mono text-[11px] font-bold text-[#FFFFFF] tracking-[1px]">
                    特惠 · 省¥{Number.isInteger(save) ? save : save}
                  </span>
                </div>
              )}
            </div>

            <span
              className="font-grotesk text-[28px] font-bold tracking-[1px]"
              style={{ color: featured ? "#FFD600" : "#F5F5F0" }}
            >
              {p.name}
            </span>

            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-[8px] flex-wrap">
                <span
                  className="font-grotesk text-[48px] font-bold tracking-[-2px] leading-none"
                  style={{ color: save != null ? "#FF3B30" : featured ? "#FFD600" : "#F5F5F0" }}
                >
                  ¥{yuan}
                </span>
                {listYuan && (
                  <span className="font-ibm-mono text-[18px] text-[#666] tracking-[0.5px] mb-[8px] line-through decoration-[#666]">
                    ¥{listYuan}
                  </span>
                )}
                <span className="font-ibm-mono text-[13px] text-[#555555] tracking-[1px] mb-[6px]">/ 张</span>
              </div>
              {save != null && listYuan && (
                <span className="font-ibm-mono text-[11px] text-[#FF6B35] tracking-[1px]">
                  面额 ¥{listYuan} · 现价 ¥{yuan} · 立减 ¥{Number.isInteger(save) ? save : save}
                </span>
              )}
            </div>

            <p className="font-ibm-mono text-[12px] text-[#888888] tracking-[1px] leading-relaxed">
              {p.desc}
            </p>

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
              onClick={() => onBuy(tier)}
              disabled={isLoading || soldOut}
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
                {isLoading ? "创建订单中…" : soldOut ? "已售罄" : "立即购买 >"}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function StoreCards({
  kind = "register",
}: {
  kind?: "register" | "recharge";
}) {
  const tiers = kind === "recharge" ? RECHARGE_TIERS : REGISTER_TIERS;
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
        // ignore
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

  const isRecharge = kind === "recharge";

  return (
    <section
      id="products"
      className="flex flex-col w-full bg-[#080808] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader
        label={isRecharge ? "[01] // 充值卡密" : "[01] // 注册卡密"}
        title={isRecharge ? "选择充值档位。\n付款即得单码。" : "选择注册档位。\n即买即得。"}
      />

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1A0F0F] border-2 border-[#FF6B35]">
          <span className="w-[8px] h-[8px] bg-[#FF6B35] shrink-0" />
          <span className="font-ibm-mono text-[12px] text-[#FF6B35] tracking-[1px]">{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <span
            className="w-[8px] h-[8px] shrink-0"
            style={{ backgroundColor: isRecharge ? "#7EC8E3" : "#FFD600" }}
          />
          <span
            className="font-ibm-mono text-[12px] tracking-[2px]"
            style={{ color: isRecharge ? "#7EC8E3" : "#FFD600" }}
          >
            {isRecharge
              ? "充值卡密 // 单码 · 现价 ¥14 / ¥27 / ¥53（面额 15/30/60）"
              : "注册卡密 // 账号----密码 · ¥3 / ¥15 / ¥30"}
          </span>
        </div>
        <ProductRow
          tiers={tiers}
          stock={stock}
          loadingTier={loadingTier}
          onBuy={handleBuy}
        />
      </div>

      {!isRecharge && (
        <Link
          href="/recharge"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full p-6 md:p-8 bg-[#0F0F0F] border border-[#2D2D2D] hover:border-[#7EC8E3] transition-colors no-underline"
        >
          <div className="flex flex-col gap-2">
            <span className="font-ibm-mono text-[11px] text-[#7EC8E3] tracking-[2px]">充值卡密专区</span>
            <span className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[0.5px]">
              需要给已有账号充值？前往充值卡密页
            </span>
            <span className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px]">
              单码格式 · 现价 ¥14 / ¥27 / ¥53 · 付款后自动发放
            </span>
          </div>
          <span className="font-ibm-mono text-[12px] text-[#7EC8E3] tracking-[2px] shrink-0">
            进入 /recharge &gt;
          </span>
        </Link>
      )}

      <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px] leading-relaxed text-center">
        支付宝扫码支付 // 卡密由智能合约链上唯一发放 // 付款后自动跳转领取
      </p>
    </section>
  );
}
