export type Holding = {
  symbol: string;
  quantity: number;
  avgPrice: number; // USD
};

export type HoldingMetrics = {
  cost: number;        // USD: avgPrice * quantity
  marketValue: number; // USD: currentPrice * quantity
  pnl: number;         // USD: marketValue - cost
  pnlPct: number;      // %
};
