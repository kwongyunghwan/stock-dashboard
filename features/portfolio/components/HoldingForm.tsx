"use client";

import { useState } from "react";
import type { Holding } from "../types";
import type { Currency } from "@/shared/utils/format";

export default function HoldingForm({
  fxRate,
  onSubmit,
}: {
  fxRate: number;
  onSubmit: (h: Holding) => void;
}) {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [priceCurrency, setPriceCurrency] = useState<Currency>("KRW");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = Number(quantity);
    const p = Number(avgPrice);
    if (!symbol.trim() || !Number.isFinite(q) || !Number.isFinite(p)) return;
    const avgPriceUsd = priceCurrency === "USD" ? p : p / fxRate;
    onSubmit({
      symbol: symbol.toUpperCase(),
      quantity: q,
      avgPrice: avgPriceUsd,
    });
    setSymbol("");
    setQuantity("");
    setAvgPrice("");
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_2fr_auto] gap-2 p-3 bg-panel2 border border-border rounded-lg"
    >
      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="종목 (NVDA)"
        className="bg-panel border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-muted"
      />
      <input
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="수량"
        type="number"
        step="any"
        min="0"
        className="bg-panel border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-muted"
      />
      <div className="col-span-2 sm:col-span-1 flex bg-panel border border-border rounded-md overflow-hidden focus-within:border-muted">
        <input
          value={avgPrice}
          onChange={(e) => setAvgPrice(e.target.value)}
          placeholder={`평균단가 (${priceCurrency})`}
          type="number"
          step="any"
          min="0"
          className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm outline-none"
        />
        <div className="flex border-l border-border">
          {(["KRW", "USD"] as Currency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setPriceCurrency(c)}
              className={`px-2 text-xs ${
                priceCurrency === c
                  ? "bg-panel2 text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              {c === "KRW" ? "원" : "$"}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="col-span-2 sm:col-span-1 px-3 py-2 bg-panel border border-border rounded-md text-sm hover:bg-border"
      >
        추가/수정
      </button>
    </form>
  );
}
