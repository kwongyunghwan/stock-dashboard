"use client";

import { useIndices } from "../hooks/useIndices";
import { formatPct } from "@/shared/utils/format";

export default function IndicesBar() {
  const { indices, isLoading } = useIndices();

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

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      {indices.map((idx) => {
        const up = idx.changePercent >= 0;
        return (
          <div
            key={idx.symbol}
            className="flex items-center gap-1.5 tabular-nums"
          >
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
    </div>
  );
}
