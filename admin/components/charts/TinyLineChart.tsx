"use client";

import { Area, AreaChart, Line, ResponsiveContainer, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart";

type TinyLineChartProps = {
  data: { name: string; value: number }[];
  dataPricePercentage: number;
};

export default function TinyLineChart({
  data,
  dataPricePercentage,
}: TinyLineChartProps) {
  const isNegative = dataPricePercentage < 0;
  const strokeColor = isNegative ? "red" : "#009e4a";
  const gradientColor = isNegative ? "red" : "green";
  const gradientId = `gradient-${gradientColor}`;

  return (
    <ChartContainer
      config={{
        value: {
          label: "Value",
          color: strokeColor,
        },
      }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={gradientColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <YAxis hide domain={["auto", "auto"]} />

          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            fill={`url(#${gradientId})`}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
          />

          {/* <ChartTooltip cursor={false} content={<ChartTooltipContent />} /> */}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
