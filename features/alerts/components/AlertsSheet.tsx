"use client";

import { useEffect, useState } from "react";
import { useAlertsContext } from "../AlertsContext";
import { getKoreanName } from "@/shared/data/symbolNames";
import { formatPrice, type Currency } from "@/shared/utils/format";
import type { AlertNotification } from "../types";

type SheetTab = "triggered" | "configured";

function notificationLabel(n: AlertNotification, currency: Currency, fxRate: number) {
  const price = formatPrice(n.price, currency, fxRate);
  switch (n.type) {
    case "target_above": return `목표가 도달 ↑  ${price}`;
    case "target_below": return `목표가 도달 ↓  ${price}`;
    case "surge":        return `급등 +${n.changePercent?.toFixed(2)}%  (${price})`;
    case "plunge":       return `급락 ${n.changePercent?.toFixed(2)}%  (${price})`;
  }
}

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  return `${Math.floor(diff / 3600)}시간 전`;
}

export default function AlertsSheet({
  open,
  onClose,
  currency,
  fxRate,
}: {
  open: boolean;
  onClose: () => void;
  currency: Currency;
  fxRate: number;
}) {
  const { alerts, remove, notifications, dismissNotification, clearNotifications } =
    useAlertsContext();
  const [tab, setTab] = useState<SheetTab>("triggered");

  useEffect(() => {
    if (!open) return;
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

  const activeAlerts = alerts.filter(
    (a) => a.targetPrice != null || a.surgeEnabled || a.plungeEnabled
  );

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
        aria-label="알림"
        className={`fixed bottom-0 left-1/2 z-50 w-full max-w-7xl max-h-[40vh] flex flex-col bg-panel border border-b-0 border-border rounded-t-2xl shadow-2xl transform transition-transform duration-300 -translate-x-1/2 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* 드래그 핸들 */}
        <div className="flex items-center justify-center pt-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border shrink-0">
          {/* 탭 */}
          <div className="flex gap-1">
            <button
              onClick={() => setTab("triggered")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "triggered"
                  ? "bg-panel2 text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              발생한 알림
              {notifications.length > 0 && (
                <span className="text-[10px] bg-down text-white rounded-full px-1.5 py-0.5 font-bold leading-none">
                  {notifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("configured")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "configured"
                  ? "bg-panel2 text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              설정한 알림
              {activeAlerts.length > 0 && (
                <span className="text-[10px] bg-border text-muted rounded-full px-1.5 py-0.5 font-bold leading-none">
                  {activeAlerts.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-muted hover:text-white text-sm px-2 py-1 rounded hover:bg-panel2"
          >
            닫기
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4">

          {/* 발생한 알림 탭 */}
          {tab === "triggered" && (
            notifications.length === 0 ? (
              <div className="text-center text-sm text-muted py-8">
                발생한 알림이 없습니다.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted">{notifications.length}개의 알림</p>
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] text-muted hover:text-white"
                  >
                    모두 지우기
                  </button>
                </div>
                {notifications.map((n) => {
                  const koName = getKoreanName(n.symbol);
                  const isSurgeOrPlunge = n.type === "surge" || n.type === "plunge";
                  const colorClass = n.type === "surge" || n.type === "target_above"
                    ? "border-up/30 bg-up/5"
                    : "border-down/30 bg-down/5";
                  const tagClass = n.type === "surge" || n.type === "target_above"
                    ? "text-up" : "text-down";
                  return (
                    <div
                      key={n.id}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${colorClass}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold text-sm">{n.symbol}</span>
                          {koName && <span className="text-[10px] text-muted">({koName})</span>}
                        </div>
                        <p className={`text-xs font-medium mt-0.5 ${tagClass}`}>
                          {notificationLabel(n, currency, fxRate)}
                        </p>
                        {n.targetPrice != null && !isSurgeOrPlunge && (
                          <p className="text-[11px] text-muted mt-0.5">
                            목표 {formatPrice(n.targetPrice, currency, fxRate)}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] text-muted shrink-0">{timeAgo(n.triggeredAt)}</span>
                      <button
                        onClick={() => dismissNotification(n.id)}
                        className="text-muted hover:text-white px-1 shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* 설정한 알림 탭 */}
          {tab === "configured" && (
            activeAlerts.length === 0 ? (
              <div className="text-center text-sm text-muted py-8">
                설정된 알림이 없습니다. 카드의 알림 버튼으로 추가해주세요.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {activeAlerts.map((a) => {
                  const koName = getKoreanName(a.symbol);
                  return (
                    <div
                      key={a.symbol}
                      className="flex items-center gap-3 rounded-lg bg-panel2 border border-border px-4 py-3"
                    >
                      <div className="w-24 shrink-0">
                        <p className="font-semibold text-sm">{a.symbol}</p>
                        {koName && <p className="text-[10px] text-muted">{koName}</p>}
                      </div>
                      <div className="flex flex-wrap gap-2 flex-1 text-xs">
                        {a.targetPrice != null && (
                          <span className="bg-border/60 rounded px-2 py-0.5 tabular-nums">
                            목표가 {formatPrice(a.targetPrice, currency, fxRate)}
                            <span className="text-muted ml-1">
                              {a.targetDirection === "above" ? "↑" : a.targetDirection === "below" ? "↓" : ""}
                            </span>
                          </span>
                        )}
                        {a.surgeEnabled && (
                          <span className="bg-up/10 text-up rounded px-2 py-0.5">
                            급등 +{a.surgeThreshold}%
                          </span>
                        )}
                        {a.plungeEnabled && (
                          <span className="bg-down/10 text-down rounded px-2 py-0.5">
                            급락 -{a.plungeThreshold}%
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => remove(a.symbol)}
                        aria-label="알림 삭제"
                        className="text-muted hover:text-down px-1 rounded shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </aside>
    </>
  );
}
