"use client";

import useSWR from "swr";
import { fetcher } from "@/shared/utils/fetcher";
import type { ChartResponse, Range } from "../types";

export function useChart(symbol: string, range: Range) {
  const { data, isLoading } = useSWR<ChartResponse>(
    `/api/chart?symbol=${symbol}&range=${range}`,
    fetcher,
    { refreshInterval: range === "1d" ? 60_000 : 300_000 }
  );
  return { points: data?.points ?? [], isLoading };
}
