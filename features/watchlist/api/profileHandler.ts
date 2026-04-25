import { NextRequest, NextResponse } from "next/server";

type Earnings = {
  date: string;        // YYYY-MM-DD
  hour: string | null; // bmo / amc / dmh
  epsEstimate: number | null;
  revenueEstimate: number | null;
};

type Recommendation = {
  period: string;
  buy: number;
  hold: number;
  sell: number;
  strongBuy: number;
  strongSell: number;
};

const ENDPOINT = "https://finnhub.io/api/v1";

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function fetchNextEarnings(
  symbol: string,
  key: string
): Promise<Earnings | null> {
  const today = new Date();
  const future = new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000);
  const url = `${ENDPOINT}/calendar/earnings?from=${ymd(today)}&to=${ymd(
    future
  )}&symbol=${symbol}&token=${key}`;
  const data = await fetchJSON<{ earningsCalendar?: any[] }>(url);
  const list = data?.earningsCalendar ?? [];
  if (list.length === 0) return null;
  list.sort((a, b) => a.date.localeCompare(b.date));
  const e = list[0];
  return {
    date: e.date,
    hour: e.hour ?? null,
    epsEstimate: e.epsEstimate ?? null,
    revenueEstimate: e.revenueEstimate ?? null,
  };
}

async function fetchRecommendation(
  symbol: string,
  key: string
): Promise<Recommendation | null> {
  const url = `${ENDPOINT}/stock/recommendation?symbol=${symbol}&token=${key}`;
  const data = await fetchJSON<any[]>(url);
  if (!data || data.length === 0) return null;
  const latest = data[0];
  return {
    period: latest.period,
    buy: latest.buy ?? 0,
    hold: latest.hold ?? 0,
    sell: latest.sell ?? 0,
    strongBuy: latest.strongBuy ?? 0,
    strongSell: latest.strongSell ?? 0,
  };
}

async function fetchDividendYield(
  symbol: string,
  key: string
): Promise<number | null> {
  const url = `${ENDPOINT}/stock/metric?symbol=${symbol}&metric=all&token=${key}`;
  const data = await fetchJSON<{ metric?: Record<string, number> }>(url);
  const m = data?.metric;
  if (!m) return null;
  const y =
    m.dividendYieldIndicatedAnnual ??
    m.currentDividendYieldTTM ??
    m.dividendsPerShareAnnual;
  return typeof y === "number" ? y : null;
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "symbol required" }, { status: 400 });
  }
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "missing api key" }, { status: 500 });
  }

  const [earnings, recommendation, dividendYield] = await Promise.all([
    fetchNextEarnings(symbol, key),
    fetchRecommendation(symbol, key),
    fetchDividendYield(symbol, key),
  ]);

  return NextResponse.json({
    symbol,
    earnings,
    recommendation,
    dividendYield,
  });
}
