"use client";

import { useRef, useState } from "react";
import StockCard from "./StockCard";
import type { Currency } from "@/shared/utils/format";

export default function WatchlistGrid({
  symbols,
  currency,
  fxRate,
  onRemove,
  onReorder,
}: {
  symbols: string[];
  currency: Currency;
  fxRate: number;
  onRemove: (symbol: string) => void;
  onReorder: (newSymbols: string[]) => void;
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  function handleDragStart(e: React.DragEvent, idx: number) {
    setDragIdx(idx);
    dragNode.current = e.currentTarget as HTMLDivElement;
    // 약간 딜레이 후 투명도 적용 (드래그 고스트 이미지 정상 표시)
    requestAnimationFrame(() => {
      if (dragNode.current) dragNode.current.style.opacity = "0.4";
    });
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (idx !== overIdx) setOverIdx(idx);
  }

  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...symbols];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    onReorder(next);
  }

  function handleDragEnd() {
    if (dragNode.current) dragNode.current.style.opacity = "";
    setDragIdx(null);
    setOverIdx(null);
    dragNode.current = null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {symbols.map((s, idx) => (
        <div
          key={s}
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={(e) => handleDrop(e, idx)}
          onDragEnd={handleDragEnd}
          className={`rounded-2xl transition-all duration-150 cursor-grab active:cursor-grabbing ${
            overIdx === idx && dragIdx !== idx
              ? "ring-2 ring-white/30 scale-[1.02]"
              : ""
          }`}
        >
          {/* 드래그 핸들 힌트 */}
          <div className="flex justify-center pt-1 pb-0 opacity-20 hover:opacity-50 transition-opacity select-none">
            <svg width="20" height="6" viewBox="0 0 20 6" fill="currentColor">
              <circle cx="4" cy="3" r="1.5" />
              <circle cx="10" cy="3" r="1.5" />
              <circle cx="16" cy="3" r="1.5" />
            </svg>
          </div>
          <StockCard
            symbol={s}
            currency={currency}
            fxRate={fxRate}
            onRemove={() => onRemove(s)}
          />
        </div>
      ))}
    </div>
  );
}
