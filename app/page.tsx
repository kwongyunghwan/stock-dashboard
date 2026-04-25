"use client";

import IndicesBar from "@/features/indices/components/IndicesBar";
import CurrencyToggle from "@/features/currency/components/CurrencyToggle";
import { useCurrency } from "@/features/currency/hooks/useCurrency";
import { useFxRate } from "@/features/currency/hooks/useFxRate";
import AddSymbolForm from "@/features/watchlist/components/AddSymbolForm";
import WatchlistGrid from "@/features/watchlist/components/WatchlistGrid";
import { useWatchlist } from "@/features/watchlist/hooks/useWatchlist";
import Portfolio from "@/features/portfolio/components/Portfolio";
import MarketStatusBadge from "@/features/market-status/components/MarketStatusBadge";
import RefreshButton from "@/shared/components/RefreshButton";
import NameModal from "@/features/user/components/NameModal";
import UserMenu from "@/features/user/components/UserMenu";
import { useUserBootstrap } from "@/features/user/hooks/useUserBootstrap";
import { UserProvider } from "@/shared/user/UserContext";
import type { User } from "@/shared/types/user";

export default function Page() {
  const { state, submitName, signOut } = useUserBootstrap();

  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted">
        불러오는 중…
      </div>
    );
  }

  if (state.status === "needs-name" || state.status === "error") {
    return (
      <NameModal
        loading={false}
        error={state.status === "error" ? state.message : undefined}
        onSubmit={submitName}
      />
    );
  }

  return (
    <UserProvider user={state.user} signOut={signOut}>
      <Dashboard user={state.user} />
    </UserProvider>
  );
}

function Dashboard({ user }: { user: User }) {
  const { currency, setCurrency } = useCurrency();
  const fxRate = useFxRate();
  const { symbols, add, remove } = useWatchlist();

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {user.name}님의 Dashboard
            </h1>
            <p className="text-sm text-muted">
              환율 1 USD = ₩
              {fxRate.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MarketStatusBadge />
            <RefreshButton />
            <IndicesBar />
            <CurrencyToggle currency={currency} onChange={setCurrency} />
            <Portfolio currency={currency} fxRate={fxRate} />
            <UserMenu />
          </div>
        </div>
      </header>

      <AddSymbolForm onAdd={add} />

      <WatchlistGrid
        symbols={symbols}
        currency={currency}
        fxRate={fxRate}
        onRemove={remove}
      />

      <footer className="text-xs text-muted text-center pt-4">
        시세: Finnhub · 차트/지수: Yahoo Finance · 환율: Finnhub Forex · 데이터: Supabase
      </footer>
    </main>
  );
}
