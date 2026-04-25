import type { Holding, HoldingMetrics } from "../types";

export function computeMetrics(
  holding: Holding,
  currentPrice: number | undefined
): HoldingMetrics {
  const cost = holding.avgPrice * holding.quantity;
  const price = currentPrice ?? holding.avgPrice;
  const marketValue = price * holding.quantity;
  const pnl = marketValue - cost;
  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
  return { cost, marketValue, pnl, pnlPct };
}

export function computeTotals(
  holdings: Holding[],
  prices: Map<string, number | undefined>
) {
  let cost = 0;
  let marketValue = 0;
  for (const h of holdings) {
    const m = computeMetrics(h, prices.get(h.symbol));
    cost += m.cost;
    marketValue += m.marketValue;
  }
  const pnl = marketValue - cost;
  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
  return { cost, marketValue, pnl, pnlPct };
}
