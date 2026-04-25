"use client";

import StockCard from "./StockCard";
import type { Currency } from "@/shared/utils/format";

export default function WatchlistGrid({
  symbols,
  currency,
  fxRate,
  onRemove,
}: {
  symbols: string[];
  currency: Currency;
  fxRate: number;
  onRemove: (symbol: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {symbols.map((s) => (
        <StockCard
          key={s}
          symbol={s}
          currency={currency}
          fxRate={fxRate}
          onRemove={() => onRemove(s)}
        />
      ))}
    </div>
  );
}
