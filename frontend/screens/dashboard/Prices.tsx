"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import TickerTapeWidget from "@/components/TradeviewWidgets/TickerTapeWidget";
import { useCurrentUser } from "@/hooks/useAuth";
import WalletRight from "@/components/WalletRight";
import PricesComp from "@/components/PricesComp";

const Prices = () => {
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
    <div className="mb-20 lg:mb-5">
      {/* TickerTapeWidget */}
      <div className="-mx-6 -mt-1 overflow-hidden">
        <TickerTapeWidget />
      </div>

      <div className="flex pl-0 lg:pl-1.5">
        <div className="w-0 min-w-full lg:min-w-0 lg:w-[35%] xl:w-[30%] 2xl:w-[25%] px-3 pt-1 lg:pt-5">
          <PricesComp />
        </div>
        <div className="w-full hidden lg:flex lg:w-[65%] xl:w-[70%] 2xl:w-[75%] px-5 pt-5">
          <WalletRight />
        </div>
      </div>
    </div>
  );
};

export default Prices;
