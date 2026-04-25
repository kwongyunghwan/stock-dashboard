import { NextRequest, NextResponse } from "next/server";
import type { NewsItem } from "./newsHandler";

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("symbols") ?? "";
  const symbols = raw.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  if (symbols.length === 0) {
    return NextResponse.json([]);
  }

  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "missing api key" }, { status: 500 });
  }

  const to = ymd(new Date());
  const from = ymd(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 최근 7일

  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const res = await fetch(
          `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${key}`,
          { cache: "no-store" }
        );
        if (!res.ok) return [];
        const data: NewsItem[] = await res.json();
        // 각 아이템에 symbol 태그
        return data.map((item) => ({ ...item, _symbol: symbol }));
      })
    );

    // 합치고 중복 제거(id 기준), 최신순 정렬, 40개 제한
    const seen = new Set<number>();
    const merged = results
      .flat()
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, 40);

    return NextResponse.json(merged);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
