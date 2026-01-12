"use client";

import { memo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const SymbolOverviewWidget = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || !resolvedTheme) return;

    // Clear previous widget (important on theme change)
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        ["BITSTAMP:BTCUSD|1M"],
        ["BITSTAMP:ETHUSD|1M"],
        ["COINBASE:SOLUSD|1M"],
        ["CRYPTOCAP:USDT.D|1M"],
      ],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: resolvedTheme === "light" ? "light" : "dark",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      headerFontSize: "medium",
      lineWidth: 2,
      lineType: 0,
      dateRanges: [
        "1d|1",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M",
      ],
      backgroundColor:
        resolvedTheme === "light" ? "#ffffff" : "#0a0a0a",
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
          <span className="blue-text">
            Track all markets on TradingView
          </span>
        </a>
      </div>
    </div>
  );
};

export default memo(SymbolOverviewWidget);
