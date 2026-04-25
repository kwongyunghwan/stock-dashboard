"use client";

import { useEffect, useState } from "react";
import type { Currency } from "../types";

const STORAGE_KEY = "stock-dashboard:currency";

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>("KRW");

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "USD" || v === "KRW") setCurrency(v);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {}
  }, [currency]);

  return { currency, setCurrency };
}
