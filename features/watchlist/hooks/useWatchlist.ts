"use client";

import useSWR from "swr";
import { getSupabase } from "@/shared/supabase/client";
import { useUser } from "@/shared/user/UserContext";
import { DEFAULT_SYMBOLS } from "../utils/storage";

type Row = { symbol: string };

async function fetchSymbols(userId: string): Promise<string[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("watchlist")
    .select("symbol,added_at")
    .eq("user_id", userId)
    .order("added_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r: Row) => r.symbol);
}

async function seedDefaults(userId: string) {
  const sb = getSupabase();
  const rows = DEFAULT_SYMBOLS.map((symbol) => ({ user_id: userId, symbol }));
  await sb.from("watchlist").upsert(rows, { onConflict: "user_id,symbol" });
}

export function useWatchlist() {
  const { user } = useUser();
  const key = ["watchlist", user.id] as const;

  const { data, mutate, isLoading } = useSWR<string[]>(key, async () => {
    let symbols = await fetchSymbols(user.id);
    if (symbols.length === 0) {
      await seedDefaults(user.id);
      symbols = await fetchSymbols(user.id);
    }
    return symbols;
  });

  async function add(rawSymbol: string) {
    const symbol = rawSymbol.trim().toUpperCase();
    if (!symbol) return;
    const sb = getSupabase();
    await mutate(
      async (current) => {
        if (current?.includes(symbol)) return current;
        await sb
          .from("watchlist")
          .upsert(
            { user_id: user.id, symbol },
            { onConflict: "user_id,symbol" }
          );
        return [...(current ?? []), symbol];
      },
      { revalidate: false }
    );
  }

  async function remove(symbol: string) {
    const sb = getSupabase();
    await mutate(
      async (current) => {
        await sb
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("symbol", symbol);
        return (current ?? []).filter((s) => s !== symbol);
      },
      { revalidate: false }
    );
  }

  return { symbols: data ?? [], add, remove, isLoading };
}
