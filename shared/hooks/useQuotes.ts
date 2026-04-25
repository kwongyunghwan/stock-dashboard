"use client";

import { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/shared/utils/fetcher";
import type { Quote } from "@/shared/types/quote";

export function useQuotes(symbols: string[]) {
  const { mutate } = useSWRConfig();
  const sorted = [...symbols].sort();
  const key = sorted.length ? ["quotes", ...sorted] : null;

  const { data, isLoading } = useSWR<Quote[]>(
    key,
    () =>
      Promise.all(
        sorted.map((s) => fetcher(`/api/quote?symbol=${s}`) as Promise<Quote>)
      ),
    {
      refreshInterval: 30_000,
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  // Populate individual /api/quote?symbol=X caches so StockCard hooks share data
  useEffect(() => {
    if (!data) return;
    data.forEach((q) => {
      if (q?.symbol) mutate(`/api/quote?symbol=${q.symbol}`, q, false);
    });
  }, [data, mutate]);

  const map = new Map<string, Quote>();
  (data ?? []).forEach((q) => {
    if (q?.symbol) map.set(q.symbol, q);
  });

  return { quotes: map, isLoading };
}
