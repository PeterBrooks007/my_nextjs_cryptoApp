import { CoinGeckoCoin } from "@/types";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Star, X } from "lucide-react";
import { DrawerClose } from "./ui/drawer";
import { Separator } from "./ui/separator";
import { useConversionRateStore } from "@/store/conversionRateStore";
import { useCurrentUser } from "@/hooks/useAuth";
import { Spinner } from "./ui/spinner";
import CoinDetailsChart from "./charts/CoinDetailsChart";
import Image from "next/image";

const CoinDetailsDrawer = ({
  singleCoinDetails,
}: {
  singleCoinDetails: CoinGeckoCoin | null;
}) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const { data: user } = useCurrentUser();
  const { conversionRate } = useConversionRateStore();

  if (pageLoading) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0  bg-background rounded-3xl flex items-center justify-between px-4 py-3">
        <Button variant="ghost" size="icon">
          <Star className="size-5!" />
        </Button>

        <div className="flex items-center space-x-2">
          <Image
            src={singleCoinDetails?.image ?? "qrCode_placeholder.jpg"}
            alt={singleCoinDetails?.name ?? "walletImage"}
            width={40}
            height={40}
            sizes="25px"
            className="size-6.25 rounded-full bg-white"
          />
          <span className="font-semibold">{singleCoinDetails?.name}</span>
        </div>
        <DrawerClose asChild>
          <Button variant="ghost" size="icon">
            <X className="size-5!" />
          </Button>
        </DrawerClose>
      </div>

      <Separator />

      <div className="w-full h-full ">
        {/* Main Content */}
        <div className="p-4 flex flex-col overflow-auto space-y-4 ">
          {/* Coin Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src={singleCoinDetails?.image ?? "qrCode_placeholder.jpg"}
                alt={singleCoinDetails?.name ?? "walletImage"}
                width={60}
                height={60}
                sizes="44px"
                className="size-11 rounded-full bg-white"
              />
              <div className="-space-y-1">
                <div className="text-base">{singleCoinDetails?.name}</div>
                <div className="text-sm text-gray-500">
                  {singleCoinDetails?.symbol?.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end -space-y-1">
              <div className="font-bold text-lg">
                {conversionRate?.rate
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: conversionRate.code ?? "USD",
                      ...(Number(singleCoinDetails?.current_price ?? 0) *
                        Number(conversionRate.rate) >
                      9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(
                      Number(singleCoinDetails?.current_price ?? 0) *
                        Number(conversionRate.rate)
                    )
                  : Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code ?? "USD",
                      ...(Number(singleCoinDetails?.current_price ?? 0) >
                      9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(Number(singleCoinDetails?.current_price ?? 0))}
              </div>

              <div
                className={`text-sm ${
                  Number(singleCoinDetails?.price_change_percentage_24h ?? 0) <
                  0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {Number(
                  singleCoinDetails?.price_change_percentage_24h ?? 0
                ).toFixed(2)}
                % (
                {conversionRate?.rate
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: conversionRate.code ?? "USD",
                      ...(Number(singleCoinDetails?.price_change_24h ?? 0) *
                        Number(conversionRate.rate) >
                      9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(
                      Number(singleCoinDetails?.price_change_24h ?? 0) *
                        Number(conversionRate.rate)
                    )
                  : Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code ?? "USD",
                      ...(Number(singleCoinDetails?.price_change_24h ?? 0) >
                      9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(Number(singleCoinDetails?.price_change_24h ?? 0))}
                )
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 overflow-hidden mt-5 -mx-4">
            <CoinDetailsChart
              data={singleCoinDetails?.sparkline_in_7d.price.map(
                (price: number, i: number) => ({
                  name: i,
                  value: price,
                })
              )}
              dataPricePercentage={
                singleCoinDetails?.price_change_percentage_24h
              }
            />
          </div>

          {/* Stats */}
          <div className="flex justify-between mt-2">
            {/* Current Price */}
            <div>
              <div className="text-sm">Current Price</div>
              <div className="font-semibold">
                {conversionRate?.rate
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: conversionRate.code ?? "USD",
                      ...(Number(singleCoinDetails?.current_price ?? 0) *
                        Number(conversionRate.rate) >
                      9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(
                      Number(singleCoinDetails?.current_price ?? 0) *
                        Number(conversionRate.rate)
                    )
                  : Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code ?? "USD",
                      ...(Number(singleCoinDetails?.current_price ?? 0) >
                      9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(Number(singleCoinDetails?.current_price ?? 0))}
              </div>
            </div>

            {/* Market Cap */}
            <div>
              <div className="text-sm">Market Cap</div>
              <div className="font-semibold">
                {conversionRate?.rate
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: conversionRate.code ?? "USD",
                      ...(Number(singleCoinDetails?.market_cap ?? 0) *
                        Number(conversionRate.rate) >
                      9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(
                      Number(singleCoinDetails?.market_cap ?? 0) *
                        Number(conversionRate.rate)
                    )
                  : Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code ?? "USD",
                      ...(Number(singleCoinDetails?.market_cap ?? 0) > 9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(Number(singleCoinDetails?.market_cap ?? 0))}
              </div>
            </div>

            {/* Total Volume */}
            <div>
              <div className="text-sm">Total Vol</div>
              <div className="font-semibold">
                {conversionRate?.rate
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: conversionRate.code ?? "USD",
                      ...(Number(singleCoinDetails?.total_volume ?? 0) *
                        Number(conversionRate.rate) >
                      9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(
                      Number(singleCoinDetails?.total_volume ?? 0) *
                        Number(conversionRate.rate)
                    )
                  : Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code ?? "USD",
                      ...(Number(singleCoinDetails?.total_volume ?? 0) > 9999999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(Number(singleCoinDetails?.total_volume ?? 0))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetailsDrawer;
