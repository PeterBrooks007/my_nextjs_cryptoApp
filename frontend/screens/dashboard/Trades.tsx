"use client";

import {
  Home,
  Bell,
  History,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Crop,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";

import { useCurrentUser } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
import AdvanceChartWidget from "@/components/TradeviewWidgets/AdvanceChartWidget";
import Trade from "@/components/Trade";
import TradeTable from "@/components/TradeTable";
import { Spinner } from "@/components/ui/spinner";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import { Separator } from "@/components/ui/separator";
import MarketNewsWidgets from "@/components/TradeviewWidgets/MarketNewsWidgets";
import Watchlistmarketdata from "@/components/TradeviewWidgets/Watchlistmarketdata";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import TradeTable2 from "@/components/TradeTable2";
import { useTradingModeStore } from "@/store/tradingModeStore";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import TradeHistory from "@/components/TradeHistory";
import AllUserNotifications from "@/components/AllUserNotifications";

/* ================= MOCK / PROPS ================= */

const TradeLoading = false;

const Trades = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const { data: user } = useCurrentUser();
  const {
    allUserTradeHistories,
    isLoading: tradeHistoryLoading,
    // error,
  } = useTradeHistory(user?._id);
  const [openTradeHistory, setOpenTradeHistory] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const allTradeFiltered = Array.isArray(allUserTradeHistories?.trades)
    ? [...allUserTradeHistories.trades]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 5)
    : [];

  const { tradingMode } = useTradingModeStore();
  const { isLoading, newNotifications } = useTotalCounts();

  const size = useWindowSize();
  const isMobileShortscreen = size.width && size.width < 600;

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  if (pageLoading || !user || tradeHistoryLoading) {
    return (
      <div className="flex w-full  px-4 justify-center mt-4">
        <Skeleton className="w-full h-5" />
      </div>
    );
  }
  return (
    <div
      className="
        flex w-full overflow-hidden
        rounded-none md:rounded-xl
        bg-mute
      "
      style={{
        height: isMobileShortscreen
          ? "calc(100vh - 4px)"
          : "calc(100vh - 36px)",
      }}
    >
      {/* ================= LEFT / ADVANCECHART ================= */}
      <div className="relative flex-1 w-full sm:w-[60%]  lg:w-[75%] 2xl:w-[60%]">
        {/* ===== CHART ===== */}
        <div
          className={cn(
            "relative w-full",
            isMobileShortscreen
              ? "h-[calc(100%-150px)]"
              : "h-[calc(100%-153px)]",
            "sm:h-[60%]"
          )}
        >
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <AdvanceChartWidget tradingpage={"true"} />
          </div>

          {/* ===== ON MOBILE FLOATING BUY / SELL ===== */}
          <div className="absolute top-30 left-16.25 flex gap-2 md:hidden">
            <Button
              size="sm"
              disabled={TradeLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {TradeLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Buy"
              )}
            </Button>

            <Button
              size="sm"
              disabled={TradeLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {TradeLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sell"
              )}
            </Button>
          </div>
        </div>

        {/* ===== ON MOBILE ACCOUNT BAR / MENU BAR ===== */}
        <div className="flex sm:hidden justify-between items-center bg-muted/70 p-2 border pl-4">
          <div className="flex flex-col text-sm xs:text-base leading-6.5">
            <span>
              Account:
              <span
                className={cn(
                  "ml-1 font-semibold",
                  tradingMode === "Live" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {tradingMode}{" "}
              </span>
              Account
            </span>

            <span>
              Balance:{" "}
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: user.currency.code,
              }).format(
                tradingMode === "Live" ? user.balance : user.demoBalance
              )}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-0.5 items-center cursor-pointer">
              <Link href={"/dashboard"}>
                <Button variant={"outline"} size={"icon-lg"} className="">
                  <Home className="size-6" />
                </Button>
                <p className="text-xs">Home</p>
              </Link>
            </div>
            <div className="flex flex-col gap-0.5 items-center">
              <Button
                variant={"outline"}
                size={"icon-lg"}
                className="cursor-pointer"
                onClick={() => setOpenTradeHistory(true)}
              >
                <History className="size-6" />
              </Button>
              <p className="text-xs">History</p>
            </div>
            <div className="relative flex flex-col gap-0.5 items-center">
              <Button
                variant={"outline"}
                size={"icon-lg"}
                className="cursor-pointer"
                onClick={() => setOpenNotifications(true)}
              >
                <Bell className="size-6" />
              </Button>
              <p className="text-xs">Notices</p>

              {/* Badge */}
              <Badge
                className="absolute -top-1.5 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums opacity-100 bg-blue-600 text-white pointer-events-none "
                // variant="destructive"
              >
                {isLoading ? (
                  <Spinner />
                ) : newNotifications > 100 ? (
                  "99+"
                ) : (
                  newNotifications
                )}
              </Badge>
            </div>
          </div>
        </div>

        {/* ===== ON MOBILE BUY / SELL FULL WIDTH ===== */}
        <div className="flex sm:hidden gap-3 p-3 border bg-muted/70">
          <Button
            disabled={TradeLoading}
            className="flex-1 bg-green-500 hover:bg-green-700 text-white text-xl py-6 "
          >
            {TradeLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "Buy"
            )}
          </Button>

          <Button
            disabled={TradeLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xl py-6"
          >
            {TradeLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "Sell"
            )}
          </Button>
        </div>

        {/* ===== ON DESKTOP ACCOUNT HEADER ===== */}
        <div className="hidden sm:block  py-2">
          <div className="flex justify-between px-5 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-500">Account Manager</span>
              <Button size="sm" className="h-6">
                All Trades
              </Button>
            </div>

            <div className="flex justify-center gap-4">
              <Button size="icon" variant="ghost">
                <ChevronUp className="size-7" />
              </Button>
              <Button size="icon" variant="ghost">
                <Crop className="size-6" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between mt-2 px-5 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              Account:
              <span
                className={`font-medium text-emerald-500 ${
                  tradingMode === "Live" ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {tradingMode}
              </span>
              Account
              <Button size="icon" variant="ghost">
                <MoreHorizontal />
              </Button>
            </div>

            <div className="text-sm text-right">
              <div>Balance</div>
              <div className="font-medium">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: user?.currency?.code || "USD",
                  notation:
                    (tradingMode.toLowerCase() === "live"
                      ? user?.balance ?? 0
                      : user?.demoBalance ?? 0) > 999999
                      ? "compact"
                      : "standard",
                }).format(
                  tradingMode.toLowerCase() === "live"
                    ? user?.balance ?? 0
                    : user?.demoBalance ?? 0
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="hidden sm:block px-4 py-3 ">
          <Tabs defaultValue="orders">
            <TabsList className="bg-transparent">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="position">Position</TabsTrigger>
              <TabsTrigger value="summary">Account Summary</TabsTrigger>
              <TabsTrigger value="notifications">Notification log</TabsTrigger>
            </TabsList>

            <Separator />

            <TabsContent value="orders">
              <div className="text-sm border pb-20 mt-2 w-0 min-w-full overflow-hidden overflow-y-auto h-50">
                <TradeTable allUserTradeHistories={allTradeFiltered} />
              </div>
            </TabsContent>

            <TabsContent value="position">Nothing found</TabsContent>
            <TabsContent value="summary">Nothing found</TabsContent>
            <TabsContent value="notifications">Nothing found</TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ================= MIDDLE - TRADE SECTION ================= */}
      {size.width && size.width >= 640 && (
        <div className="hidden sm:block border-l px-4 py-2 w-full sm:w-[40%] lg:w-[25%] 2xl:w-[20%]">
          <div className="h-full">
            <Trade isQuickTrade={false} type={tradingMode} />
          </div>
        </div>
      )}

      {/* ================= RIGHT - WATCHLIST / NEWS ================= */}
      {size.width && size.width >= 1024 && (
        <div className="hidden lg:block  border-l lg:w-[25%] 2xl:w-[20%]">
          <div className="h-[40%] border-b overflow-hidden">
            <div className="flex justify-between items-center mb-2 p-4">
              <span className="text-sm font-medium flex items-center gap-1">
                Watchlist <ChevronDown size={16} />
              </span>
              <X size={18} />
            </div>
            <div className="text-xs w-full h-full mt-2">
              <div className="-m-0.5 h-full pb-15">
                <Watchlistmarketdata />
              </div>
            </div>
          </div>

          <div className="h-[30%] border-b p-2 overflow-hidden">
            <div className="flex justify-between items-center mb-2 px-2 ">
              <span className="text-sm font-medium">Trading History</span>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setOpenTradeHistory(true)}
              >
                View All
              </Button>
            </div>
            <div className="h-full  border-t">
              <TradeTable2 allUserTradeHistories={allTradeFiltered} />
            </div>
          </div>

          <div className="h-[30%] text-xs overflow-hidden">
            <div className="-m-0.5 h-full">
              <MarketNewsWidgets />
            </div>
          </div>
        </div>
      )}

      {/* Trade History */}
      <Sheet open={openTradeHistory} onOpenChange={setOpenTradeHistory}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Trade History</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-0">
              <TradeHistory type={tradingMode} />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* All Notification Drawer Sheet */}
      <Sheet open={openNotifications} onOpenChange={setOpenNotifications}>
        <SheetContent className="w-full data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">All Notification</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto -mt-4 -mb-2 ">
            <AllUserNotifications showAllNotification={true} />
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Trades;
