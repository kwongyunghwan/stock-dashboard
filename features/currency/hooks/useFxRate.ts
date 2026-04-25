"use client";

import useSWR from "swr";
import { fetcher } from "@/shared/utils/fetcher";
import type { FxResponse } from "../types";

const FALLBACK = 1380;

export function useFxRate() {
  const { data } = useSWR<FxResponse>("/api/fx", fetcher, {
    refreshInterval: 10 * 60_000,
  });
  return data?.rate ?? FALLBACK;
}
