"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";

export default function RefreshButton() {
  const { mutate } = useSWRConfig();
  const [spinning, setSpinning] = useState(false);
  const [lastAt, setLastAt] = useState<Date | null>(null);

  async function refresh() {
    if (spinning) return;
    setSpinning(true);
    try {
      await mutate(() => true, undefined, { revalidate: true });
      setLastAt(new Date());
    } finally {
      setSpinning(false);
    }
  }

  const lastLabel = lastAt
    ? `${lastAt.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })} 갱신`
    : "새로고침";

  return (
    <button
      onClick={refresh}
      disabled={spinning}
      title={lastAt ? `마지막 갱신 ${lastAt.toLocaleString("ko-KR")}` : "전체 새로고침"}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-panel hover:bg-panel2 text-xs disabled:opacity-60"
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={spinning ? "animate-spin" : ""}
      >
        <path d="M21 12a9 9 0 1 1-3.5-7.1" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
      <span className="hidden sm:inline">{lastLabel}</span>
    </button>
  );
}
