"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  Tooltip,
} from "recharts";
import { useChart } from "../hooks/useChart";
import type { Range } from "../types";

export default function MiniChart({
  symbol,
  range,
  up,
}: {
  symbol: string;
  range: Range;
  up: boolean;
}) {
  const { points, isLoading } = useChart(symbol, range);
  const color = up ? "#22c55e" : "#ef4444";

  if (isLoading || points.length === 0) {
    return (
      <div className="h-24 w-full flex items-center justify-center text-xs text-muted">
        {isLoading ? "차트 불러오는 중…" : "데이터 없음"}
      </div>
    );
  }

  const min = Math.min(...points.map((p) => p.c));
  const max = Math.max(...points.map((p) => p.c));

  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={points}
          margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
        >
          <YAxis hide domain={[min, max]} />
          <Tooltip
            contentStyle={{
              background: "#141821",
              border: "1px solid #252b39",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(t) =>
              new Date(t as number).toLocaleString("ko-KR")
            }
            formatter={(v: number) => [`$${v.toFixed(2)}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="c"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
