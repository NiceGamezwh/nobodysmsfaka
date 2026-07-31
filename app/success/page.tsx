"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/products";

type Status = "idle" | "loading" | "confirming" | "success" | "unpaid" | "error";

// 支付确认有延迟（免签类型靠监测软件通知，可能几秒~几十秒）。
// 未支付时自动重试，避免用户手动刷新。
const MAX_CONFIRM_ATTEMPTS = 15;
const CONFIRM_INTERVAL_MS = 3000;

function KamiParts({ kami }: { kami: string }) {
  // 普通卡密两段式：账号----密码
  // 会员卡密三段式：账号----密码----对接码密钥
  const [account, password, dockingKey] = kami.split("----");
  if (!password) {
    return <span className="font-ibm-mono text-[12px] text-[#F5F5F0] break-all">{kami}</span>;
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="font-ibm-mono text-[10px] text-[#555] tracking-[2px]">账号</span>
        <span className="font-ibm-mono text-[12px] text-[#F5F5F0] break-all leading-relaxed">{account}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-ibm-mono text-[10px] text-[#555] tracking-[2px]">密码</span>
        <span className="font-ibm-mono text-[12px] text-[#F5F5F0] break-all leading-relaxed">{password}</span>
      </div>
      {dockingKey && (
        <div className="flex flex-col gap-1">
          <span className="font-ibm-mono text-[10px] text-[#FFD600] tracking-[2px]">对接码密钥</span>
          <span className="font-ibm-mono text-[12px] text-[#F5F5F0] break-all leading-relaxed">{dockingKey}</span>
        </div>
      )}
    </div>
  );
}

function SuccessInner() {
  const params = useSearchParams();
  const orderNo = params.get("orderNo") || "";
  const tier = params.get("tier") || "";
  const product = getProduct(tier);

  const [status, setStatus] = useState<Status>("idle");
  const [kami, setKami] = useState("");
  const [msg, setMsg] = useState("");
  const [diag, setDiag] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const requested = useRef(false);
  const attemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // manual=true 表示用户手动点击「重新领取」，会重置自动确认计数
  const claim = useCallback(
    async (manual = false) => {
      if (!orderNo || !product) {
        setStatus("error");
        setMsg("订单参数缺失");
        return;
      }
      if (manual) {
        attemptRef.current = 0;
        setAttempt(0);
      }
      // 首次为 loading，后续自动重试为 confirming
      setStatus(attemptRef.current === 0 ? "loading" : "confirming");
      setMsg("");
      try {
        // 透传支付FM 跳回时携带的全部参数（含 state/amount/sign），供服务端验签
        const qs = new URLSearchParams(params.toString());
        qs.set("tier", tier);
        const res = await fetch(`/api/claim-kami?${qs.toString()}`);
        const data = await res.json();
        if (data.success && data.kami) {
          setStatus("success");
          setKami(data.kami);
          try {
            // 持久化到 localStorage：同一浏览器下跨刷新 / 跨标签页保留，
            // 避免刷新后再次调用合约 getKami() 重复消耗库存
            localStorage.setItem(`kami:${orderNo}`, data.kami);
          } catch {}
        } else if (data.paid === false) {
          // 未支付：支付确认可能仍在延迟中，自动重试
          attemptRef.current += 1;
          setAttempt(attemptRef.current);
          setDiag(data.diag ? JSON.stringify(data.diag, null, 2) : "");
          if (attemptRef.current < MAX_CONFIRM_ATTEMPTS) {
            setStatus("confirming");
            timerRef.current = setTimeout(() => claim(), CONFIRM_INTERVAL_MS);
          } else {
            setStatus("unpaid");
            setMsg(data.msg || "订单尚未支付成功");
          }
        } else {
          setStatus("error");
          setMsg(data.msg || "领取失败");
        }
      } catch (e: any) {
        setStatus("error");
        setMsg(e?.message || "网络错误");
      }
    },
    [orderNo, tier, product, params],
  );

  // 首次进入：优先读取本浏览器已领取的卡密，避免刷新重复消耗库存
  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    try {
      // 用 localStorage 而非 sessionStorage：后者关闭/切换标签页即丢失，
      // 会导致刷新时读不到缓存、再次调用合约领取。localStorage 可跨刷新持久保留。
      const cached = localStorage.getItem(`kami:${orderNo}`);
      if (cached) {
        setKami(cached);
        setStatus("success");
        return;
      }
    } catch {}
    claim();
  }, [orderNo, claim]);

  // 卸载时清除待执行的自动重试
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function copyKami() {
    try {
      await navigator.clipboard.writeText(kami);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#0A0A0A] px-6 py-16 md:py-[100px]">
      <div className="w-full max-w-[640px] flex flex-col gap-8">
        {/* 顶部状态徽标 */}
        <div className="flex items-center gap-[8px] h-[32px] px-[14px] w-fit bg-[#1A1A1A] border-2 border-[#FFD600]">
          <div className="w-[8px] h-[8px] bg-[#FFD600] shrink-0" />
          <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px]">
            订单 // {orderNo || "—"}
          </span>
        </div>

        <h1 className="font-grotesk text-[36px] md:text-[48px] font-bold text-[#F5F5F0] tracking-[-1px] leading-none">
          {status === "success" ? "领取成功" : "订单领取"}
        </h1>

        {product && (
          <p className="font-ibm-mono text-[12px] text-[#888] tracking-[1px]">
            商品：{product.name} · ¥{product.tier}
          </p>
        )}

        {/* 加载中 / 自动确认支付中 */}
        {(status === "loading" || status === "confirming") && (
          <div className="flex flex-col gap-2 px-6 py-8 bg-[#0F0F0F] border border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <span className="w-[10px] h-[10px] bg-[#FFD600] animate-pulse shrink-0" />
              <span className="font-ibm-mono text-[13px] text-[#888] tracking-[1px]">
                {status === "confirming" ? "正在确认支付，请稍候…" : "请不要刷新页面，正在核实支付并从链上领取卡密…"}
              </span>
            </div>
            {status === "confirming" && (
              <span className="font-ibm-mono text-[10px] text-[#555] tracking-[1px] pl-[22px]">
                支付确认可能有几秒延迟，页面会自动重试（{attempt}/{MAX_CONFIRM_ATTEMPTS}），请勿关闭
              </span>
            )}
          </div>
        )}

        {/* 领取成功：展示卡密 */}
        {status === "success" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 p-6 md:p-8 bg-[#0F0F0F] border-2 border-[#FFD600]">
              <span className="font-ibm-mono text-[10px] text-[#FFD600] tracking-[2px]">你的卡密</span>
              <KamiParts kami={kami} />
            </div>
            <button
              onClick={copyKami}
              className="flex items-center justify-center w-full h-[48px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors cursor-pointer border-none"
            >
              <span className="font-ibm-mono text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
                {copied ? "已复制到剪贴板" : "复制完整卡密"}
              </span>
            </button>
            <div className="flex items-start gap-3 px-4 py-3 bg-[#141200] border border-[#3D3600]">
              <span className="font-ibm-mono text-[14px] text-[#FFD600] shrink-0 leading-none mt-[2px]">!</span>
              <span className="font-ibm-mono text-[11px] text-[#A0A09A] tracking-[0.5px] leading-relaxed">
                请立即复制并妥善保存。复制成功后，会员卡密为「账号----密码----对接码密钥」格式，普通卡密为「账号----密码」格式。
              </span>
            </div>
          </div>
        )}

        {/* 未支付 */}
        {status === "unpaid" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 px-6 py-6 bg-[#0F0F0F] border border-[#2D2D2D]">
              <span className="w-[8px] h-[8px] bg-[#FF6B35] shrink-0" />
              <span className="font-ibm-mono text-[13px] text-[#888] tracking-[1px]">{msg}</span>
            </div>
            <button
              onClick={() => claim(true)}
              className="flex items-center justify-center w-full h-[48px] bg-[#1A1A1A] border-2 border-[#3D3D3D] hover:border-[#888] transition-colors cursor-pointer"
            >
              <span className="font-ibm-mono text-[12px] text-[#F5F5F0] tracking-[2px]">重新领取 &gt;</span>
            </button>
            {diag && (
              <details className="bg-[#0F0F0F] border border-[#2D2D2D]">
                <summary className="cursor-pointer px-4 py-3 font-ibm-mono text-[10px] text-[#555] tracking-[1.5px]">
                  查询原始返回（诊断用）
                </summary>
                <pre className="px-4 pb-4 font-ibm-mono text-[10px] text-[#888] whitespace-pre-wrap break-all leading-relaxed">
                  {diag}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* 错误 */}
        {status === "error" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 px-6 py-6 bg-[#1A0F0F] border-2 border-[#FF6B35]">
              <span className="w-[8px] h-[8px] bg-[#FF6B35] shrink-0" />
              <span className="font-ibm-mono text-[13px] text-[#FF6B35] tracking-[1px]">{msg}</span>
            </div>
            <button
              onClick={() => claim(true)}
              className="flex items-center justify-center w-full h-[48px] bg-[#1A1A1A] border-2 border-[#3D3D3D] hover:border-[#888] transition-colors cursor-pointer"
            >
              <span className="font-ibm-mono text-[12px] text-[#F5F5F0] tracking-[2px]">重新领取 &gt;</span>
            </button>
          </div>
        )}

        <a
          href="/"
          className="font-ibm-mono text-[11px] text-[#555] tracking-[1.5px] hover:text-[#888] transition-colors"
        >
          &lt; 返回首页
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full min-h-screen bg-[#0A0A0A]">
          <span className="font-ibm-mono text-[12px] text-[#888] tracking-[2px]">加载中…</span>
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
