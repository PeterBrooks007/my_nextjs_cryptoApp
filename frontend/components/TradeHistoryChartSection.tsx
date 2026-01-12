import { useCurrentUser } from "@/hooks/useAuth";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { XCircle } from "lucide-react";
import LineChartdashboard from "./charts/LineChart";

const TradeHistoryChartSection = () => {
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
        <p className="text-base sm:text-lg font-semibold">
          TRADES MUST BE UP TO THREE TO SEE CHART
        </p>
      </div>
    );
  }

  const allTradeFiltered = Array.isArray(allUserTradeHistories.trades)
    ? [...allUserTradeHistories.trades]
    : [];

  return (
    <div className="mt-2 h-100 overflow-hidden">
      {allTradeFiltered.length > 2 ? (
        <LineChartdashboard
          dataPricePercentage={0}
          data={allTradeFiltered.map((trade) => ({
            name: new Date(trade.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            }),
            value: Number(trade.profitOrLossAmount),
          }))}
        />
      ) : (
        <div className="mt-4 flex flex-col items-center justify-center gap-2 text-center">
          <XCircle className="h-14 w-14 text-muted-foreground" />
          <p className="text-base sma:text-lg font-semibold">
            TRADES MUST BE UP TO THREE TO SEE CHART
          </p>
        </div>
      )}
    </div>
  );
};

export default TradeHistoryChartSection;
