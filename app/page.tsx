"use client";

import { useState } from "react";
import IndicesBar from "@/features/indices/components/IndicesBar";
import CurrencyToggle from "@/features/currency/components/CurrencyToggle";
import { useCurrency } from "@/features/currency/hooks/useCurrency";
import { useFxRate } from "@/features/currency/hooks/useFxRate";
import AddSymbolForm from "@/features/watchlist/components/AddSymbolForm";
import WatchlistGrid from "@/features/watchlist/components/WatchlistGrid";
import { useWatchlist } from "@/features/watchlist/hooks/useWatchlist";
import Portfolio from "@/features/portfolio/components/Portfolio";
import RefreshButton from "@/shared/components/RefreshButton";
import NameModal from "@/features/user/components/NameModal";
import UserMenu from "@/features/user/components/UserMenu";
import { useUserBootstrap } from "@/features/user/hooks/useUserBootstrap";
import { UserProvider } from "@/shared/user/UserContext";
import NewsPage from "@/features/news/components/NewsPage";
import { AlertsProvider } from "@/features/alerts/AlertsContext";
import Alerts from "@/features/alerts/components/Alerts";
import AlertMonitor from "@/features/alerts/components/AlertMonitor";
import type { User } from "@/shared/types/user";

type Tab = "dashboard" | "news";

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
  const { symbols, add, remove, reorder } = useWatchlist();
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <AlertsProvider>
    <AlertMonitor />
    <main className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        {/* 상단 바: 제목 + 컨트롤 */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {user.name}님의 Dashboard
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 w-full sm:w-auto sm:justify-end">
            {/* 시장 정보 */}
            <div className="flex flex-wrap items-center gap-2">
              <IndicesBar />
              <CurrencyToggle currency={currency} onChange={setCurrency} />
            </div>
            {/* 사용자 메뉴 */}
            <div className="flex items-center gap-2 ml-auto sm:ml-4">
              <Portfolio currency={currency} fxRate={fxRate} />
              <Alerts currency={currency} fxRate={fxRate} />
              <UserMenu />
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <nav className="flex gap-1 border-b border-border">
          {(
            [
              { id: "dashboard", label: "대시보드" },
              { id: "news", label: "뉴스" },
            ] as { id: Tab; label: string }[]
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === id
                  ? "border-white text-white"
                  : "border-transparent text-muted hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {tab === "dashboard" && (
        <>
          <AddSymbolForm onAdd={add} right={<RefreshButton />} />
          <WatchlistGrid
            symbols={symbols}
            currency={currency}
            fxRate={fxRate}
            onRemove={remove}
            onReorder={reorder}
          />
        </>
      )}

      {tab === "news" && <NewsPage symbols={symbols} />}

      <footer className="text-xs text-muted text-center pt-4">
        시세: Finnhub · 차트/지수: Yahoo Finance · 환율: Finnhub Forex · 데이터: Supabase
      </footer>
    </main>
    </AlertsProvider>
  );
}
