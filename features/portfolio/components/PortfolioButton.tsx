"use client";

export default function PortfolioButton({
  onClick,
  pnlPct,
}: {
  onClick: () => void;
  pnlPct?: number | null;
}) {
  const hasPnl = typeof pnlPct === "number" && Number.isFinite(pnlPct);
  const up = (pnlPct ?? 0) >= 0;
  const colorClass = hasPnl ? (up ? "text-up" : "text-down") : "text-muted";
  const sign = hasPnl ? (pnlPct! > 0 ? "+" : "") : "";

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-panel hover:bg-panel2 text-sm"
    >
      <span>내 잔고</span>
      {hasPnl && (
        <span className={`text-xs font-semibold ${colorClass}`}>
          {sign}
          {pnlPct!.toFixed(2)}%
        </span>
      )}
    </button>
  );
}
