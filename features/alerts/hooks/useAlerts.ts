"use client";

import useSWR from "swr";
import { getSupabase } from "@/shared/supabase/client";
import { useUser } from "@/shared/user/UserContext";
import type { AlertConfig } from "../types";

type Row = {
  symbol: string;
  target_price_usd: number | null;
  target_price_currency: string;
  target_direction: string | null;
  surge_enabled: boolean;
  surge_threshold: number;
  plunge_enabled: boolean;
  plunge_threshold: number;
};

function rowToConfig(r: Row): AlertConfig {
  return {
    symbol: r.symbol,
    targetPrice: r.target_price_usd != null ? Number(r.target_price_usd) : null,
    targetPriceCurrency: (r.target_price_currency as "KRW" | "USD") ?? "USD",
    targetDirection: (r.target_direction as "above" | "below" | null) ?? null,
    surgeEnabled: r.surge_enabled,
    surgeThreshold: Number(r.surge_threshold),
    plungeEnabled: r.plunge_enabled,
    plungeThreshold: Number(r.plunge_threshold),
  };
}

async function fetchAlerts(userId: string): Promise<AlertConfig[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("alerts")
    .select("symbol,target_price_usd,target_price_currency,target_direction,surge_enabled,surge_threshold,plunge_enabled,plunge_threshold")
    .eq("user_id", userId)
    .order("symbol", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToConfig);
}

export function useAlerts() {
  const { user } = useUser();
  const key = ["alerts", user.id] as const;

  const { data, mutate } = useSWR<AlertConfig[]>(key, () => fetchAlerts(user.id));

  const alerts = data ?? [];

  async function upsert(config: AlertConfig) {
    const sb = getSupabase();
    await mutate(
      async (current) => {
        await sb.from("alerts").upsert(
          {
            user_id: user.id,
            symbol: config.symbol,
            target_price_usd: config.targetPrice,
            target_price_currency: config.targetPriceCurrency,
            target_direction: config.targetDirection,
            surge_enabled: config.surgeEnabled,
            surge_threshold: config.surgeThreshold,
            plunge_enabled: config.plungeEnabled,
            plunge_threshold: config.plungeThreshold,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,symbol" }
        );
        const next = [...(current ?? []).filter((a) => a.symbol !== config.symbol), config];
        return next;
      },
      { revalidate: false }
    );
  }

  async function remove(symbol: string) {
    const sb = getSupabase();
    await mutate(
      async (current) => {
        await sb.from("alerts").delete().eq("user_id", user.id).eq("symbol", symbol);
        return (current ?? []).filter((a) => a.symbol !== symbol);
      },
      { revalidate: false }
    );
  }

  function get(symbol: string): AlertConfig | null {
    return alerts.find((a) => a.symbol === symbol) ?? null;
  }

  return { alerts, upsert, remove, get };
}
