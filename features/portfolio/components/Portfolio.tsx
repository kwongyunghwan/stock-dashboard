"use client";

import { useState } from "react";
import PortfolioButton from "./PortfolioButton";
import PortfolioSheet from "./PortfolioSheet";
import { usePortfolio } from "../hooks/usePortfolio";
import { useQuotes } from "@/shared/hooks/useQuotes";
import { computeTotals } from "../utils/calculations";
import type { Currency } from "@/shared/utils/format";

export default function Portfolio({
  currency,
  fxRate,
}: {
  currency: Currency;
  fxRate: number;
}) {
  const [open, setOpen] = useState(false);
  const { holdings, upsert, remove } = usePortfolio();

  const symbols = holdings.map((h) => h.symbol);
  const { quotes } = useQuotes(symbols);

  const prices = new Map<string, number | undefined>();
  symbols.forEach((s) => prices.set(s, quotes.get(s)?.price));
  const totals = computeTotals(holdings, prices);

  return (
    <>
      <PortfolioButton
        onClick={() => setOpen(true)}
        pnlPct={holdings.length > 0 ? totals.pnlPct : null}
      />
      <PortfolioSheet
        open={open}
        onClose={() => setOpen(false)}
        holdings={holdings}
        prices={prices}
        totals={totals}
        onUpsert={upsert}
        onRemove={remove}
        currency={currency}
        fxRate={fxRate}
      />
    </>
  );
}
