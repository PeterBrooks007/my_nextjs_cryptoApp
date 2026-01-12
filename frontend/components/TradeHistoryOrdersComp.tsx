"use client";

import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { MoreHorizontal, ImageIcon, Trash2, XCircle } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useAuth";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { Spinner } from "./ui/spinner";
import { AutoTradeUpdateInAdminPayloadType, TradeHistoryType } from "@/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import EditTradeOrder from "./EditTradeOrder";
import ApproveTradeOrder from "./ApproveTradeOrder";

export interface CountdownTimerProps {
  createdAt: string;
  expireTime: number;
  onExpire: (expired: boolean) => void;
  trades?: TradeHistoryType | null;
  autoTradeUpdateInUser: (
    id: string | undefined,
    formData: AutoTradeUpdateInAdminPayloadType
  ) => void;
}

export function CountdownTimer({
  createdAt,
  expireTime,
  onExpire,
  trades,
  autoTradeUpdateInUser,
}: CountdownTimerProps) {
  const { data: user } = useCurrentUser();
  const id = user?._id as string;

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isExpired, setIsExpired] = useState(false);

  // -----------------------------------------
  // 🎯 Move all heavy logic into stable function
  // -----------------------------------------
  const handleTradeProcess = useCallback(() => {
    const userId = user?.role === "admin" ? id : user?._id;

    // OUTCOME
    let outcomes;
    if (user?.role !== "admin" && user?.autoTradeSettings?.type === "Random") {
      outcomes = ["Won", "Lose"];
    } else if (
      user?.role !== "admin" &&
      user?.autoTradeSettings?.type === "Always_Win"
    ) {
      outcomes = ["Won", "Won"];
    } else {
      outcomes = ["Lose", "Lose"];
    }

    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    // WINRATE LOGIC
    let winrate;
    if (user?.autoTradeSettings?.winLoseValue === "Ten") {
      winrate = Math.floor(Math.random() * 100);
    } else if (user?.autoTradeSettings?.winLoseValue === "Hundred") {
      winrate = Math.floor(Math.random() * 900) + 100;
    } else if (user?.autoTradeSettings?.winLoseValue === "Thousand") {
      winrate = Math.floor(Math.random() * 9000) + 1000;
    } else if (user?.autoTradeSettings?.winLoseValue === "Random") {
      winrate = Math.floor(Math.random() * 10000000);
    } else {
      winrate = Math.floor(Math.random() * 9000000) + 1000000;
    }

    // AUTOTRADE USER
    if (
      user?.role !== "admin" &&
      user?.autoTradeSettings?.isAutoTradeActivated &&
      trades?.status === "PENDING" &&
      trades?.tradeFrom !== "admin" &&
      trades?.isProcessed === false
    ) {
      const formData = {
        userId,
        tradeData: {
          tradeId: trades?._id,
          exchangeType: trades?.exchangeType,
          exchangeTypeIcon: trades?.exchangeTypeIcon,
          symbols: trades?.symbols || "",
          type: trades?.type || "",
          buyOrSell: trades?.buyOrSell || "",
          price: trades?.price || "",
          ticks: trades?.ticks || "",
          units: trades?.units || "",
          risk: trades?.risk || "",
          riskPercentage: trades?.riskPercentage ?? "",
          expireTime: "-30",
          amount: trades?.amount ?? "",
          open: "90000",
          close: "90100",
          longOrShortUnit: "25X",
          roi: "100%",
          profitOrLossAmount:
            randomOutcome === "Lose" ? trades?.amount : winrate,
          status: randomOutcome,
          tradingMode: trades?.tradingMode,
          tradeFrom: trades?.tradeFrom,
          createdAt: trades?.createdAt,
          isProcessed: true,
        },
      };
      autoTradeUpdateInUser(userId, formData);
      return;
    }

    // ADMIN PROCESS
    if (trades?.tradeFrom === "admin" && trades?.isProcessed === false) {
      const formData = {
        userId,
        tradeData: {
          tradeId: trades?._id,
          exchangeType: trades?.exchangeType,
          exchangeTypeIcon: trades?.exchangeTypeIcon,
          symbols: trades?.symbols || "",
          type: trades?.type || "",
          buyOrSell: trades?.buyOrSell || "",
          price: trades?.price || "",
          ticks: trades?.ticks || "",
          units: trades?.units || "",
          risk: trades?.risk || "",
          riskPercentage: trades?.riskPercentage ?? "",
          expireTime: "-30",
          amount: trades?.amount ?? "",
          open: trades?.open,
          close: trades?.close,
          longOrShortUnit: trades?.longOrShortUnit,
          roi: trades?.roi,
          profitOrLossAmount:
            trades?.status === "Lose"
              ? trades?.amount
              : trades?.profitOrLossAmount,
          status: trades?.status,
          tradingMode: trades?.tradingMode,
          tradeFrom: trades?.tradeFrom,
          createdAt: trades?.createdAt,
          isProcessed: true,
        },
      };

      console.log({ userId, formData });
    }
  }, [user, id, trades, autoTradeUpdateInUser]);

  //  TIMER EFFECT — STABLE, NO DEPENDENCY ERROR
  useEffect(() => {
    const countdownEndTime =
      new Date(createdAt).getTime() + expireTime * 60 * 1000;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeDiff = countdownEndTime - currentTime;

      if (timeDiff > 0) {
        setTimeLeft({
          hours: Math.floor(timeDiff / (1000 * 60 * 60)),
          minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
        });
        return;
      }

      // TIMER EXPIRED
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      setIsExpired(true);

      onExpire(true);
      handleTradeProcess();

      clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, expireTime, onExpire, handleTradeProcess]);

  if (isExpired) {
    return <p className="text-red-500 font-semibold">Expired</p>;
  }

  return (
    <p
      className={`font-semibold ${
        timeLeft.minutes <= 5 && timeLeft.hours === 0
          ? "text-green-500"
          : "text-green-500"
      }`}
    >
      {timeLeft.hours > 0 ? `${timeLeft.hours}:` : ""}
      {timeLeft.minutes < 10 && timeLeft.hours > 0
        ? `0${timeLeft.minutes}`
        : timeLeft.minutes}
      :{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
    </p>
  );
}

