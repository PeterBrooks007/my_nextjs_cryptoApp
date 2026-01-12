import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { XCircle, Trash } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";
import { CountdownTimer } from "./TradeHistoryOrdersComp";
import { TradeHistoryType } from "@/types";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { Spinner } from "./ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const TradeTable = ({
  allUserTradeHistories,
}: {
  allUserTradeHistories: TradeHistoryType[];
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

  // console.log(allUserTradeHistories);

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [expiredTrades, setExpiredTrades] = useState<Record<string, boolean>>(
    {}
  );

  const handleExpire = (tradeId: string) => {
    setExpiredTrades((prev) => ({ ...prev, [tradeId]: true }));
  };

  const [selectedTrade, setSelectedTrade] = useState<TradeHistoryType | null>(
    null
  );

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
    <div className="relative rounded-t-md overflow-hidden">
      <Table>
        <TableHeader className="bg-green-500 text-white">
          <TableRow>
            <TableHead>Symbols</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allUserTradeHistories.length > 0 ? (
            allUserTradeHistories.map((trade) => {
              const isBuy = trade.buyOrSell === "Buy";
              const isWon = trade.status?.toLowerCase() === "won";
              const isExpired = expiredTrades[trade._id];

              return (
                <TableRow key={trade._id}>
                  {/* SYMBOL */}
                  <TableCell>
                    <Badge
                      className={`rounded-full px-3 py-1 font-bold text-white ${
                        isBuy
                          ? "bg-emerald-600 dark:bg-emerald-400"
                          : "bg-red-600"
                      }`}
                    >
                      {trade.symbols}
                    </Badge>
                  </TableCell>

                  {/* SIDE */}
                  <TableCell
                    className={`font-bold ${
                      isBuy
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600"
                    }`}
                  >
                    {trade.buyOrSell}
                  </TableCell>

                  {/* TYPE */}
                  <TableCell>{trade.type}</TableCell>

                  {/* PRICE */}
                  <TableCell>{trade.price}</TableCell>

                  {/* QTY */}
                  <TableCell>{trade.units}</TableCell>

                  {/* AMOUNT / PROFIT */}
                  <TableCell
                    className={`font-semibold ${
                      !isExpired
                        ? "text-orange-500"
                        : isWon
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600"
                    }`}
                  >
                    {!isExpired || trade.status === "PENDING"
                      ? "PENDING"
                      : Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(trade.profitOrLossAmount > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(trade.profitOrLossAmount)}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell
                    className={`font-semibold ${
                      isWon
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600"
                    }`}
                  >
                    {isExpired ? (
                      trade.status
                    ) : (
                      <CountdownTimer
                        createdAt={trade.createdAt}
                        expireTime={trade.expireTime}
                        trades={trade}
                        onExpire={() => handleExpire(trade._id)}
                        autoTradeUpdateInUser={autoTradeUpdateInUser}
                      />
                    )}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!trade.isProcessed && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-lg"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedTrade(trade);
                                  setOpenCancelDialog(true);
                                }}
                              >
                                <XCircle className="h-5! w-5! text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cancel Trade</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {trade.isProcessed && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-lg"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedTrade(trade);
                                  setOpenDeleteDialog(true);
                                }}
                              >
                                <Trash className="h-5! w-5! text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Trade</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-6 text-center text-muted-foreground"
              >
                No trade available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
    </div>
  );
};

export default TradeTable;
