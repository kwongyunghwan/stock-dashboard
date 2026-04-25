export type AlertConfig = {
  symbol: string;
  targetPrice: number | null;           // USD 기준 저장
  targetPriceCurrency: "KRW" | "USD";   // 입력 시 선택한 통화
  targetDirection: "above" | "below" | null; // 설정 시 현재가 기준 방향
  surgeEnabled: boolean;
  surgeThreshold: number;               // % (양수, 예: 5 → +5%)
  plungeEnabled: boolean;
  plungeThreshold: number;              // % (양수, 예: 5 → -5%)
};

export type NotificationType = "target_above" | "target_below" | "surge" | "plunge";

export type AlertNotification = {
  id: string;
  symbol: string;
  type: NotificationType;
  price: number;          // 발생 시점 가격 (USD)
  changePercent?: number;
  targetPrice?: number;   // USD
  triggeredAt: number;    // Date.now()
};
