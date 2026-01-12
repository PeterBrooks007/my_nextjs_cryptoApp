"use client";

import { Area, AreaChart, Line, ResponsiveContainer, YAxis, CartesianGrid, XAxis, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

type LineChartDashboardProps = {
  data: { name: string; value: number }[];
  dataPricePercentage: number;
};

export default function LineChartDashboard({ data, dataPricePercentage }: LineChartDashboardProps) {
  const color = dataPricePercentage < 0 ? "red" : "green"; // dynamic color
  const gradientId = `gradient-${color}`;

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
        <AreaChart data={data} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          {/* Gradient for area fill */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* X and Y axes */}
          <XAxis dataKey="name" axisLine={false} tickLine={false} tickFormatter={(value) => value} />
          <YAxis
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => (value >= 1000 ? `${Math.floor(value / 1000)}k` : value)}
          />

          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "lightgray",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
            }}
            labelStyle={{ fontWeight: "bold" }}
            itemStyle={{ color: color }}
          />

          {/* Area and Line */}
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
