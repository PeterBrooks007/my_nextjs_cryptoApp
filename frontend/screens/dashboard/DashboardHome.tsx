"use client";

import React, { useEffect, useState } from "react";

import AdvanceChartWidget from "@/components/TradeviewWidgets/AdvanceChartWidget";
import TickerTapeWidget from "@/components/TradeviewWidgets/TickerTapeWidget";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartCandlestick } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Trade from "@/components/Trade";
import CryptoTrendingSection from "@/components/CryptoTrendingSection";
import MarketNewsWidgets from "@/components/TradeviewWidgets/MarketNewsWidgets";
import TradingHistorySection from "@/components/TradingHistorySection";
import TradeHistoryChartSection from "@/components/TradeHistoryChartSection";
import Welcome from "@/components/Welcome";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAuth";

// const CryptoTrendingSection = dynamic(
//   () => import("@/components/CryptoTrendingSection"),
//   {
//     ssr: false,
//     loading: () => <Loader />,
//   }
// );

const DashboardHome = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const { data: user } = useCurrentUser();

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  if (pageLoading || !user) {
    return (
      <div className="flex w-full  px-4 justify-center mt-4">
        <Skeleton className="w-full h-5" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-5 mx-3 xl:mx-5 mb-5">
      {/* TickerTapeWidget */}
      <div className="-mx-6 -mt-1 overflow-hidden">
        <TickerTapeWidget />
      </div>

      {/* Welcome and crypto trending */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 -mt-2 xl:mt-0">
        <Card
          className="col-span-12 xl:col-span-8 2xl:col-span-9 border-0 bg-transparent shadow-none rounded-none xl:border xl:bg-card xl:shadow-sm xl:rounded-xl
          min-h-95 h-auto xl:h-102 p-0 xl:p-4"
        >
          <Welcome />
        </Card>
        <Card className="col-span-12 xl:col-span-4 2xl:col-span-3 min-h-95 h-102 p-4 rounded-xl">
          <CryptoTrendingSection />
        </Card>
      </div>

      {/* Market Overview and quick trade */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Card className="col-span-12 xl:col-span-8 2xl:col-span-9 rounded-xl overflow-hidden p-4 gap-5 min-h-50 sm:min-h-137.5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-base sm:text-xl font-semibold">
                Market Overview
              </h1>
              <p className="text-xs sm:text-sm">Pictorial monthly analytics</p>
            </div>

            <Button variant={"outline"}>
              <ChartCandlestick className="hidden sm:flex" /> Trade Section
            </Button>
          </div>
          <div className="min-h-100 sm:min-h-137 h-100 sm:h-full -mx-2">
            <AdvanceChartWidget />
          </div>
        </Card>
        <Card className="hidden xl:flex col-span-12 xl:col-span-4 2xl:col-span-3 min-h-137.5 rounded-xl p-4 gap-4 ">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-base sm:text-xl font-semibold">
                Quick Trade
              </h1>
              <p className="text-xs sm:text-sm">place a quick trade</p>
            </div>

            <div className="flex flex-col items-end">
              <h1 className="text-base font-semibold">Balance</h1>
              <p className="text-base">$12,000,000</p>
            </div>
          </div>

          <Separator />

          <Trade isQuickTrade={true} type={"Live"} />
        </Card>
      </div>

      {/* TradeHistory and TradeHistoryChart */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Card className="col-span-12 xl:col-span-4 2xl:col-span-3 rounded-xl overflow-hidden gap-4 p-4 min-h-125 h-112.5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-base sm:text-xl font-semibold">
                Trading History
              </h1>
              <p className="text-xs sm:text-sm">Last 5 trading history</p>
            </div>

            <Button variant={"outline"} size={"sm"}>
              View All
            </Button>
          </div>

          <TradingHistorySection />
        </Card>
        <Card className="hidden sm:block col-span-12 xl:col-span-8 2xl:col-span-9 p-4 rounded-xl min-h-112.5 h-125">
          <div>
            <h1 className="text-base sm:text-xl font-semibold">
              Trade History Chart
            </h1>
            <p className="text-xs sm:text-sm">
              Pictorial View of your trade history
            </p>
          </div>

          <TradeHistoryChartSection />
        </Card>
      </div>

      {/* Tradeview News */}
      <Card className="h-125 min-h-125 p-0 rounded-xl overflow-hidden">
        <MarketNewsWidgets />
      </Card>
    </div>
  );
};

export default DashboardHome;
