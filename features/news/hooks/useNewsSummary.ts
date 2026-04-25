"use client";

import useSWR from "swr";
import type { NewsItem } from "../api/newsHandler";

type KoSummary = { headline: string; summary: string };

async function fetchSummary(item: NewsItem): Promise<KoSummary> {
  const res = await fetch("/api/news-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: item.id,
      headline: item.headline,
      summary: item.summary,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function useNewsSummary(item: NewsItem | null) {
  const { data, isLoading, error } = useSWR<KoSummary>(
    item ? ["news-summary", item.id] : null,
    () => fetchSummary(item!),
    { revalidateOnFocus: false }
  );
  return { summary: data, isLoading, error };
}
