"use client";

import { useState } from "react";
import { useNews } from "../hooks/useNews";
import { useCompanyNews } from "../hooks/useCompanyNews";
import NewsModal from "./NewsModal";
import type { NewsItem } from "../api/newsHandler";

type NewsTab = "market" | "my";
type AnyNewsItem = NewsItem & { _symbol?: string };

function timeAgo(unix: number): string {
  const diff = Math.floor((Date.now() / 1000 - unix) / 60);
  if (diff < 1) return "방금";
  if (diff < 60) return `${diff}분 전`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

function NewsList({
  news,
  isLoading,
  onSelect,
}: {
  news: AnyNewsItem[];
  isLoading: boolean;
  onSelect: (item: AnyNewsItem) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-panel border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center text-sm text-muted py-16">
        뉴스를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {news.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="flex gap-4 rounded-xl bg-panel border border-border p-4 hover:bg-panel2 transition-colors group text-left w-full"
        >
          {item.image && (
            <img
              src={item.image}
              alt=""
              className="w-20 h-16 object-cover rounded-lg shrink-0 bg-panel2"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <div className="flex flex-col gap-1 min-w-0">
            {item._symbol && (
              <span className="text-[10px] font-semibold text-muted bg-panel2 border border-border rounded px-1.5 py-0.5 self-start">
                {item._symbol}
              </span>
            )}
            <p className="text-sm font-semibold leading-snug group-hover:text-up transition-colors line-clamp-2">
              {item.headline}
            </p>
            <p className="text-xs text-muted line-clamp-2 leading-relaxed">
              {item.summary}
            </p>
            <div className="flex items-center gap-2 mt-auto text-[11px] text-muted">
              <span className="font-medium">{item.source}</span>
              <span>·</span>
              <span>{timeAgo(item.datetime)}</span>
              <span className="ml-auto text-[10px] text-muted/60 group-hover:text-muted">한국어 요약 보기 →</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function NewsPage({ symbols }: { symbols: string[] }) {
  const [tab, setTab] = useState<NewsTab>("market");
  const [selected, setSelected] = useState<AnyNewsItem | null>(null);

  const { news: marketNews, isLoading: marketLoading } = useNews();
  const { news: companyNews, isLoading: companyLoading } = useCompanyNews(symbols);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* 탭 */}
        <div className="flex gap-1 border-b border-border">
          {([
            { id: "market" as NewsTab, label: "전체 시장" },
            { id: "my" as NewsTab, label: `내 종목 (${symbols.length})` },
          ]).map(({ id, label }) => (
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
        </div>

        {tab === "market" && (
          <NewsList news={marketNews} isLoading={marketLoading} onSelect={setSelected} />
        )}
        {tab === "my" && (
          <NewsList news={companyNews} isLoading={companyLoading} onSelect={setSelected} />
        )}
      </div>

      {selected && (
        <NewsModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
