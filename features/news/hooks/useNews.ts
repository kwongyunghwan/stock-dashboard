"use client";

import useSWR from "swr";
import { fetcher } from "@/shared/utils/fetcher";
import type { NewsItem } from "../api/newsHandler";

export function useNews() {
  const { data, isLoading } = useSWR<NewsItem[]>("/api/news", fetcher, {
    refreshInterval: 5 * 60_000, // 5분
    revalidateOnFocus: false,
    keepPreviousData: true,
  });
  return { news: data ?? [], isLoading };
}
