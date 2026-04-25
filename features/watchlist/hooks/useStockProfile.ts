"use client";

import useSWR from "swr";
import { fetcher } from "@/shared/utils/fetcher";
import type { StockProfile } from "../types";

export function useStockProfile(symbol: string) {
  const { data, isLoading } = useSWR<StockProfile>(
    symbol ? `/api/profile?symbol=${symbol}` : null,
    fetcher,
    { refreshInterval: 60 * 60_000, revalidateOnFocus: false }
  );
  return { profile: data, isLoading };
}
