"use client";

import { useEffect, useRef } from "react";
import { useNewsSummary } from "../hooks/useNewsSummary";
import type { NewsItem } from "../api/newsHandler";

function timeAgo(unix: number): string {
  const diff = Math.floor((Date.now() / 1000 - unix) / 60);
  if (diff < 1) return "방금";
  if (diff < 60) return `${diff}분 전`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export default function NewsModal({
  item,
  onClose,
}: {
  item: NewsItem & { _symbol?: string };
  onClose: () => void;
}) {
  const { summary, isLoading, error } = useNewsSummary(item);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
    >
      <div className="w-full max-w-lg bg-panel border border-border rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted">
            {item._symbol && (
              <span className="font-semibold bg-panel2 border border-border rounded px-1.5 py-0.5">
                {item._symbol}
              </span>
            )}
            <span className="font-medium">{item.source}</span>
            <span>·</span>
            <span>{timeAgo(item.datetime)}</span>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white px-1.5 py-0.5 rounded hover:bg-panel2 text-sm"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5">
          {isLoading ? (
            <div className="flex flex-col gap-3 pt-2">
              <div className="h-6 w-4/5 rounded bg-panel2 animate-pulse" />
              <div className="h-6 w-3/5 rounded bg-panel2 animate-pulse" />
              <div className="h-4 w-full rounded bg-panel2 animate-pulse mt-3" />
              <div className="h-4 w-full rounded bg-panel2 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-panel2 animate-pulse" />
            </div>
          ) : error ? (
            <div className="flex flex-col gap-3 pt-2">
              <p className="font-semibold text-base leading-snug">{item.headline}</p>
              {item.summary && (
                <p className="text-sm text-muted leading-relaxed">{item.summary}</p>
              )}
              <p className="text-xs text-down mt-1">번역을 불러올 수 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-2">
              <h2 className="font-bold text-lg leading-snug">{summary?.headline}</h2>
              <p className="text-sm leading-relaxed text-white/90">{summary?.summary}</p>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted italic line-clamp-2">{item.headline}</p>
              </div>
            </div>
          )}
        </div>

        {/* 원문 버튼 */}
        <div className="px-5 pb-5 pt-2 shrink-0 border-t border-border">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border bg-panel2 hover:bg-border text-sm transition-colors"
          >
            원문 읽기
            <span className="text-muted text-xs">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
