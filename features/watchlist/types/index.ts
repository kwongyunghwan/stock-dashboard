export type Range = "1d" | "1w" | "1m";

export type ChartPoint = { t: number; c: number };

export type ChartResponse = {
  symbol: string;
  range: Range;
  points: ChartPoint[];
};

export type Earnings = {
  date: string;
  hour: string | null; // 'bmo' | 'amc' | 'dmh'
  epsEstimate: number | null;
  revenueEstimate: number | null;
};

export type Recommendation = {
  period: string;
  buy: number;
  hold: number;
  sell: number;
  strongBuy: number;
  strongSell: number;
};

export type StockProfile = {
  symbol: string;
  earnings: Earnings | null;
  recommendation: Recommendation | null;
  dividendYield: number | null;
};
