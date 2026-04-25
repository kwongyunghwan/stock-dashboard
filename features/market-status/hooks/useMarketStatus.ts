"use client";

import { useEffect, useState } from "react";
import { getMarketStatus } from "../utils/marketHours";
import type { MarketStatus } from "../types";

export function useMarketStatus(): MarketStatus | null {
  const [status, setStatus] = useState<MarketStatus | null>(null);

  useEffect(() => {
    setStatus(getMarketStatus());
    const id = setInterval(() => setStatus(getMarketStatus()), 30_000);
    return () => clearInterval(id);
  }, []);

  return status;
}
