import type { MarketStatus } from "../types";

/**
 * Compute US equity market session from current time.
 * Pre: 04:00–09:30 ET, Regular: 09:30–16:00 ET, After: 16:00–20:00 ET.
 * Holidays are not handled (would need a calendar feed).
 */
export function getMarketStatus(now: Date = new Date()): MarketStatus {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = get("weekday"); // Mon, Tue, ...
  const hour = parseInt(get("hour"), 10);
  const minute = parseInt(get("minute"), 10);
  const minutes = hour * 60 + minute;

  const nyTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ET`;
  const isWeekend = weekday === "Sat" || weekday === "Sun";

  if (isWeekend) {
    return { session: "closed", label: "주말 휴장", nyTime };
  }

  const PRE_OPEN = 4 * 60;
  const REGULAR_OPEN = 9 * 60 + 30;
  const REGULAR_CLOSE = 16 * 60;
  const AFTER_CLOSE = 20 * 60;

  if (minutes >= REGULAR_OPEN && minutes < REGULAR_CLOSE) {
    return { session: "regular", label: "정규장", nyTime };
  }
  if (minutes >= PRE_OPEN && minutes < REGULAR_OPEN) {
    return { session: "pre", label: "프리마켓", nyTime };
  }
  if (minutes >= REGULAR_CLOSE && minutes < AFTER_CLOSE) {
    return { session: "after", label: "애프터마켓", nyTime };
  }
  return { session: "closed", label: "장마감", nyTime };
}
