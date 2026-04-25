"use client";

import { useStockProfile } from "../hooks/useStockProfile";
import type { Recommendation } from "../types";

function formatEarningsDate(date: string, hour: string | null): string {
  const d = new Date(date + "T00:00:00");
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const yyyy = d.getFullYear();
  const now = new Date();
  const same = d.getFullYear() === now.getFullYear();
  const base = same ? `${m}/${day}` : `${yyyy}.${m}.${day}`;
  const tag =
    hour === "bmo" ? "장전" : hour === "amc" ? "장후" : hour === "dmh" ? "장중" : null;
  return tag ? `${base} (${tag})` : base;
}

function isWithinDays(dateStr: string, days: number): boolean {
  const target = new Date(dateStr + "T00:00:00").getTime();
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const diff = (target - startOfToday) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

function consensus(r: Recommendation): { label: string; tone: "up" | "down" | "muted" } {
  const buy = r.buy + r.strongBuy;
  const sell = r.sell + r.strongSell;
  const total = buy + r.hold + sell;
  if (total === 0) return { label: "—", tone: "muted" };
  const buyPct = (buy / total) * 100;
  const sellPct = (sell / total) * 100;
  if (buyPct >= 60) return { label: "매수 우세", tone: "up" };
  if (sellPct >= 40) return { label: "매도 우세", tone: "down" };
  return { label: "중립", tone: "muted" };
}

export default function StockProfile({ symbol }: { symbol: string }) {
  const { profile, isLoading } = useStockProfile(symbol);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1 text-[11px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-9 rounded bg-panel2 border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!profile) return null;

  const c = profile.recommendation ? consensus(profile.recommendation) : null;
  const toneClass =
    c?.tone === "up" ? "text-up" : c?.tone === "down" ? "text-down" : "text-white";

  return (
    <div className="grid grid-cols-3 gap-1 text-[11px]">
      <Cell label="실적">
        {profile.earnings ? (
          <span
            className={
              isWithinDays(profile.earnings.date, 7)
                ? "text-down font-semibold"
                : "text-white"
            }
          >
            {formatEarningsDate(profile.earnings.date, profile.earnings.hour)}
          </span>
        ) : (
          <span className="text-muted">미정</span>
        )}
      </Cell>
      <Cell label="컨센서스">
        {c ? (
          <span className={toneClass}>{c.label}</span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </Cell>
      <Cell label="배당률">
        {profile.dividendYield != null && profile.dividendYield > 0 ? (
          <span className="text-white">
            {profile.dividendYield.toFixed(2)}%
          </span>
        ) : (
          <span className="text-muted">無</span>
        )}
      </Cell>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-panel2 border border-border px-2 py-1 flex flex-col">
      <span className="text-muted text-[10px]">{label}</span>
      <span className="font-medium tabular-nums leading-tight">{children}</span>
    </div>
  );
}
