import { ArrowDownLeft, ArrowUpRight, XCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import TinyLineChart from "./charts/TinyLineChart";
import { useCurrentUser } from "@/hooks/useAuth";
import { Skeleton } from "./ui/skeleton";
import useWindowSize from "@/hooks/useWindowSize";
import { CoinGeckoCoin } from "@/types";
import { useConversionRateStore } from "@/store/conversionRateStore";

const CryptoBox = ({ data }: { data: CoinGeckoCoin }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const size = useWindowSize();

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, []);

  const { data: user } = useCurrentUser();
  const isMobile = size.width && size.width < 640;

  const { conversionRate } = useConversionRateStore();

  if (pageLoading) {
    return (
      <div className="flex w-full h-full flex-col gap-5 p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <Skeleton className="size-9 sm:size-12 rounded-full bg-gray-500/40" />
            <div>
              <div
                className={`${
                  isMobile ? "text-sm font-medium" : "text-lg font-semibold"
                }`}
              >
                <Skeleton className="w-8 sm:w-14 h-3 rounded-full bg-gray-500/40" />
              </div>
              <div
                className={`mt-0.5 sm:mt-1 ${
                  isMobile ? "text-xs" : "text-sm"
                } text-muted-foreground`}
              >
                <Skeleton className="w-10 sm:w-16 h-2.5 rounded-full bg-gray-500/40" />
              </div>
            </div>
          </div>

          <Skeleton className="size-9 sm:size-12 rounded-full bg-gray-500/40" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className=" w-full h-full flex flex-col gap-2 justify-center items-center ">
        <XCircle color="red" size={52} />
        <p className="text-center">Unable to load crypto data at this time</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full flex-col gap-5 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <div className="relative size-8.5 sm:size-11.5">
            <Image
              src={data?.image || ""}
              alt=""
              fill
              sizes="(max-width: 640px) 34px, 46px"
              className="rounded-full border bg-white object-cover"
            />
          </div>

          <div>
            <p
              className={`${
                isMobile ? "text-sm font-medium" : "text-lg font-semibold"
              }`}
            >
              {data?.symbol?.toUpperCase()}
            </p>
            <p
              className={`-mt-0.5 ${
                isMobile ? "text-xs" : "text-sm"
              } text-muted-foreground`}
            >
              {data?.name}
            </p>
          </div>
        </div>

        <button
          className="flex items-center justify-center rounded-full text-white"
          style={{
            width: isMobile ? "30px" : "45px",
            height: isMobile ? "30px" : "45px",
            backgroundColor:
              data?.price_change_percentage_24h < 0 ? "#d01725" : "#009a4c",
          }}
        >
          {data?.price_change_percentage_24h < 0 ? (
            <ArrowDownLeft className={isMobile ? "h-5 w-5" : "h-7 w-7"} />
          ) : (
            <ArrowUpRight className={isMobile ? "h-5 w-5" : "h-7 w-7"} />
          )}
        </button>
      </div>

      {/* BODY */}
      <div className="flex items-start justify-between gap-2">
        {/* PRICE */}
        <div className="flex flex-col gap-1">
          <p className={`font-medium ${isMobile ? "text-xl" : "text-3xl"}`}>
            {conversionRate?.rate
              ? Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: conversionRate.code || "USD",
                  ...(data?.current_price * conversionRate.rate > 999
                    ? { notation: "compact" }
                    : {}),
                }).format(data?.current_price * conversionRate.rate)
              : Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: user?.currency?.code || "USD",
                  ...(data?.current_price > 999 ? { notation: "compact" } : {}),
                }).format(data?.current_price)}
          </p>

          <p
            className="text-xs"
            style={{
              color: data?.price_change_percentage_24h < 0 ? "red" : "#009a4c",
            }}
          >
            {Number(data?.price_change_percentage_24h).toFixed(2)}%
          </p>
        </div>

        {/* CHART */}
        <div className="h-17.5 w-full overflow-hidden">
          <TinyLineChart
            data={data?.sparkline_in_7d.price.map(
              (price: number, i: number) => ({
                name: i,
                value: price,
              })
            )}
            dataPricePercentage={data?.price_change_percentage_24h}
          />
        </div>
      </div>
    </div>
  );
};

export default CryptoBox;
