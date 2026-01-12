import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Eye, EyeOff } from "lucide-react";

import { useCurrentUser } from "@/hooks/useAuth";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { CoinpaprikaCoin, UserAsset } from "@/types";
import TopBar from "./TopBar";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import WalletTransactions from "./WalletTransactions";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import ChangeCurrency from "./ChangeCurrency";
import { useConversionRateStore } from "@/store/conversionRateStore";

const AssetsLeft = () => {
  const { data: user } = useCurrentUser();

  const {
    allCoins,
    isLoading: coinPriceLoading,
    // refetch,
  } = useCoinpaprika(user?.currency?.code);

  // const allCoins = [];

  const [openWalletTransactionHistory, setOpenWalletTransactionHistory] =
    useState(false);

   const { conversionRate } = useConversionRateStore();
 

  //hide balance state
  const [hideBalance, setHideBalance] = useState(false);

  const combinedAssets = user?.assets
    ?.map((asset: UserAsset) => {
      const priceData = allCoins?.find(
        (price: CoinpaprikaCoin) =>
          price?.symbol === asset?.symbol?.toUpperCase()
      );

      if (priceData) {
        const totalValue =
          asset.balance * priceData?.quotes?.[user?.currency?.code]?.price;
        return {
          ...asset,
          price: priceData?.quotes?.[user?.currency.code]?.price,
          totalValue,
        };
      }
      return { ...asset, price: 0, totalValue: 0 };
    })
    .sort((a, b) => {
      if (user?.isManualAssetMode) {
        return b.Manualbalance - a.Manualbalance; // Sort by Manualbalance if isManualAssetMode is true
      } else {
        return b.totalValue - a.totalValue; // Otherwise, sort by totalValue
      }
    });

  // console.log(combinedAssets);

  const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;

  const totalWalletBalanceManual = Array.isArray(user?.assets)
    ? user?.assets.reduce(
        (total, asset) => total + (asset.ManualFiatbalance || 0),
        0
      )
    : 0;

  return (
    <div className="flex flex-col gap-5 p-2">
      {/* TopBar */}
      <TopBar />

      {/* Wallet Balance Card */}
      <div className="relative flex h-auto flex-col justify-between rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">Wallet Balance</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setHideBalance(!hideBalance)}
              >
                {hideBalance ? (
                  <EyeOff className="size-6!" />
                ) : (
                  <Eye className="size-6!" />
                )}
              </Button>
            </div>

            {/* Balance */}
            <div className="leading-tight">
              {hideBalance ? (
                <p className="text-3xl font-semibold">********</p>
              ) : (
                <div className="text-3xl font-semibold">
                  {!allCoins || allCoins.length < 1 ? (
                    "UNAVAILABLE"
                  ) : user?.isManualAssetMode ? (
                    <p className={`font-bold  text-3xl  `}>
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(totalWalletBalanceManual > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(totalWalletBalanceManual)}
                    </p>
                  ) : (
                    <div className={`font-bold  text-3xl `}>
                      {coinPriceLoading ? (
                        <Skeleton className="h-6 w-50 bg-gray-500/50" />
                      ) : conversionRate?.rate ? (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate?.code,
                          ...(totalWalletBalance * conversionRate?.rate > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(totalWalletBalance * conversionRate?.rate)
                      ) : (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(totalWalletBalance > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(totalWalletBalance)
                      )}
                    </div>
                  )}
                </div>
              )}

              {!user?.isManualAssetMode &&
                (hideBalance ? (
                  <p className="text-base font-semibold">******** BTC</p>
                ) : (
                  <p className="text-base font-medium text-muted-foreground">
                    {Number(
                      totalWalletBalance /
                        allCoins?.[0]?.quotes?.[
                          user?.currency?.code?.toUpperCase() ?? ""
                        ]?.price
                    ).toFixed(8)}{" "}
                    {allCoins?.[0]?.symbol?.toUpperCase()}
                  </p>
                ))}
            </div>
          </div>

          {/* Currency Selector */}
          <ChangeCurrency />
        </div>
      </div>

      <div className="  gap-2">
        <div className="grid grid-cols-2 gap-3.5">
          {combinedAssets &&
            combinedAssets.length > 0 &&
            combinedAssets?.map((asset, index) => (
              <div
                key={index}
                className="rounded-xl cursor-pointer bg-zinc-100  dark:bg-zinc-900 "
                // onClick={() => {
                //   setSelectedAsset(asset);
                //   setOpenAsset(true);
                // }}
              >
                {/* Card */}
                <div
                  className={`
              relative grow rounded-xl p-2
            `}
                >
                  {/* Row: Image + Text */}
                  <div className="flex items-center space-x-2 pl-0 xs:pl-1">
                    <div className="pl-1">
                      <Image
                        src={asset?.image}
                        alt=""
                        width={60}
                        height={60}
                        sizes="(max-width: 640px) 50px, (max-width: 1024px) 50px, 50px" 
                        className="size-8 bg-white rounded-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      {/* Name */}
                      <p className="text-sm font-medium">
                        {asset?.name?.length > 10
                          ? asset?.name.slice(0, 10) + "..."
                          : asset?.name}
                      </p>

                      {/* Balance - Fiat */}
                      {user?.isManualAssetMode ? (
                        <p className="font-extrabold">
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(asset?.ManualFiatbalance > 9999
                              ? { notation: "compact" }
                              : {}),
                          }).format(asset?.ManualFiatbalance)}
                        </p>
                      ) : (
                        <div className="font-extrabold">
                          {coinPriceLoading ? (
                            <Skeleton className="h-4 w-20 bg-gray-500" />
                          ) : conversionRate?.rate ? (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: conversionRate?.code,
                              ...(asset?.totalValue * conversionRate?.rate >
                              9999
                                ? { notation: "compact" }
                                : {}),
                            }).format(asset?.totalValue * conversionRate?.rate)
                          ) : (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: user?.currency?.code,
                              ...(asset?.totalValue > 9999
                                ? { notation: "compact" }
                                : {}),
                            }).format(asset?.totalValue)
                          )}
                        </div>
                      )}

                      {/* Balance - Coin */}
                      <p className="text-xs font-medium">
                        {user?.isManualAssetMode
                          ? Number(asset?.Manualbalance).toFixed(2)
                          : Number(asset?.balance).toFixed(2)}{" "}
                        {asset?.symbol?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex justify-between px-2 mb-2">
          <span className="font-semibold text-sm">Transactions</span>
          <span
            className="text-sm cursor-pointer"
            onClick={() => setOpenWalletTransactionHistory(true)}
          >
            See all
          </span>
        </div>

        <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-0">
          <div className="h-100 py-5 px-4 mt-3">
            <WalletTransactions />
          </div>
        </div>
      </div>

      {/* Wallet Transaction History */}
      <Sheet
        open={openWalletTransactionHistory}
        onOpenChange={setOpenWalletTransactionHistory}
      >
        <SheetContent className="w-full! max-w-md! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Wallet Transactions</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-4">
              <WalletTransactions transactionNumber="All" />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AssetsLeft;
