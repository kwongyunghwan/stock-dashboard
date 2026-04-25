"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@/shared/types/user";
import { ensureUserByName } from "../api/users";
import { readSavedName, writeSavedName } from "../utils/storage";

type State =
  | { status: "loading" }
  | { status: "needs-name" }
  | { status: "ready"; user: User }
  | { status: "error"; message: string };

/**
 * Owns the user identity flow: read saved name from localStorage,
 * resolve (or create) the matching row in Supabase, expose the user.
 */
export function useUserBootstrap() {
  const [state, setState] = useState<State>({ status: "loading" });

  const submitName = useCallback(async (raw: string) => {
    const name = raw.trim();
    if (!name) return;
    setState({ status: "loading" });
    try {
      const user = await ensureUserByName(name);
      writeSavedName(user.name);
      setState({ status: "ready", user });
    } catch (e: any) {
      setState({ status: "error", message: e?.message ?? "알 수 없는 오류" });
    }
  }, []);

  const signOut = useCallback(() => {
    writeSavedName(null);
    setState({ status: "needs-name" });
  }, []);

  useEffect(() => {
    const saved = readSavedName();
    if (!saved) {
      setState({ status: "needs-name" });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const user = await ensureUserByName(saved);
        if (!cancelled) setState({ status: "ready", user });
      } catch (e: any) {
        if (!cancelled)
          setState({ status: "error", message: e?.message ?? "오류" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { state, submitName, signOut };
}
