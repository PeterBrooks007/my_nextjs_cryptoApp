"use client";

import { memo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const TickerTapeWidget = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget (important when theme changes)
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";

    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
      ],
      showSymbolLogo: true,
      //   isTransparent: true,
      displayMode: "",
      colorTheme: resolvedTheme === "dark" ? "dark" : "light",
      locale: "en",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [resolvedTheme]);

  return (
    <div className="w-full h-full">
      <div
        ref={containerRef}
        className="tradingview-widget-container w-full h-full"
      >
        <div className="tradingview-widget-container__widget w-full h-full" />
      </div>
    </div>
  );
};

export default memo(TickerTapeWidget);
