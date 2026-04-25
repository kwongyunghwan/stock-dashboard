export type MarketSession =
  | "regular"      // 정규장
  | "pre"          // 프리마켓
  | "after"        // 애프터마켓
  | "closed";      // 장마감 (주말/시간외)

export type MarketStatus = {
  session: MarketSession;
  label: string;
  /** Minutes until next session change (for display, optional) */
  nyTime: string;
};
