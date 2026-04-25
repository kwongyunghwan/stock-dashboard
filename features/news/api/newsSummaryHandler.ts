import { NextRequest, NextResponse } from "next/server";

type CacheEntry = { headline: string; summary: string; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const TTL = 60 * 60_000; // 1시간

async function summarizeWithGroq(
  headline: string,
  summary: string
): Promise<{ headline: string; summary: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("missing GROQ_API_KEY");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 512,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "당신은 금융 뉴스 전문 번역·요약가입니다. 영문 기사를 자연스러운 한국어로 번역하고 핵심 내용을 요약합니다. 반드시 JSON 형식으로만 응답하세요.",
        },
        {
          role: "user",
          content: `아래 영문 금융 뉴스를 한국어로 번역하고, 핵심 내용을 3~4문장으로 요약해주세요.

헤드라인: ${headline}
내용: ${summary || "(내용 없음)"}

다음 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:
{"headline":"한국어 헤드라인","summary":"핵심 내용 3~4문장 한국어 요약"}`,
        },
      ],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`groq ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  const jsonStr = text.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  const parsed = JSON.parse(jsonStr);
  return { headline: parsed.headline, summary: parsed.summary };
}

export async function POST(req: NextRequest) {
  const { id, headline, summary } = await req.json();
  if (!headline) {
    return NextResponse.json({ error: "headline required" }, { status: 400 });
  }

  const cacheKey = String(id ?? headline);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json({ headline: cached.headline, summary: cached.summary });
  }

  try {
    const result = await summarizeWithGroq(headline, summary ?? "");
    cache.set(cacheKey, { ...result, expiresAt: Date.now() + TTL });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
