"use client";

import useSWR from "swr";
import { fetcher } from "@/shared/utils/fetcher";
import type { NewsItem } from "../api/newsHandler";

export type CompanyNewsItem = NewsItem & { _symbol: string };

export function useCompanyNews(symbols: string[]) {
  const sorted = [...symbols].sort();
  const key = sorted.length
    ? `/api/company-news?symbols=${sorted.join(",")}`
    : null;

  const { data, isLoading } = useSWR<CompanyNewsItem[]>(key, fetcher, {
    refreshInterval: 5 * 60_000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return { news: data ?? [], isLoading };
}
