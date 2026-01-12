import React, { Activity, memo, useState } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import useWindowSize from "@/hooks/useWindowSize";
import CryptoTrending from "./CryptoTrending";
import { Separator } from "./ui/separator";
import MiniSymbolOverviewWidget from "./TradeviewWidgets/MiniSymbolOverviewWidget ";
import MarketNewsWidgets from "./TradeviewWidgets/MarketNewsWidgets";

const CryptoTrendingSection = () => {
  const size = useWindowSize();
  const [tabIndex, setTabIndex] = useState("TOP CRYPTO");

  const items = ["TOP CRYPTO", "STOCKS", "FOREX", "CRYPTO NEWS"];

  return (
    <div className="space-y-1.5">
      <ScrollArea
        className="pb-2"
        style={{
          width: size.width && size.width < 500 ? size.width - 60 : "100%",
        }}
      >
        <div className="flex gap-1 whitespace-nowrap">
          <div className="flex gap-2 w-max px-1 py-0">
            {items.map((item) => {
              const active = item === tabIndex;

              return (
                <button
                  key={item}
                  onClick={() => setTabIndex(item)}
                  className={`
                    px-2 py-1.25 rounded-lg text-sm font-medium
                    transition-all cursor-pointer
                    ${
                      active
                        ? "bg-secondary border text-whit font-bold"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Separator />

      {/*Top Crypto */}
      <Activity mode={tabIndex === "TOP CRYPTO" ? "visible" : "hidden"}>
        <CryptoTrending />
      </Activity>

      {/* Stocks */}
      <Activity mode={tabIndex === "STOCKS" ? "visible" : "hidden"}>
        <ScrollArea className="overflow-y-auto px-4 -mx-4">
          <div className="grid grid-cols-2 gap-2 h-76 pt-2 ">
            <div className="h-full border rounded-md">
              <MiniSymbolOverviewWidget symbol={"NASDAQ:TSLA"} />
            </div>
            <div className="h-full border rounded-md">
              <MiniSymbolOverviewWidget symbol={"NASDAQ:AAPL"} />
            </div>
            <div className="h-full border rounded-md">
              <MiniSymbolOverviewWidget symbol={"NASDAQ:NVDA"} />
            </div>
            <div className="h-full border rounded-md">
              <MiniSymbolOverviewWidget symbol={"NASDAQ:META"} />
            </div>
          </div>
        </ScrollArea>
      </Activity>

      {/* Forex */}
      <Activity mode={tabIndex === "FOREX" ? "visible" : "hidden"}>
        <ScrollArea className="overflow-y-auto px-4 -mx-4">
          <div className="grid grid-cols-2 gap-2 h-76 pt-2 ">
            <div className="h-full border rounded-md">
              <MiniSymbolOverviewWidget symbol={"FX:EURUSD"} />
            </div>
            <div className="h-full border rounded-md">
              <MiniSymbolOverviewWidget symbol={"FX:GBPUSD"} />
            </div>
            <div className="h-full border rounded-md">
              <MiniSymbolOverviewWidget symbol={"FX:EURJPY"} />
            </div>
            <div className="h-full border rounded-md">
              <MiniSymbolOverviewWidget symbol={"FX:GBPJPY"} />
            </div>
          </div>
        </ScrollArea>
      </Activity>

      {/* Crypto News */}
      <Activity mode={tabIndex === "CRYPTO NEWS" ? "visible" : "hidden"}>
        <div className="grid h-76 pt-2 rounded-md overflow-hidden">
          <MarketNewsWidgets />
        </div>
      </Activity>
    </div>
  );
};

export default memo(CryptoTrendingSection);
