"use client";

import { useState } from "react";
import MiniChart from "./MiniChart";
import RangeSelector from "./RangeSelector";
import StockProfile from "./StockProfile";
import { useQuote } from "@/shared/hooks/useQuote";
import { getKoreanName } from "@/shared/data/symbolNames";
import type { Range } from "../types";
import {
  Currency,
  formatChange,
  formatPct,
  formatPrice,
} from "@/shared/utils/format";

export default function StockCard({
  symbol,
  currency,
  fxRate,
  onRemove,
}: {
  symbol: string;
  currency: Currency;
  fxRate: number;
  onRemove: () => void;
}) {
  const [range, setRange] = useState<Range>("1d");
  const { quote, isLoading } = useQuote(symbol);
  const koName = getKoreanName(symbol);

  const up = (quote?.changePercent ?? 0) >= 0;
  const colorClass = up ? "text-up" : "text-down";

  return (
    <div className="rounded-2xl bg-panel border border-border p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold tracking-wide">
            {symbol}
            {koName && (
              <span className="ml-1.5 text-sm font-normal text-muted">
                ({koName})
              </span>
            )}
          </div>
          <div className="text-xs text-muted">
            전일종가{" "}
            {quote?.prevClose != null
              ? formatPrice(quote.prevClose, currency, fxRate)
              : "—"}
          </div>
        </div>
        <button
          onClick={onRemove}
          aria-label="remove"
          className="text-muted hover:text-down text-sm px-2 py-1 rounded hover:bg-panel2"
        >
          ✕
        </button>
      </div>

      <div className="flex items-baseline gap-3">
        <div className={`text-2xl font-bold ${colorClass}`}>
          {isLoading ? "…" : formatPrice(quote?.price, currency, fxRate)}
        </div>
        <div className={`text-sm font-medium ${colorClass}`}>
          {formatChange(quote?.change, currency, fxRate)} (
          {formatPct(quote?.changePercent)})
        </div>
      </div>

      <MiniChart symbol={symbol} range={range} up={up} />

      <RangeSelector value={range} onChange={setRange} />

      <StockProfile symbol={symbol} />
    </div>
  );
}
