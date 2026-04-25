"use client";

import { useEffect, useRef, useState } from "react";
import { useAlertsContext } from "../AlertsContext";
import type { Currency } from "@/shared/utils/format";

export default function CardAlertModal({
  symbol,
  currentPriceUSD,
  currency,
  fxRate,
  onClose,
}: {
  symbol: string;
  currentPriceUSD: number | undefined;
  currency: Currency;
  fxRate: number;
  onClose: () => void;
}) {
  const { get, upsert, remove } = useAlertsContext();
  const existing = get(symbol);

  const [priceCurrency, setPriceCurrency] = useState<Currency>(
    existing?.targetPriceCurrency ?? currency
  );
  const [targetInput, setTargetInput] = useState<string>(() => {
    if (existing?.targetPrice == null) return "";
    const price =
      (existing.targetPriceCurrency ?? currency) === "KRW"
        ? existing.targetPrice * fxRate
        : existing.targetPrice;
    return priceCurrency === "KRW"
      ? Math.round(price).toString()
      : price.toFixed(2);
  });
  const [surgeEnabled, setSurgeEnabled] = useState(existing?.surgeEnabled ?? false);
  const [surgeThreshold, setSurgeThreshold] = useState(String(existing?.surgeThreshold ?? 5));
  const [plungeEnabled, setPlungeEnabled] = useState(existing?.plungeEnabled ?? false);
  const [plungeThreshold, setPlungeThreshold] = useState(String(existing?.plungeThreshold ?? 5));

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleCurrencyToggle() {
    const next: Currency = priceCurrency === "KRW" ? "USD" : "KRW";
    const parsed = parseFloat(targetInput);
    if (!isNaN(parsed) && parsed > 0) {
      if (next === "KRW") {
        setTargetInput(Math.round(parsed * fxRate).toString());
      } else {
        setTargetInput((parsed / fxRate).toFixed(2));
      }
    }
    setPriceCurrency(next);
  }

  function handleSave() {
    const raw = parseFloat(targetInput);
    const targetPriceUSD =
      !isNaN(raw) && raw > 0
        ? priceCurrency === "KRW"
          ? raw / fxRate
          : raw
        : null;

    // 현재가 기준으로 목표가 방향 결정
    let targetDirection: "above" | "below" | null = null;
    if (targetPriceUSD != null && currentPriceUSD != null) {
      targetDirection = targetPriceUSD > currentPriceUSD ? "above" : "below";
    }

    upsert({
      symbol,
      targetPrice: targetPriceUSD,
      targetPriceCurrency: priceCurrency,
      targetDirection,
      surgeEnabled,
      surgeThreshold: Math.max(0.1, parseFloat(surgeThreshold) || 5),
      plungeEnabled,
      plungeThreshold: Math.max(0.1, parseFloat(plungeThreshold) || 5),
    });
    onClose();
  }

  function handleDelete() {
    remove(symbol);
    onClose();
  }

  // 목표가 방향 미리보기
  const previewDirection = (() => {
    const raw = parseFloat(targetInput);
    const targetUSD = !isNaN(raw) && raw > 0
      ? priceCurrency === "KRW" ? raw / fxRate : raw
      : null;
    if (targetUSD == null || currentPriceUSD == null) return null;
    return targetUSD > currentPriceUSD ? "above" : "below";
  })();

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    >
      <div className="w-full max-w-sm bg-panel border border-border rounded-2xl shadow-2xl p-5 flex flex-col gap-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">{symbol} 알림 설정</h3>
          <button onClick={onClose} className="text-muted hover:text-white px-1 rounded hover:bg-panel2">
            ✕
          </button>
        </div>

        {/* 목표가 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted font-medium">목표가</label>
            {previewDirection && (
              <span className={`text-[11px] font-medium ${previewDirection === "above" ? "text-up" : "text-down"}`}>
                {previewDirection === "above" ? "↑ 상향 돌파 시 알림" : "↓ 하향 도달 시 알림"}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              placeholder={priceCurrency === "KRW" ? "₩ 입력" : "$ 입력"}
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="flex-1 bg-panel2 border border-border rounded-lg px-3 py-2 text-sm tabular-nums outline-none focus:border-white/40 placeholder:text-muted"
            />
            <button
              type="button"
              onClick={handleCurrencyToggle}
              className="px-3 py-2 rounded-lg border border-border bg-panel2 text-sm hover:bg-border transition-colors"
            >
              {priceCurrency === "KRW" ? "원화" : "달러"}
            </button>
          </div>
        </div>

        {/* 급등 */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={surgeEnabled} onChange={(e) => setSurgeEnabled(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm font-medium text-up">급등 알림</span>
          </label>
          {surgeEnabled && (
            <div className="flex items-center gap-2 ml-6">
              <span className="text-xs text-muted">전일대비</span>
              <input
                type="number" min={0.1} step={0.5}
                value={surgeThreshold}
                onChange={(e) => setSurgeThreshold(e.target.value)}
                className="w-20 bg-panel2 border border-border rounded-lg px-3 py-1.5 text-sm tabular-nums outline-none focus:border-white/40"
              />
              <span className="text-xs text-muted">% 이상 상승</span>
            </div>
          )}
        </div>

        {/* 급락 */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={plungeEnabled} onChange={(e) => setPlungeEnabled(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm font-medium text-down">급락 알림</span>
          </label>
          {plungeEnabled && (
            <div className="flex items-center gap-2 ml-6">
              <span className="text-xs text-muted">전일대비</span>
              <input
                type="number" min={0.1} step={0.5}
                value={plungeThreshold}
                onChange={(e) => setPlungeThreshold(e.target.value)}
                className="w-20 bg-panel2 border border-border rounded-lg px-3 py-1.5 text-sm tabular-nums outline-none focus:border-white/40"
              />
              <span className="text-xs text-muted">% 이상 하락</span>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 pt-1">
          <button onClick={handleSave} className="flex-1 bg-white text-black rounded-lg py-2 text-sm font-semibold hover:bg-white/90 transition-colors">
            저장
          </button>
          {existing && (
            <button onClick={handleDelete} className="px-4 rounded-lg border border-down text-down text-sm hover:bg-down/10 transition-colors">
              삭제
            </button>
          )}
          <button onClick={onClose} className="px-4 rounded-lg border border-border text-muted text-sm hover:bg-panel2 transition-colors">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
