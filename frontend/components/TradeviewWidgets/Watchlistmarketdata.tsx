"use client";

import { memo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const WatchlistMarketData = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || !resolvedTheme) return;

    // Clear previous widget on theme change
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      symbolsGroups: [
        {
          name: "CRYPTO",
          originalName: "Forex",
          symbols: [{ name: "BITSTAMP:BTCUSD" }, { name: "BINANCE:BTCUSDT" }],
        },
        {
          name: "STOCKS",
          symbols: [{ name: "NASDAQ:AAPL" }, { name: "NASDAQ:TSLA" }],
        },
        {
          name: "FOREX",
          symbols: [{ name: "FX:EURUSD" }, { name: "FX:GBPUSD" }],
        },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      colorTheme: resolvedTheme === "light" ? "light" : "dark",
      locale: "en",
      // backgroundColor: "#131722",
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

      {/* <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">
            Track all markets on TradingView
          </span>
        </a>
      </div> */}
    </div>
  );
};

export default memo(WatchlistMarketData);
