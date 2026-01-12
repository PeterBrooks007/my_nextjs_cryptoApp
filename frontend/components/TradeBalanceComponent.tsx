import React, { useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import { CryptoImages } from "@/lib/dummyData";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAuth";
import { Card } from "./ui/card";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { useTheme } from "next-themes";
import ChangeCurrency from "./ChangeCurrency";
import { useConversionRateStore } from "@/store/conversionRateStore";

const TradeBalanceComponent = () => {
  const size = useWindowSize();
  const { resolvedTheme } = useTheme();
  const { data: user } = useCurrentUser();

  const { allCoins: allCoins_coinpaprika, isLoading: coinPriceLoading } =
    useCoinpaprika(user?.currency?.code);

  //hide balance state
  const [hideBalance, setHideBalance] = useState(false);

  const { conversionRate } = useConversionRateStore();

  return (
    <>
      <div className="relative flex items-end justify-between overflow-hidden">
        {/* MAIN CARD */}
        <div
          className="relative z-10 flex w-full flex-row gap-8 rounded-lg p-2 pl-4 text-white overflow-hidden bg-[rgb(0,105,26)]  dark:bg-[rgba(0,105,26,0.8)]"
          style={{
            // backgroundImage: `url(${backgroundSvgImg})`,
            backgroundSize:
              size.width && size.width < 768 ? "cover" : "contain",
            backgroundPosition: "center",
          }}
        >
          {/* Decorative crypto image */}
          <div className="absolute -right-8 -top-5 bottom-0">
            <Image
              src={CryptoImages[0].url}
              alt="Decorative crypto background"
              width={125} // retina-safe
              height={125}
              sizes="(max-width: 640px) 80px, (max-width: 1024px) 100px, 100px"
              priority={false} // load lazily, not critical
              className="size-25 rounded-full rotate-[-50deg] opacity-10"
            />
          </div>
          {/* TRADE BALANCE */}
          <div className="w-full sm:w-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1">
                <p className="text-base font-medium">Trade Balance</p>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-white"
                  onClick={() => setHideBalance(!hideBalance)}
                >
                  {hideBalance ? (
                    <EyeOff className="size-6!" />
                  ) : (
                    <Eye className="size-6!" />
                  )}
                </Button>
              </div>

              {/* Currency selector */}
              <ChangeCurrency />
            </div>

            {/* Balance */}
            <h2 className="-mt-0.5 text-3xl 2xl:text-4xl font-medium">
              {hideBalance
                ? "********"
                : conversionRate?.rate
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: conversionRate?.code || "USD",
                    ...((user?.balance ?? 0) * conversionRate.rate > 9_999_999
                      ? { notation: "compact" as const }
                      : {}),
                  }).format((user?.balance ?? 0) * conversionRate.rate)
                : Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code || "USD",
                    ...((user?.balance ?? 0) > 9_999_999
                      ? { notation: "compact" as const }
                      : {}),
                  }).format(user?.balance ?? 0)}
            </h2>

            {/* BTC */}
            <div className="text-base">
              {hideBalance ? (
                "******** BTC"
              ) : coinPriceLoading ? (
                <Skeleton className="w-37.5 h-5 mt-1 bg-gray-500/50" />
              ) : (
                <>
                  {user?.balance &&
                  allCoins_coinpaprika[0]?.quotes?.[
                    user?.currency?.code?.toUpperCase()
                  ]?.price ? (
                    <>
                      {Number(
                        user?.balance /
                          allCoins_coinpaprika[0].quotes[
                            user?.currency?.code.toUpperCase()
                          ].price
                      ).toFixed(8)}{" "}
                      {allCoins_coinpaprika[0].symbol.toUpperCase()}
                    </>
                  ) : (
                    "0 BTC" // Fallback in case price or balance is unavailable
                  )}
                </>
              )}
            </div>
          </div>

          {/* DESKTOP EXTRA STATS */}
          {size.width && size.width >= 900 && (
            <>
              <div>
                <Separator
                  orientation="vertical"
                  className="hidden md:block opacity-20 dark:opacity-100"
                />
              </div>
              {/* TOTAL DEPOSIT */}
              <div className="hidden md:block">
                <p className="text-base">Total Deposit</p>
                <h2 className="mt-1 text-3xl 2xl:text-4xl font-medium">
                  {hideBalance
                    ? "********"
                    : conversionRate?.rate
                    ? Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate?.code || "USD",
                        ...((user?.totalDeposit ?? 0) * conversionRate.rate >
                        9_999_999
                          ? { notation: "compact" as const }
                          : {}),
                      }).format((user?.totalDeposit ?? 0) * conversionRate.rate)
                    : Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code || "USD",
                        ...((user?.totalDeposit ?? 0) > 9_999_999
                          ? { notation: "compact" as const }
                          : {}),
                      }).format(user?.totalDeposit ?? 0)}
                </h2>
                <div className="text-base">
                  {hideBalance ? (
                    "******** BTC"
                  ) : coinPriceLoading ? (
                    <Skeleton className="w-37.5 h-5 mt-1 bg-gray-500/50" />
                  ) : (
                    <>
                      {user?.totalDeposit &&
                      allCoins_coinpaprika[0]?.quotes?.[
                        user?.currency?.code?.toUpperCase()
                      ]?.price ? (
                        <>
                          {Number(
                            user?.totalDeposit /
                              allCoins_coinpaprika[0].quotes[
                                user?.currency?.code.toUpperCase()
                              ].price
                          ).toFixed(8)}{" "}
                          {allCoins_coinpaprika[0].symbol.toUpperCase()}
                        </>
                      ) : (
                        "0 BTC" // Fallback in case price or balance is unavailable
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <Separator
                  orientation="vertical"
                  className="hidden md:block opacity-20 dark:opacity-100"
                />
              </div>

              {/* PROFIT */}
              <div className="hidden md:block">
                <p className="text-base">Profit Earned</p>
                <h2 className="mt-1 text-3xl 2xl:text-4xl font-medium">
                  {hideBalance
                    ? "********"
                    : conversionRate?.rate
                    ? Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate?.code || "USD",
                        ...((user?.earnedTotal ?? 0) * conversionRate.rate >
                        9_999_999
                          ? { notation: "compact" as const }
                          : {}),
                      }).format((user?.earnedTotal ?? 0) * conversionRate.rate)
                    : Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code || "USD",
                        ...((user?.earnedTotal ?? 0) > 9_999_999
                          ? { notation: "compact" as const }
                          : {}),
                      }).format(user?.earnedTotal ?? 0)}
                </h2>
                <div className="text-base">
                  {hideBalance ? (
                    "******** BTC"
                  ) : coinPriceLoading ? (
                    <Skeleton className="w-37.5 h-5 mt-1 bg-gray-500/50" />
                  ) : (
                    <>
                      {user?.earnedTotal &&
                      allCoins_coinpaprika[0]?.quotes?.[
                        user?.currency?.code?.toUpperCase()
                      ]?.price ? (
                        <>
                          {Number(
                            user?.earnedTotal /
                              allCoins_coinpaprika[0].quotes[
                                user?.currency?.code.toUpperCase()
                              ].price
                          ).toFixed(8)}{" "}
                          {allCoins_coinpaprika[0].symbol.toUpperCase()}
                        </>
                      ) : (
                        "0 BTC" // Fallback in case price or balance is unavailable
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profit Earned and Total Deposit grid */}
      <div className="mt-2 flex lg:hidden">
        <div className="grid grid-cols-2 gap-3 w-full">
          {/* Profit Earned */}
          <Card className="relative overflow-hidden p-2 rounded-md bg-secondary/50">
            <Image
              src="/svgIcons/earnedSvgIcon.svg"
              alt="total deposit icon"
              width={60}
              height={60}
              className="absolute -right-5 top-0 bottom-0 my-auto h-20 w-15"
              style={{ opacity: resolvedTheme === "light" ? 0.05 : 0.05 }}
            />

            <div className="flex items-center gap-2">
              {/* <TrendingUp className="w-10 h-10 text-primary" /> */}

              <Image
                src="/svgIcons/earnedSvgIcon.svg"
                alt="total deposit icon"
                width={40}
                height={40}
                className="size-10"
              />

              <div>
                <p className="text-sm font-medium whitespace-nowrap truncate">
                  Profit Earned
                </p>

                {hideBalance
                  ? "********"
                  : conversionRate?.rate
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: conversionRate?.code || "USD",
                      ...((user?.earnedTotal ?? 0) * conversionRate.rate >
                      9_999_999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format((user?.earnedTotal ?? 0) * conversionRate.rate)
                  : Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code || "USD",
                      ...((user?.earnedTotal ?? 0) > 9_999_999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(user?.earnedTotal ?? 0)}
              </div>
            </div>
          </Card>

          {/* Total Deposit */}
          <Card className="relative overflow-hidden p-2 rounded-md bg-secondary/50">
            <Image
              src="/svgIcons/totalDepositSvgIcon.svg"
              alt="total deposit icon"
              width={60}
              height={60}
              className="absolute -right-4 top-0 bottom-0 my-auto h-20 w-15"
              style={{ opacity: resolvedTheme === "light" ? 0.05 : 0.05 }}
            />

            <div className="flex items-center gap-2">
              <Image
                src="/svgIcons/totalDepositSvgIcon.svg"
                alt="total deposit icon"
                width={40}
                height={40}
                className="size-10"
              />

              <div>
                <p className="text-sm font-medium whitespace-nowrap truncate">
                  Total Deposit
                </p>
                {hideBalance
                  ? "********"
                  : conversionRate?.rate
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: conversionRate?.code || "USD",
                      ...((user?.totalDeposit ?? 0) * conversionRate.rate >
                      9_999_999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format((user?.totalDeposit ?? 0) * conversionRate.rate)
                  : Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code || "USD",
                      ...((user?.totalDeposit ?? 0) > 9_999_999
                        ? { notation: "compact" as const }
                        : {}),
                    }).format(user?.totalDeposit ?? 0)}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TradeBalanceComponent;
