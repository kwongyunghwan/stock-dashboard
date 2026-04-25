"use client";

import type { Holding } from "../types";
import { computeMetrics } from "../utils/calculations";
import { getKoreanName } from "@/shared/data/symbolNames";
import {
  Currency,
  formatPrice,
  formatPct,
} from "@/shared/utils/format";

export default function HoldingsTable({
  holdings,
  prices,
  currency,
  fxRate,
  onRemove,
}: {
  holdings: Holding[];
  prices: Map<string, number | undefined>;
  currency: Currency;
  fxRate: number;
  onRemove: (symbol: string) => void;
}) {
  if (holdings.length === 0) {
    return (
      <div className="text-center text-sm text-muted py-8">
        보유 종목이 없습니다. 위 폼에서 추가해주세요.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-panel z-10">
          <tr className="text-[10px] text-muted">
            <th className="text-left font-medium px-2 py-1.5">종목</th>
            <th className="text-right font-medium px-2 py-1.5">평균단가</th>
            <th className="text-right font-medium px-2 py-1.5">수량</th>
            <th className="text-right font-medium px-2 py-1.5">매입금</th>
            <th className="text-right font-medium px-2 py-1.5">평가금</th>
            <th className="text-right font-medium px-2 py-1.5">수익률</th>
            <th className="px-1 py-1.5" />
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const m = computeMetrics(h, prices.get(h.symbol));
            const up = m.pnl >= 0;
            const colorClass = up ? "text-up" : "text-down";
            const koName = getKoreanName(h.symbol);
            return (
              <tr
                key={h.symbol}
                className="border-t border-border hover:bg-panel2"
              >
                <td className="px-2 py-1.5">
                  <span className="font-semibold">{h.symbol}</span>
                  {koName && (
                    <span className="text-muted ml-1 text-[10px]">
                      ({koName})
                    </span>
                  )}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {formatPrice(h.avgPrice, currency, fxRate)}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {h.quantity.toLocaleString("en-US", {
                    maximumFractionDigits: 4,
                  })}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {formatPrice(m.cost, currency, fxRate)}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {formatPrice(m.marketValue, currency, fxRate)}
                </td>
                <td
                  className={`px-2 py-1.5 text-right tabular-nums font-semibold ${colorClass}`}
                >
                  {formatPct(m.pnlPct)}
                </td>
                <td className="px-1 py-1.5 text-right">
                  <button
                    onClick={() => onRemove(h.symbol)}
                    aria-label="remove holding"
                    className="text-muted hover:text-down px-1 rounded"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
