export type Currency = "KRW" | "USD";

function fmtUSD(usd: number, fraction = 2) {
  return usd.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  });
}

function fmtKRW(krw: number) {
  return krw.toLocaleString("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  });
}

export function formatPrice(
  usd: number | undefined | null,
  currency: Currency,
  fxRate: number
): string {
  if (usd == null || Number.isNaN(usd)) return "—";
  if (currency === "USD") return fmtUSD(usd);
  return fmtKRW(usd * fxRate);
}

export function formatChange(
  usd: number | undefined | null,
  currency: Currency,
  fxRate: number
): string {
  if (usd == null || Number.isNaN(usd)) return "—";
  const sign = usd > 0 ? "+" : "";
  if (currency === "USD") return `${sign}${fmtUSD(usd)}`;
  return `${sign}${fmtKRW(usd * fxRate)}`;
}

export function formatPct(n: number | undefined | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}
