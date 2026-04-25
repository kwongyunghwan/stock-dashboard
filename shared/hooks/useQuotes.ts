"use client";

import useSWR from "swr";
import { fetcher } from "@/shared/utils/fetcher";
import type { Quote } from "@/shared/types/quote";

export function useQuotes(symbols: string[]) {
  const sorted = [...symbols].sort();
  const key = sorted.length ? ["quotes", ...sorted] : null;

  const { data, isLoading } = useSWR<Quote[]>(
    key,
    () =>
      Promise.all(
        sorted.map((s) => fetcher(`/api/quote?symbol=${s}`) as Promise<Quote>)
      ),
    { refreshInterval: 15_000 }
  );

  const map = new Map<string, Quote>();
  (data ?? []).forEach((q) => {
    if (q?.symbol) map.set(q.symbol, q);
  });

  return { quotes: map, isLoading };
}
