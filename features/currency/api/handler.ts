import { NextResponse } from "next/server";

let cache: { rate: number; ts: number } | null = null;
const TTL = 10 * 60 * 1000;

async function fetchFromFinnhub(): Promise<number | null> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/forex/rates?base=USD&token=${key}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.quote?.KRW;
    if (typeof rate === "number" && rate > 0) return rate;
    return null;
  } catch {
    return null;
  }
}

async function fetchFromExchangerate(): Promise<number | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.rates?.KRW;
    if (typeof rate === "number" && rate > 0) return rate;
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json({ rate: cache.rate, cached: true });
  }
  let rate = await fetchFromFinnhub();
  if (!rate) rate = await fetchFromExchangerate();
  if (!rate) rate = 1380;
  cache = { rate, ts: Date.now() };
  return NextResponse.json({ rate });
}
