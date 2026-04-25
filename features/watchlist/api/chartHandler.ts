import { NextRequest, NextResponse } from "next/server";
import type { Range } from "../types";

function paramsFor(range: Range) {
  switch (range) {
    case "1d":
      return { interval: "5m", range: "1d" };
    case "1w":
      return { interval: "30m", range: "5d" };
    case "1m":
      return { interval: "1d", range: "1mo" };
  }
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const range = (req.nextUrl.searchParams.get("range") as Range) || "1d";
  if (!symbol) {
    return NextResponse.json({ error: "symbol required" }, { status: 400 });
  }
  const p = paramsFor(range);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?interval=${p.interval}&range=${p.range}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `yahoo ${res.status}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return NextResponse.json({ symbol, range, points: [] });
    const ts: number[] = result.timestamp || [];
    const closes: (number | null)[] =
      result.indicators?.quote?.[0]?.close || [];
    const points = ts
      .map((t, i) => ({ t: t * 1000, c: closes[i] }))
      .filter((p) => typeof p.c === "number");
    return NextResponse.json({ symbol, range, points });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
