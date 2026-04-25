"use client";

import useSWR from "swr";
import { getSupabase } from "@/shared/supabase/client";
import { useUser } from "@/shared/user/UserContext";
import type { Holding } from "../types";

type Row = {
  symbol: string;
  quantity: number;
  avg_price_usd: number;
};

async function fetchHoldings(userId: string): Promise<Holding[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("holdings")
    .select("symbol,quantity,avg_price_usd,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r: Row) => ({
    symbol: r.symbol,
    quantity: Number(r.quantity),
    avgPrice: Number(r.avg_price_usd),
  }));
}

export function usePortfolio() {
  const { user } = useUser();
  const key = ["holdings", user.id] as const;

  const { data, mutate, isLoading } = useSWR<Holding[]>(key, () =>
    fetchHoldings(user.id)
  );

  async function upsert(input: Holding) {
    const symbol = input.symbol.trim().toUpperCase();
    if (!symbol || input.quantity <= 0 || input.avgPrice <= 0) return;
    const entry: Holding = { ...input, symbol };
    const sb = getSupabase();
    await mutate(
      async (current) => {
        await sb.from("holdings").upsert(
          {
            user_id: user.id,
            symbol,
            quantity: entry.quantity,
            avg_price_usd: entry.avgPrice,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,symbol" }
        );
        const next = [...(current ?? [])];
        const idx = next.findIndex((h) => h.symbol === symbol);
        if (idx >= 0) next[idx] = entry;
        else next.push(entry);
        return next;
      },
      { revalidate: false }
    );
  }

  async function remove(symbol: string) {
    const sb = getSupabase();
    await mutate(
      async (current) => {
        await sb
          .from("holdings")
          .delete()
          .eq("user_id", user.id)
          .eq("symbol", symbol);
        return (current ?? []).filter((h) => h.symbol !== symbol);
      },
      { revalidate: false }
    );
  }

  return { holdings: data ?? [], upsert, remove, isLoading };
}
