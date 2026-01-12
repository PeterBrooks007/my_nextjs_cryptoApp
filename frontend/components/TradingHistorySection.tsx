import { useCurrentUser } from "@/hooks/useAuth";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { ArrowRight, XCircle } from "lucide-react";

const TradingHistorySection = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const { data: user } = useCurrentUser();

  const { allUserTradeHistories, isLoading, isRefetching } = useTradeHistory(
    user?._id || ""
  );

  const allTradeFiltered = Array.isArray(allUserTradeHistories.trades)
    ? [...allUserTradeHistories.trades]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
    : [];

  if (pageLoading || isLoading || isRefetching) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  if (!allUserTradeHistories || allUserTradeHistories.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center gap-2 text-center">
        <XCircle className="h-14 w-14 text-muted-foreground" />
        <p className="text-base sm:text-lg font-semibold">NO TRADE AVAILABLE</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allTradeFiltered.map((trade) => {
        const isWon = trade.status === "Won";
        const borderColor = isWon ? "border-x-green-600 " : "border-x-red-600";
        const textColor = isWon ? "text-green-600" : "text-red-600";

        return (
          <div
            key={trade._id}
            className={`
              flex items-center justify-between rounded-xl
              border-t border-b border-gray-300
              border-l-2 border-r-2 ${borderColor}
              px-3 py-2
            `}
          >
            {/* LEFT */}
            <div className="flex flex-col gap-1">
              {/* Symbol + Buy/Sell */}
              <div className="flex items-center gap-2">
                <p className="text-sm sm:font-medium">{trade.symbols}</p>

                <p
                  className={`text-xs ${
                    trade.buyOrSell === "Buy"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {trade.buyOrSell}, {trade.units}{" "}
                  {trade.units === 1 ? "unit" : "units"}
                </p>
              </div>

              {/* Open → Close */}
              <div className="flex items-center gap-2 text-sm">
                <span>{trade.open}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span>{trade.close}</span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-1 text-right">
              <p className="text-sm">
                {new Date(trade.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <p className={`text-sm font-bold ${textColor}`}>
                {trade.status === "PENDING"
                  ? "PENDING"
                  : `${trade.status === "Lose" ? "-" : ""}${Intl.NumberFormat(
                      "en-US",
                      {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(trade.profitOrLossAmount > 999_999
                          ? { notation: "compact" }
                          : {}),
                      }
                    ).format(trade.profitOrLossAmount)}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TradingHistorySection;
