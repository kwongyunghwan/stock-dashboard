"use client";

import { useState } from "react";
import Image from "next/image";
import alarmIcon from "@/app/assets/icon/ALARM.png";
import { useAlertsContext } from "../AlertsContext";
import AlertsSheet from "./AlertsSheet";
import type { Currency } from "@/shared/utils/format";

export default function Alerts({
  currency,
  fxRate,
}: {
  currency: Currency;
  fxRate: number;
}) {
  const [open, setOpen] = useState(false);
  const { notifications } = useAlertsContext();
  const activeCount = notifications.length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-border bg-panel2 hover:bg-border transition-colors"
        aria-label="알림 설정"
      >
        <Image src={alarmIcon} alt="알림" width={18} height={18} className="shrink-0 brightness-0 invert opacity-70" />
        <span className="hidden sm:inline">알림</span>
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-up text-black text-[10px] font-bold px-1">
            {activeCount}
          </span>
        )}
      </button>

      <AlertsSheet
        open={open}
        onClose={() => setOpen(false)}
        currency={currency}
        fxRate={fxRate}
      />
    </>
  );
}
