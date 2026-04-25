"use client";

import useSWR from "swr";
import { fetcher } from "@/shared/utils/fetcher";
import type { Quote } from "@/shared/types/quote";

export function useQuote(symbol: string) {
  const { data, isLoading } = useSWR<Quote>(
    symbol ? `/api/quote?symbol=${symbol}` : null,
    fetcher,
    {
      refreshInterval: 30_000,
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );
  return { quote: data, isLoading };
}
