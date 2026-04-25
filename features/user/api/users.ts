"use client";

import { getSupabase } from "@/shared/supabase/client";
import type { User } from "@/shared/types/user";

/** Find a user by name; return null if not found. */
export async function findUserByName(name: string): Promise<User | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("users")
    .select("id,name")
    .eq("name", name)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** Get-or-create a user by name. Race-safe via unique constraint. */
export async function ensureUserByName(name: string): Promise<User> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("name required");

  const existing = await findUserByName(trimmed);
  if (existing) return existing;

  const sb = getSupabase();
  const { data, error } = await sb
    .from("users")
    .insert({ name: trimmed })
    .select("id,name")
    .single();

  if (error) {
    // Likely unique violation due to race; fall back to lookup.
    const retry = await findUserByName(trimmed);
    if (retry) return retry;
    throw error;
  }
  return data;
}
