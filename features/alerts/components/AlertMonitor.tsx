"use client";

import { useEffect } from "react";
import { useAlertsContext } from "../AlertsContext";
import { useQuote } from "@/shared/hooks/useQuote";
import type { AlertConfig } from "../types";

// 종목별 감시 (렌더 없음)
function SymbolMonitor({ config }: { config: AlertConfig }) {
  const { quote } = useQuote(config.symbol);
  const { fireNotification, isFired } = useAlertsContext();

  useEffect(() => {
    if (!quote?.price) return;
    const { price, changePercent } = quote;

    // 목표가 도달 — 설정 시 결정된 방향으로만 감지
    if (config.targetPrice != null && config.targetDirection != null) {
      if (config.targetDirection === "above") {
        const key = `${config.symbol}-target_above`;
        if (price >= config.targetPrice && !isFired(key)) {
          fireNotification(
            { symbol: config.symbol, type: "target_above", price, targetPrice: config.targetPrice },
            key
          );
        }
      } else {
        const key = `${config.symbol}-target_below`;
        if (price <= config.targetPrice && !isFired(key)) {
          fireNotification(
            { symbol: config.symbol, type: "target_below", price, targetPrice: config.targetPrice },
            key
          );
        }
      }
    }

    // 급등
    if (config.surgeEnabled) {
      const key = `${config.symbol}-surge`;
      if ((changePercent ?? 0) >= config.surgeThreshold && !isFired(key)) {
        fireNotification(
          { symbol: config.symbol, type: "surge", price, changePercent },
          key
        );
      }
    }

    // 급락
    if (config.plungeEnabled) {
      const key = `${config.symbol}-plunge`;
      if ((changePercent ?? 0) <= -config.plungeThreshold && !isFired(key)) {
        fireNotification(
          { symbol: config.symbol, type: "plunge", price, changePercent },
          key
        );
      }
    }
  }, [quote, config, fireNotification, isFired]);

  return null;
}

// 알림 설정된 모든 종목 감시
export default function AlertMonitor() {
  const { alerts } = useAlertsContext();
  return (
    <>
      {alerts.map((a) => (
        <SymbolMonitor key={a.symbol} config={a} />
      ))}
    </>
  );
}
