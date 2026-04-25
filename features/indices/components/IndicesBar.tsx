"use client";

import { useIndices } from "../hooks/useIndices";
import { useFxRate } from "@/features/currency/hooks/useFxRate";
import { formatPct } from "@/shared/utils/format";
import MarketStatusBadge from "@/features/market-status/components/MarketStatusBadge";

const EXCLUDE = new Set(["^DJI"]);

export default function IndicesBar() {
  const { indices, isLoading } = useIndices();
  const fxRate = useFxRate();

  if (isLoading || indices.length === 0) {
    return (
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-5 w-24 rounded bg-panel border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  const filtered = indices.filter((idx) => !EXCLUDE.has(idx.symbol));

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      {filtered.map((idx) => {
        const up = idx.changePercent >= 0;
        return (
          <div key={idx.symbol} className="flex items-center gap-1.5 tabular-nums">
            <span className="text-muted">{idx.name}</span>
            <span className="font-semibold">
              {idx.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className={up ? "text-up" : "text-down"}>
              {formatPct(idx.changePercent)}
            </span>
          </div>
        );
      })}

      <span className="text-border">|</span>

      <div className="flex items-center gap-1 tabular-nums">
        <span className="text-muted">환율</span>
        <span className="font-semibold">
          ₩{fxRate.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
        </span>
      </div>

      <span className="text-border">|</span>
      <MarketStatusBadge />
    </div>
  );
}
