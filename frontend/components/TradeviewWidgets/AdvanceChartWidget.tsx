"use client";

import { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

type TradingViewWidgetProps = {
  tradingpage?: "true" | "false";
};

const AdvanceChartWidget = ({ tradingpage }: TradingViewWidgetProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget (important when theme changes)
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const config = {
      autosize: true,
      symbol: "BITSTAMP:BTCUSD",
      interval: "D",
      timezone: "Etc/UTC",
      theme: resolvedTheme === "light" ? "light" : "dark",
      style: "1",
      locale: "en",
      backgroundColor:
        tradingpage === "true"
          ? "transparent"
          : resolvedTheme === "light"
          ? "white"
          : "#171717",
      gridColor:
        tradingpage === "true"
          ? resolvedTheme === "light"
            ? "rgba(47,49,58,0.05)"
            : "rgba(47,49,58,0.2)"
          : "transparent",
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      withdateranges: true,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    };

    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [resolvedTheme, tradingpage]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full h-full"
    >
      <div className="tradingview-widget-container__widget w-full h-full" />
    </div>
  );
};

export default memo(AdvanceChartWidget);
