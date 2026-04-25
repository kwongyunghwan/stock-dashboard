import { NextResponse } from "next/server";
import type { Index } from "../types";

const INDICES = [
  { symbol: "^IXIC", name: "NASDAQ" },
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^DJI", name: "DOW" },
  { symbol: "^VIX", name: "공포지수" },
];

async function fetchOne(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?interval=1d&range=5d`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const r = data?.chart?.result?.[0];
  if (!r) return null;
  const meta = r.meta;
  const price: number = meta.regularMarketPrice;
  const prev: number = meta.chartPreviousClose ?? meta.previousClose;
  const change = price - prev;
  const changePercent = (change / prev) * 100;
  return { price, change, changePercent };
}

export async function GET() {
  const results: Index[] = await Promise.all(
    INDICES.map(async (idx) => {
      const q = await fetchOne(idx.symbol);
      return { ...idx, ...(q || { price: 0, change: 0, changePercent: 0 }) };
    })
  );
  return NextResponse.json({ indices: results });
}
