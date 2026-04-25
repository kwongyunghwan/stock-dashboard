"use client";

import type { Range } from "../types";

const LABELS: Record<Range, string> = { "1d": "1일", "1w": "1주", "1m": "1달" };

export default function RangeSelector({
  value,
  onChange,
}: {
  value: Range;
  onChange: (r: Range) => void;
}) {
  return (
    <div className="flex gap-1 text-xs">
      {(Object.keys(LABELS) as Range[]).map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-2 py-1 rounded-md border ${
            value === r
              ? "bg-panel2 border-border text-white"
              : "border-transparent text-muted hover:text-white"
          }`}
        >
          {LABELS[r]}
        </button>
      ))}
    </div>
  );
}
