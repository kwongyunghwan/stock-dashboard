"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useAlerts } from "./hooks/useAlerts";
import type { AlertConfig, AlertNotification } from "./types";

type AlertsCtx = {
  // 설정
  alerts: AlertConfig[];
  upsert: (config: AlertConfig) => void;
  remove: (symbol: string) => void;
  get: (symbol: string) => AlertConfig | null;
  // 알림
  notifications: AlertNotification[];
  fireNotification: (n: Omit<AlertNotification, "id" | "triggeredAt">, key: string) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  isFired: (key: string) => boolean;
};

const AlertsContext = createContext<AlertsCtx | null>(null);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const { alerts, upsert: _upsert, remove: _remove, get } = useAlerts();

  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [firedKeys, setFiredKeys] = useState<Set<string>>(new Set());

  // 설정 저장 시 해당 종목의 fired 키 초기화 (새 조건으로 재감지)
  const upsert = useCallback((config: AlertConfig) => {
    _upsert(config);
    setFiredKeys((prev) => {
      const next = new Set(prev);
      [...next].filter((k) => k.startsWith(config.symbol + "-")).forEach((k) => next.delete(k));
      return next;
    });
  }, [_upsert]);

  // 삭제 시 해당 종목 알림도 제거
  const remove = useCallback((symbol: string) => {
    _remove(symbol);
    setFiredKeys((prev) => {
      const next = new Set(prev);
      [...next].filter((k) => k.startsWith(symbol + "-")).forEach((k) => next.delete(k));
      return next;
    });
    setNotifications((prev) => prev.filter((n) => n.symbol !== symbol));
  }, [_remove]);

  const isFired = useCallback((key: string) => firedKeys.has(key), [firedKeys]);

  const fireNotification = useCallback(
    (n: Omit<AlertNotification, "id" | "triggeredAt">, key: string) => {
      setFiredKeys((prev) => new Set(prev).add(key));
      setNotifications((prev) => {
        // 동일 종목+타입 중복 방지
        const isDuplicate = prev.some((x) => x.symbol === n.symbol && x.type === n.type);
        if (isDuplicate) return prev;
        const notification: AlertNotification = {
          ...n,
          id: `${n.symbol}-${n.type}-${Date.now()}`,
          triggeredAt: Date.now(),
        };
        return [notification, ...prev];
      });
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        upsert,
        remove,
        get,
        notifications,
        fireNotification,
        dismissNotification,
        clearNotifications,
        isFired,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlertsContext(): AlertsCtx {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlertsContext must be used inside AlertsProvider");
  return ctx;
}
