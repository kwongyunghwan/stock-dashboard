"use client";

import {
  Currency,
  formatChange,
  formatPct,
  formatPrice,
} from "@/shared/utils/format";

export default function PortfolioSummary({
  cost,
  marketValue,
  pnl,
  pnlPct,
  currency,
  fxRate,
}: {
  cost: number;
  marketValue: number;
  pnl: number;
  pnlPct: number;
  currency: Currency;
  fxRate: number;
}) {
  const up = pnl >= 0;
  const colorClass = up ? "text-up" : "text-down";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Cell label="총 매입금" value={formatPrice(cost, currency, fxRate)} />
      <Cell label="총 평가금" value={formatPrice(marketValue, currency, fxRate)} />
      <Cell
        label="평가손익"
        value={formatChange(pnl, currency, fxRate)}
        className={colorClass}
      />
      <Cell
        label="수익률"
        value={formatPct(pnlPct)}
        className={colorClass}
      />
    </div>
  );
}

function Cell({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg bg-panel2 border border-border p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 text-base font-semibold tabular-nums ${className ?? ""}`}>
        {value}
      </div>
    </div>
  );
}
