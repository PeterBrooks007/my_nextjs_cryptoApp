"use client";

import { Area, AreaChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

type CoinDetailsChartProps = {
  data: { name: number; value: number }[] | undefined;
  dataPricePercentage: number | undefined;
};

export default function CoinDetailsChart({
  data,
  dataPricePercentage,
}: CoinDetailsChartProps) {
  const color = (dataPricePercentage ?? 0) < 0 ? "red" : "green";
  const gradientId = `colorPv-${color}`;

  return (
    <ChartContainer
      config={{
        value: {
          label: "Value",
          color: color,
        },
      }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          {/* Gradient */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Y Axis */}
          <YAxis
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              value >= 1000 ? `${Math.floor(value / 1000)}k` : value
            }
          />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            fill={`url(#${gradientId})`}
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
