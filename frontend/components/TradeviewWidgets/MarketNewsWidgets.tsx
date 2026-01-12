"use client";

import { memo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const MarketNewsWidgets = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || !resolvedTheme) return;

    // Clear previous widget (important on theme change)
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      feedMode: "all_symbols",
    //   isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "100%",
      colorTheme: resolvedTheme === "light" ? "light" : "dark",
      locale: "en",
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full h-full"
    >
      <div className="tradingview-widget-container__widget w-full h-full" />

      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default memo(MarketNewsWidgets);
