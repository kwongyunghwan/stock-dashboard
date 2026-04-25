"use client";

import type { Currency } from "../types";

export default function CurrencyToggle({
  currency,
  onChange,
}: {
  currency: Currency;
  onChange: (c: Currency) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-panel p-1 self-start sm:self-auto">
      {(["KRW", "USD"] as Currency[]).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1 text-sm rounded-md transition ${
            currency === c
              ? "bg-panel2 text-white"
              : "text-muted hover:text-white"
          }`}
        >
          {c === "KRW" ? "원화" : "달러"}
        </button>
      ))}
    </div>
  );
}
