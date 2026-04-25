import { NextResponse } from "next/server";

export type NewsItem = {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number; // unix timestamp
  category: string;
};

export async function GET() {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "missing api key" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${key}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return NextResponse.json({ error: `finnhub ${res.status}` }, { status: 502 });
    }
    const data: NewsItem[] = await res.json();
    // 최신 30개만
    return NextResponse.json(data.slice(0, 30));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
