"use client";

import { memo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface MiniSymbolOverviewWidgetProps {
  symbol: string;
}

const MiniSymbolOverviewWidget = ({
  symbol,
}: MiniSymbolOverviewWidgetProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || !resolvedTheme) return;

    // Clear previous widget (important for theme / symbol changes)
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "12M",
      colorTheme: resolvedTheme === "light" ? "light" : "dark",
      isTransparent: false,
      autosize: false,
      largeChartUrl: "",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full h-full"
    >
      <div className="tradingview-widget-container__widget w-full h-full" />
    </div>
  );
};

export default memo(MiniSymbolOverviewWidget);
