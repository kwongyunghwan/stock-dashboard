"use client";

import { useEffect, useState } from "react";
import HoldingForm from "./HoldingForm";
import HoldingsTable from "./HoldingsTable";
import PortfolioSummary from "./PortfolioSummary";
import type { Holding } from "../types";
import type { Currency } from "@/shared/utils/format";

type Totals = {
  cost: number;
  marketValue: number;
  pnl: number;
  pnlPct: number;
};

export default function PortfolioSheet({
  open,
  onClose,
  holdings,
  prices,
  totals,
  onUpsert,
  onRemove,
  currency,
  fxRate,
}: {
  open: boolean;
  onClose: () => void;
  holdings: Holding[];
  prices: Map<string, number | undefined>;
  totals: Totals;
  onUpsert: (h: Holding) => void;
  onRemove: (symbol: string) => void;
  currency: Currency;
  fxRate: number;
}) {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowForm(false);
      return;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function handleUpsert(h: Holding) {
    onUpsert(h);
    setShowForm(false);
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        role="dialog"
        aria-label="내 잔고"
        className={`fixed bottom-0 left-1/2 z-50 w-full max-w-7xl max-h-[70vh] sm:max-h-[50vh] flex flex-col bg-panel border border-b-0 border-border rounded-t-2xl shadow-2xl transform transition-transform duration-300 -translate-x-1/2 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-center pt-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold">내 잔고</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="text-sm px-3 py-1 rounded-md border border-border bg-panel2 hover:bg-border"
            >
              {showForm ? "취소" : "종목추가"}
            </button>
            <button
              onClick={onClose}
              className="text-muted hover:text-white text-sm px-2 py-1 rounded hover:bg-panel2"
            >
              닫기
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 flex flex-col gap-3 shrink-0">
          <PortfolioSummary
            cost={totals.cost}
            marketValue={totals.marketValue}
            pnl={totals.pnl}
            pnlPct={totals.pnlPct}
            currency={currency}
            fxRate={fxRate}
          />
          {showForm && <HoldingForm fxRate={fxRate} onSubmit={handleUpsert} />}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pb-4">
          <HoldingsTable
            holdings={holdings}
            prices={prices}
            currency={currency}
            fxRate={fxRate}
            onRemove={onRemove}
          />
        </div>
      </aside>
    </>
  );
}
