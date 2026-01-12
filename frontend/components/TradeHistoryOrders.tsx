import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import useWindowSize from "@/hooks/useWindowSize";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { SearchIcon } from "lucide-react";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { Spinner } from "./ui/spinner";
import { TradeHistoryType } from "@/types";
import TradeHistoryOrdersComp from "./TradeHistoryOrdersComp";
import { useCurrentUser } from "@/hooks/useAuth";

const TradeHistoryOrders = ({
  isTradeorder,
}: {
  isTradeorder: boolean | undefined;
}) => {
  const { data: user } = useCurrentUser();
  const { allUserTradeHistories, isLoading } = useTradeHistory(user?._id);

  const size = useWindowSize();
  const [tabIndex, setTabIndex] = useState("All");

  const items = ["All", "Live", "Demo", "Pending", "Cancelled", "Rejected"];

  let allTradeTab;

  if (tabIndex == "All" && !isTradeorder) {
    allTradeTab = allUserTradeHistories?.trades;
  }

  if (tabIndex == "All" && isTradeorder) {
    allTradeTab = Array.isArray(allUserTradeHistories?.trades)
      ? allUserTradeHistories?.trades.filter((trade: TradeHistoryType) => {
          return trade.status === "PENDING";
        })
      : [];
  }

  if (tabIndex == "Live") {
    allTradeTab = Array.isArray(allUserTradeHistories?.trades)
      ? allUserTradeHistories?.trades.filter((trade: TradeHistoryType) => {
          return trade.tradingMode === "Live";
        })
      : [];
  }

  if (tabIndex == "Demo") {
    allTradeTab = Array.isArray(allUserTradeHistories?.trades)
      ? allUserTradeHistories?.trades.filter((trade: TradeHistoryType) => {
          return trade.tradingMode === "Demo";
        })
      : [];
  }

  if (tabIndex === "Pending") {
    allTradeTab = Array.isArray(allUserTradeHistories?.trades)
      ? allUserTradeHistories?.trades.filter((trade: TradeHistoryType) => {
          return trade.status === "PENDING";
        })
      : [];
  }

  if (tabIndex === "Cancelled") {
    allTradeTab = Array.isArray(allUserTradeHistories?.trades)
      ? allUserTradeHistories?.trades.filter((trade: TradeHistoryType) => {
          return trade.status === "CANCELLED";
        })
      : [];
  }

  if (tabIndex === "Rejected") {
    allTradeTab = Array.isArray(allUserTradeHistories?.trades)
      ? allUserTradeHistories?.trades.filter((trade: TradeHistoryType) => {
          return trade.status === "REJECTED";
        })
      : [];
  }
  

  if (isLoading) {
    return (
      <div className="flex justify-center mt-5">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div>
      <ScrollArea
        className="pb-3"
        style={{
          width: size.width && size.width < 500 ? size.width - 30 : "100%",
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
                    px-3 py-1.5 rounded-lg text-sm font-medium
                    transition-all
                    ${
                      active
                        ? "bg-black dark:bg-white text-white dark:text-black font-bold"
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

      <InputGroup className="mt-2">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <div className="mt-4">
        <TradeHistoryOrdersComp allTradeFiltered={allTradeTab} />
      </div>
    </div>
  );
};

export default TradeHistoryOrders;