// Main Component (Clean UI Only)
const TradeHistoryOrdersComp = ({
  allTradeFiltered,
}: {
  allTradeFiltered: TradeHistoryType[];
}) => {
  const { data: user } = useCurrentUser();
  const id = user?._id as string;

  const {
    autoTradeUpdateInUser,
    isAutoTradeUpdateInUserLoading,
    cancelTradeHistory,
    isCancelingTradeHistory,
    deleteTradeHistory,
    isDeletingTradeHistorysHistory,
  } = useTradeHistory(user?._id);

  const [selectedTrade, setSelectedTrade] = useState<TradeHistoryType | null>(
    null
  );

  allTradeFiltered = Array.isArray(allTradeFiltered)
    ? [...allTradeFiltered].sort(
        (a, b) =>
          Number(new Date(b?.createdAt || 0)) -
          Number(new Date(a?.createdAt || 0))
      )
    : [];

  const [openApproveSheet, setOpenApproveSheet] = useState(false);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openScreenshotDialog, setOpenScreenshotDialog] = useState(false);

  const [expiredTrades, setExpiredTrades] = useState<Record<string, boolean>>(
    {}
  );
  const handleExpire = (tradeId: string) => {
    setExpiredTrades((prev) => ({ ...prev, [tradeId]: true }));
  };

  // handleCancelTrade
  const handleCancelTrade = async () => {
    const formData = {
      userId: id,
      tradeData: {
        tradeId: selectedTrade?._id,
        tradeAmount: selectedTrade?.amount,
        tradingMode: selectedTrade?.tradingMode,
      },
    };

    //  console.log(formData);

    await cancelTradeHistory(id, formData);
    setOpenCancelDialog(false);
  };

  // handleDeleteTrade
  const handleDeleteTrade = async () => {
    const formData = {
      userId: id,
      tradeData: {
        tradeId: selectedTrade?._id,
      },
    };

    // console.log(formData);

    await deleteTradeHistory(id, formData);
    setOpenDeleteDialog(false);
  };

  if (
    isAutoTradeUpdateInUserLoading ||
    isDeletingTradeHistorysHistory ||
    isCancelingTradeHistory
  ) {
    return (
      <div className="flex justify-center mt-5">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 space-y-4">
        {allTradeFiltered.length > 0 ? (
          allTradeFiltered.map((trade) => (
            <Fragment key={trade._id}>
              {/* Top row */}
              <div className="flex items-center justify-between">
                {/* Icon + Name */}
                <div className="flex items-center gap-1 py-1 px-2 border rounded-md border-green-500/70">
                  <div className="w-6 h-6 relative">
                    <Image
                      src={trade.exchangeTypeIcon}
                      alt={trade.exchangeType}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <span className="text-base font-semibold">
                    {trade.exchangeType}: {trade.symbols}
                  </span>
                </div>

                {/* Right side icons */}
                <div className="flex items-center gap-1">
                  {/* Mode Badge */}
                  <div
                    className={cn(
                      "px-2 font-semibold py-0 rounded-md border text-sm",
                      trade.tradingMode.toLowerCase() === "live"
                        ? "border-green-500 text-green-500"
                        : "border-red-500 text-red-500"
                    )}
                  >
                    {trade.tradingMode}
                  </div>

                  {/* Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 flex items-center justify-center">
                        <MoreHorizontal size={20} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {/* {trade?.isProcessed === false &&
                        trade?.tradeFrom === "user" && (
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedTrade(trade);
                              setOpenApproveSheet(true);
                            }}
                          >
                            <CheckCircle size={16} />
                            <span className="ml-2">Approve Order</span>
                          </DropdownMenuItem>
                        )} */}

                      {!trade.isProcessed && (
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedTrade(trade);
                            setOpenCancelDialog(true);
                          }}
                        >
                          <XCircle size={16} />
                          <span className="ml-0">Cancel Order</span>
                        </DropdownMenuItem>
                      )}

                      {/* {trade.isProcessed && (
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedTrade(trade);
                            setOpenEditSheet(true);
                          }}
                        >
                          <Edit size={16} />
                          <span className="ml-2">Edit Order</span>
                        </DropdownMenuItem>
                      )} */}
                      {trade.isProcessed && (
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedTrade(trade);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <Trash2 size={16} />
                          <span className="ml-0">Delete Order</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant={"ghost"}
                    className="w-8 h-8 flex items-center justify-center"
                    disabled={
                      trade?.isProcessed === false ||
                      trade?.status === "PENDING"
                    }
                    onClick={() => {
                      setSelectedTrade(trade);
                      setOpenScreenshotDialog(true);
                    }}
                  >
                    <ImageIcon className="size-5" />
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="w-[50%] -mt-2 space-y-0">
                <div className="flex justify-between">
                  <span className="semibold">Side</span>
                  <span
                    className={cn(
                      "font-semibold",
                      trade.buyOrSell === "Buy"
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {trade.buyOrSell}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Type</span>
                  <span>{trade.type}</span>
                </div>

                <div className="flex justify-between">
                  <span>Price</span>
                  <span>{trade.price}</span>
                </div>

                <div className="flex justify-between">
                  <span>Qty</span>
                  <span>{trade.units}</span>
                </div>

                <div className="flex justify-between">
                  <span>
                    {expiredTrades[trade?._id] ? "Status" : "Expire Time"}
                  </span>

                  {!expiredTrades[trade?._id] ? (
                    <CountdownTimer
                      createdAt={trade?.createdAt}
                      expireTime={trade?.expireTime}
                      onExpire={() => handleExpire(trade?._id)}
                      trades={trade}
                      autoTradeUpdateInUser={autoTradeUpdateInUser}
                    />
                  ) : (
                    <span
                      className={cn(
                        "font-semibold",
                        trade.status === "Won"
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {trade.status}
                    </span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Amt</span>
                  <span
                    className={cn(
                      "font-semibold",
                      !expiredTrades[trade?._id]
                        ? "text-[orange]" // orange
                        : trade?.status?.toLowerCase() === "won"
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {!expiredTrades[trade?._id] || trade?.status === "PENDING"
                      ? "PENDING"
                      : Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation:
                            trade.profitOrLossAmount > 999999
                              ? "compact"
                              : undefined,
                        }).format(trade.profitOrLossAmount)}
                  </span>
                </div>
              </div>

              <Separator />
            </Fragment>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle size={40} />
            <h3 className="text-lg font-semibold mt-2">No Data Available</h3>
          </div>
        )}
      </div>

      {/* Cancel Trade Dialog */}
      <Dialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Cancel this Trade{" "}
              {selectedTrade?.exchangeType + ": " + selectedTrade?.symbols}??
            </DialogTitle>
          </DialogHeader>

          <p className="mt-2">This action cannot be undone.</p>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setOpenCancelDialog(false)}>
              Close
            </Button>
            <Button
              className="bg-green-600 text-white"
              onClick={handleCancelTrade}
            >
              Cancel Trade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*Approve Sheet  */}
      <Sheet open={openApproveSheet} onOpenChange={setOpenApproveSheet}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Approve Trade Order</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-4">
              <ApproveTradeOrder selectedTrade={selectedTrade} />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/*Edit Sheet  */}
      <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Edit Trade History</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-4">
              <EditTradeOrder selectedTrade={selectedTrade} />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete this Trade{" "}
              {selectedTrade?.exchangeType + ": " + selectedTrade?.symbols}?
            </DialogTitle>
          </DialogHeader>

          <p className="mt-2">This action cannot be undone.</p>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setOpenDeleteDialog(false)}>
              Close
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={handleDeleteTrade}
            >
              Delete Trade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Screenshot Dialog */}
      <Dialog
        open={openScreenshotDialog}
        onOpenChange={setOpenScreenshotDialog}
      >
        <DialogContent className="sm:max-w-112.5 h-112.5 sm:h-125 max-h-[90%] overflow-auto p-0 bg-secondary">
          <VisuallyHidden>
            <DialogTitle>Hidden Title</DialogTitle>
          </VisuallyHidden>

          <div className="relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[#030516] bg-cover bg-center bg-no-repeat z-1" />

            {/* Content */}
            <div className="relative z-2 p-4">
              <Image src={"/logo.png"} alt="logo" width={180} height={45} />

              <p className="text-white mt-12 sm:mt-15 text-[22px]">
                Unrealized PnL
              </p>

              <div className="flex justify-start items-center mt-1">
                <p className="text-white text-[22px] font-semibold border-r border-gray-500 mr-5 pr-5">
                  {selectedTrade?.symbols}
                </p>

                <p
                  className={cn(
                    "text-[20px] font-semibold border-r border-gray-500 mr-5 pr-5",
                    selectedTrade?.buyOrSell === "Long"
                      ? "text-green-400"
                      : "text-red-500"
                  )}
                >
                  {selectedTrade?.buyOrSell}
                </p>

                <p className="text-white text-[20px] font-semibold">
                  {selectedTrade?.units} units
                </p>
              </div>

              <p className="text-green-400 mt-1 text-[48px] font-semibold">
                {selectedTrade?.roi}
              </p>

              <div className="flex items-center mt-1 gap-1">
                <p className="text-gray-400 text-[16px] font-medium">
                  Last Price
                </p>
                <p className="text-white text-[16px] font-medium">
                  {selectedTrade?.open}
                </p>
              </div>

              <div className="flex items-center gap-1 mt-1.5">
                <p className="text-gray-400 text-[16px] font-medium">
                  Avg. Open Price
                </p>
                <p className="text-white text-[16px] font-medium">
                  {selectedTrade?.close}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(TradeHistoryOrdersComp);
