import { useCurrentUser } from "@/hooks/useAuth";
import { useCoingeckoCoins } from "@/hooks/useCoingeckoCoins";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import TinyLineChart from "@/components/charts/TinyLineChart";
import { Spinner } from "./ui/spinner";
import { useConversionRateStore } from "@/store/conversionRateStore";
import { Drawer, DrawerContent } from "./ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import useWindowSize from "@/hooks/useWindowSize";
import { DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import CoinDetailsDrawer from "./CoinDetailsDrawer";
import { CoinGeckoCoin } from "@/types";

const CryptoTrending = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 400);
  }, []);

  const { allCoins } = useCoingeckoCoins();
  const { data: user } = useCurrentUser();

  const [openCoinDetailsDrawer, setCoinDetailsDrawer] = useState(false);
  const [singleCoinDetails, setSingleCoinDetails] =
    useState<CoinGeckoCoin | null>(null);

  const size = useWindowSize();

  const { conversionRate } = useConversionRateStore();

  const firstSix = Array.isArray(allCoins) ? allCoins.slice(0, 5) : [];

  if (pageLoading) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <>
      {/* <h1 className="text-lg font-medium mb-2">Top Cryptocurrencies</h1> */}

      <div className="flex flex-col gap-2">
        {allCoins &&
          allCoins.length > 0 &&
          firstSix.map((data, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 cursor-pointer py-1"
              onClick={() => {
                setSingleCoinDetails(data);
                setCoinDetailsDrawer(true);
              }}
            >
              {/* LEFT: icon + symbol + name */}
              <div className="flex items-center space-x-3">
                <Image
                  src={data?.image ?? "/placeholder.png"}
                  alt={data?.name ?? "Crypto asset"}
                  width={48}
                  height={48}
                  sizes="38px"
                  priority={false}
                  className="size-9.5 rounded-full bg-white border"
                />

                <div className="flex flex-col">
                  <span className="text-base font-medium">
                    {data?.symbol.toUpperCase()}
                  </span>

                  <span className="-mt-1 text-sm text-muted-foreground">
                    {data?.name}
                  </span>
                </div>
              </div>

              {/* TINY LINE CHART */}
              <div className="w-25 h-12.5 ml-5 xs:ml-0 overflow-hidden">
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

              {/* PRICE */}
              <span className="whitespace-nowrap text-base">
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
                      ...(data?.current_price > 999
                        ? { notation: "compact" }
                        : {}),
                    }).format(data?.current_price)}
              </span>

              {/* 24H CHANGE */}
              <span
                className={`
        ${
          data?.price_change_percentage_24h < 0
            ? "text-red-500"
            : "text-green-600"
        }
      `}
              >
                {Number(data?.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          ))}
      </div>

      {/* COINDETAILS DRAWER */}
      <Drawer
        open={openCoinDetailsDrawer}
        onOpenChange={setCoinDetailsDrawer}
        direction={size.width && size.width < 1024 ? "bottom" : "right"}
      >
        <DrawerContent
          className="w-full! lg:w-lg lg:max-w-md! min-h-[70%]! xs:min-h-[60%]! h-auto lg:h-full! rounded-3xl! lg:rounded-none! outline-none!"
          showHandle={false}
        >
          <VisuallyHidden>
            <DialogTitle>Coin Details</DialogTitle>
          </VisuallyHidden>

          <ScrollArea className="h-full overflow-y-auto">
            {openCoinDetailsDrawer && (
              <CoinDetailsDrawer singleCoinDetails={singleCoinDetails} />
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CryptoTrending;
