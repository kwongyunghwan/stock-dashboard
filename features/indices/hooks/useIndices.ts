"use client";

import useSWR from "swr";
import { fetcher } from "@/shared/utils/fetcher";
import type { IndicesResponse } from "../types";

export function useIndices() {
  const { data, error, isLoading } = useSWR<IndicesResponse>(
    "/api/indices",
    fetcher,
    { refreshInterval: 30_000 }
  );
  return { indices: data?.indices ?? [], error, isLoading };
}
