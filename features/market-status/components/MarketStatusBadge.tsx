"use client";

import { useMarketStatus } from "../hooks/useMarketStatus";
import type { MarketSession } from "../types";

const COLOR: Record<MarketSession, { dot: string; text: string }> = {
  regular: { dot: "bg-up", text: "text-up" },
  pre: { dot: "bg-amber-400", text: "text-amber-400" },
  after: { dot: "bg-amber-400", text: "text-amber-400" },
  closed: { dot: "bg-muted", text: "text-muted" },
};

export default function MarketStatusBadge() {
  const status = useMarketStatus();
  if (!status) {
    return (
      <div className="h-7 w-24 rounded-md bg-panel border border-border animate-pulse" />
    );
  }
  const c = COLOR[status.session];
  const pulse = status.session === "regular" ? "animate-pulse" : "";

  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-border bg-panel text-xs"
      title={`뉴욕 시간 ${status.nyTime}`}
    >
      <span className={`h-2 w-2 rounded-full ${c.dot} ${pulse}`} />
      <span className={`font-medium ${c.text}`}>{status.label}</span>
      <span className="text-muted hidden sm:inline">{status.nyTime}</span>
    </div>
  );
}
