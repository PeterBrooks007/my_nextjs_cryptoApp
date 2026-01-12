"use client";

import { useEffect, useState } from "react";
import { History, X, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/useAuth";
import { DrawerClose } from "../ui/drawer";
import Image from "next/image";
import { Card } from "../ui/card";

import { DepositSkeleton } from "../skeletonComponents/DepositSkeleton";
import { CoinpaprikaCoin, combinedAssetsTypes, UserAsset } from "@/types";
import AmountToWithdraw from "./AmountToWithdraw";
import AllWalletAddress from "./AllWalletAddress";
import QuickCheck from "./QuickCheck";
import { useFundAccountStore } from "@/store/fundAccountStore";
import { Skeleton } from "../ui/skeleton";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { useConversionRateStore } from "@/store/conversionRateStore";
import WalletTransactions from "../WalletTransactions";

export default function SendCryptoComponent() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  // console.log(allWalletAddress);
  const { data: user } = useCurrentUser();
  const { isFundAccount } = useFundAccountStore();
  const [selectedView, setSelectedView] = useState(1);
  const [Wallet, setWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] =
    useState<combinedAssetsTypes | null>(null);

  const {
    allCoins,
    isLoading: coinPriceLoading,
    // refetch,
  } = useCoinpaprika(user?.currency?.code);

  const { conversionRate } = useConversionRateStore();

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
    .slice(0, 4)
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

  if (pageLoading) {
    return (
      <DepositSkeleton
        type={isFundAccount ? "Fund Trade Account" : "Send Crypto"}
      />
    );
  }

  return (
    <div className="relative min-h-full w-full bg-transparent">
      {/* ============== Select Wallet View 1 =========== */}
      <div
        className={`pb-5
           transition-opacity duration-300 ${
             selectedView === 1 ? "opacity-100 visible" : "opacity-0 invisible"
           }
        `}
      >
        <div className="sticky top-0  bg-background rounded-3xl flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedView(4)}
          >
            <History className="size-5!" />
          </Button>

          <h2 className="font-semibold">
            {isFundAccount ? "Fund Trade Account" : "Send Crypto"}
          </h2>

          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>

        <Separator />

        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm text-muted-foreground">Wallet Balance</p>
            <div className="font-semibold">
              {!allCoins || allCoins.length < 1 ? (
                "UNAVAILABLE"
              ) : user?.isManualAssetMode ? (
                <p className={`font-semibold `}>
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code,
                    ...(totalWalletBalanceManual > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(totalWalletBalanceManual)}
                </p>
              ) : (
                <p className={`font-semibold `}>
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
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedView(4)}
            >
              <History className="h-4 w-4" />
              Transactions
            </Button>
          </div>
        </div>

        {/* select the deposit wallet */}
        <div className="space-y-2">
          {combinedAssets &&
            combinedAssets.length > 0 &&
            combinedAssets.map((wallet) => (
              <Card
                key={wallet._id}
                onClick={() => {
                  setWallet(wallet?.name);
                  setWalletAddress(wallet);
                  setSelectedView(2);
                }}
                className={`flex flex-row items-center justify-between px-4 py-4 mx-3 cursor-pointer bg-secondary/50 border-none`}
              >
                {/* Left */}
                <div className="flex items-center gap-2 ">
                  <Image
                    src={wallet?.image}
                    alt={wallet?.name}
                    width={40}
                    height={40}
                    className="rounded-[10px] bg-white p-px"
                  />

                  <div>
                    <span className="text-[18px] font-semibold w-50 truncate">
                      {wallet?.name} wallet
                    </span>
                    <span className="text-[18px] font-semibold w-50 truncate">
                      {!allCoins || allCoins.length < 1 ? (
                        "UNAVAILABLE"
                      ) : user?.isManualAssetMode ? (
                        <p className={`font-semibold `}>
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(wallet?.ManualFiatbalance > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(wallet?.ManualFiatbalance)}
                        </p>
                      ) : (
                        <p className={`font-semibold `}>
                          {coinPriceLoading ? (
                            <Skeleton className="h-6 w-50 bg-gray-500/50" />
                          ) : conversionRate?.rate ? (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: conversionRate?.code,
                              ...(wallet?.totalValue * conversionRate?.rate >
                              999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(wallet?.totalValue * conversionRate?.rate)
                          ) : (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: user?.currency?.code,
                              ...(wallet?.totalValue > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(wallet?.totalValue)
                          )}
                        </p>
                      )}
                    </span>
                  </div>
                </div>

                {/* Right Icon */}
                <ChevronRight className="size-6" />
              </Card>
            ))}

          {["Bank Withdrawal", "All Withdraw Methods"].map((deposit) => (
            <Card
              key={deposit}
              onClick={() => {
                if (deposit === "Bank Withdrawal") {
                  setWallet("Bank");
                  setSelectedView(2);
                } else {
                  setSelectedView(6);
                }
              }}
              className={`flex flex-row items-center justify-between px-4 py-4 mx-3 cursor-pointer bg-secondary/50 border-none
     
    `}
            >
              {/* Left */}
              <div className="flex items-center gap-2 ">
                <Image
                  src={
                    deposit === "Bank Withdrawal"
                      ? "/bank.png"
                      : "/wallet_connect.jpg"
                  }
                  alt={"bank"}
                  width={40}
                  height={40}
                  className="rounded-[10px] bg-white "
                />

                <span className="text-[18px] font-semibold w-50 truncate">
                  {deposit}
                </span>
              </div>

              {/* Right Icon */}
              <ChevronRight size={24} />
            </Card>
          ))}
        </div>
      </div>

      {/* ============== Enter Amount to Withdraw View 2  ==============*/}
      <div
        className={`h-full
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 2 ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {selectedView === 2 && (
          <AmountToWithdraw
            Wallet={Wallet}
            walletAddress={walletAddress}
            setSelectedView={setSelectedView}
          />
        )}
      </div>

      {/* ============== QuickCheck View 3 ==============*/}
      <div
        className={`h-full
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 3 ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {selectedView === 3 && (
          <QuickCheck
            Wallet={Wallet}
            walletAddress={walletAddress}
            setSelectedView={setSelectedView}
          />
        )}
      </div>

      {/* ============== Withdrawal History View 4 ============== */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 4 ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedView(1)}
          >
            <ChevronLeft className="size-5!" />
          </Button>
          <h2 className="font-semibold">Transaction History</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>
        <Separator />
        <div className="p-4">
          {selectedView === 4 && <WalletTransactions transactionNumber="All" />}
        </div>
      </div>

      {/* ============== All Withdrawal Method  View 6 ============== */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 6 ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedView(1)}
          >
            <ChevronLeft className="size-5!" />
          </Button>
          <h2 className="font-semibold">All Assets</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>
        <Separator />
        {selectedView === 6 && (
          <AllWalletAddress
            setWallet={setWallet}
            setWalletAddress={setWalletAddress}
            setSelectedView={setSelectedView}
          />
        )}
      </div>
    </div>
  );
}
