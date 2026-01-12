"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Spinner } from "@/components//ui/spinner";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { CirclePlus, RefreshCw, Trash, XCircle } from "lucide-react";
import { Switch } from "../ui/switch";
import { CoinpaprikaCoin, UserAsset } from "@/types";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { Skeleton } from "../ui/skeleton";
import useWindowSize from "@/hooks/useWindowSize";
import {
  useDeleteAssetWalletFromUser,
  useSetManualAssetMode,
} from "@/hooks/useAdminOperators";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";
import AddNewAssetWallet from "../AddNewAssetWallet";
import { Separator } from "../ui/separator";
import UpdateAsset from "../UpdateAsset";

const WalletUpdate = ({ type }: { type?: string | undefined }) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);
  const { mutate, isPending } = useSetManualAssetMode(id);

  const {
    mutate: deleteAssetsWalletsMutate,
    isPending: deleteAssetsWalletsIsPending,
  } = useDeleteAssetWalletFromUser(id);

  const [openDelete, setOpenDelete] = useState(false);
  const [openAsset, setOpenAsset] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<UserAsset | null>(null);

  // console.log(selectedAsset);

  const {
    allCoins,
    isLoading: coinPriceLoading,
    refetch,
  } = useCoinpaprika(singleUser?.currency?.code, id);

  type ConversionRate = {
    code: string;
    rate: number;
  };
  // remember to remove after properly getting it from the backend
  const [conversionRate] = useState<ConversionRate | null>(null);

  const size = useWindowSize();

  const combinedAssets = singleUser?.assets
    ?.map((asset: UserAsset) => {
      const priceData = allCoins?.find(
        (price: CoinpaprikaCoin) =>
          price?.symbol === asset?.symbol?.toUpperCase()
      );

      if (priceData) {
        const totalValue =
          asset.balance *
          priceData?.quotes?.[singleUser?.currency?.code]?.price;
        return {
          ...asset,
          price: priceData?.quotes?.[singleUser?.currency.code]?.price,
          totalValue,
        };
      }
      return { ...asset, price: 0, totalValue: 0 };
    })
    .sort((a, b) => {
      if (singleUser?.isManualAssetMode) {
        return b.Manualbalance - a.Manualbalance; // Sort by Manualbalance if isManualAssetMode is true
      } else {
        return b.totalValue - a.totalValue; // Otherwise, sort by totalValue
      }
    });

  // console.log(combinedAssets);

  const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;

  const totalWalletBalanceManual = Array.isArray(singleUser?.assets)
    ? singleUser?.assets.reduce(
        (total, asset) => total + (asset.ManualFiatbalance || 0),
        0
      )
    : 0;

  const [openAddWalletMoodal, setOpenAddWalletModal] = useState(false);
  const handleOpenAddWalletModal = () => setOpenAddWalletModal(true);

  const [checked, setChecked] = useState(singleUser?.isManualAssetMode);

  // Handle switch change
  const changeManualAssetMode = (isChecked: boolean) => {
    setChecked(isChecked);

    setTimeout(async () => {
      await mutate(id);
    }, 500);
  };

  const handleRefreshCryptPrices = () => {
    const refreshData = JSON.parse(
      localStorage.getItem("cryptoRefreshData") ?? "{}"
    );

    const currentTime = new Date().getTime();
    const refreshLimit = 3; // Maximum allowed refreshes
    const cooldownPeriod = 20 * 60 * 1000; // 20 minutes cooldown in milliseconds

    // Initialize if not present
    if (!refreshData.count) {
      refreshData.count = 0;
      refreshData.lastRefresh = 0;
    }

    // Check refresh conditions
    if (refreshData.count < refreshLimit) {
      // Update count and last refresh time
      refreshData.count += 1;
      refreshData.lastRefresh = currentTime;

      // Save updated data to localStorage
      localStorage.setItem("cryptoRefreshData", JSON.stringify(refreshData));

      // Dispatch API call
      refetch();

      // Notify user
      toast.success(
        `Prices refreshed successfully. Refresh count: ${refreshData.count}/${refreshLimit}`
      );
    } else {
      // Check if cooldown period has passed
      if (currentTime - refreshData.lastRefresh > cooldownPeriod) {
        // Reset refresh count and allow refresh
        refreshData.count = 1;
        refreshData.lastRefresh = currentTime;

        // Save updated data to localStorage
        localStorage.setItem("cryptoRefreshData", JSON.stringify(refreshData));

        // Dispatch API call
        refetch();

        // Notify user
        toast.success(
          "Prices refreshed successfully after cooldown. Please refresh responsibly."
        );
      } else {
        // Notify user of abuse prevention
        const timeLeftInMs =
          cooldownPeriod - (currentTime - refreshData.lastRefresh);
        const timeLeftMinutes = Math.floor(timeLeftInMs / (1000 * 60));
        const timeLeftSeconds = Math.floor((timeLeftInMs % (1000 * 60)) / 1000);

        const readableTime =
          timeLeftMinutes > 0
            ? `${timeLeftMinutes} minute${
                timeLeftMinutes > 1 ? "s" : ""
              } and ${timeLeftSeconds} second${timeLeftSeconds > 1 ? "s" : ""}`
            : `${timeLeftSeconds} second${timeLeftSeconds > 1 ? "s" : ""}`;

        toast.error(
          `You have recently refreshed prices. Please try again in ${readableTime}.`
        );
      }
    }
  };

  const handleAssetDelete = async () => {
    const userData = {
      walletSymbol: selectedAsset?.symbol,
    };

    // console.log(userData);

    await deleteAssetsWalletsMutate({ id, userData });
    setOpenDelete(false);
  };

  if (pageLoading || deleteAssetsWalletsIsPending) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-4">
      <Card className="p-3 gap-2">
        <div className="flex justify-between  gap-3">
          <Button
            className="flex-1"
            onClick={handleRefreshCryptPrices}
            disabled={coinPriceLoading}
          >
            {coinPriceLoading ? <Spinner /> : <RefreshCw />} Refresh Prices
          </Button>
          <Button
            className="flex-1 bg-orange-500"
            onClick={handleOpenAddWalletModal}
          >
            <CirclePlus /> Add Wallet
          </Button>
        </div>
      </Card>

      <Card className="py-3 mt-3">
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-2 truncate">
            <div className="relative w-16 min-w-16">
              <Image
                src={singleUser?.photo || "/qrCode_placeholder.jpg"}
                alt="wallet-qrcode"
                width={100}
                height={100}
                className="size-16 object-cover border-2 border-gray-400 rounded-full"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {singleUser?.firstname + " " + singleUser?.lastname}
              </h3>
              <h3 className="text-sm font-semibold">{singleUser?.email}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 py-3 mt-3 gap-2">
        <div className="space-y-2 pl-1 my-2">
          {/* Warning Message */}
          {allCoins.length === 0 && (
            <div className="py-2">
              <div className="flex items-start space-x-1 border border-red-500 p-1">
                <XCircle size={42} className="text-red-600" />
                <p className="text-sm">
                  Unable to get fiat rate balance for coins at this time, please
                  kindly make calculations manually for now.
                </p>
              </div>
            </div>
          )}

          {/* Top Row: Wallet Balance + Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-base">Wallet Balance</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <p>Manual Mode</p>
              </div>

              {isPending ? (
                <div className="px-2">
                  <Spinner className="size-5" />
                </div>
              ) : (
                <Switch
                  className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
                  checked={checked}
                  onCheckedChange={changeManualAssetMode}
                />
              )}
            </div>
          </div>

          {/* Balance Display */}
          <div className="space-y-0">
            {/* If manual mode */}
            {singleUser?.isManualAssetMode ? (
              <p
                className={`font-bold mt-[-5px] ${
                  size.width && size.width < 370 ? "text-2xl" : "text-3xl"
                }`}
              >
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: singleUser?.currency?.code,
                  ...(totalWalletBalanceManual > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format(totalWalletBalanceManual)}
              </p>
            ) : (
              <div
                className={`font-bold mt-[-5px] ${
                  size.width && size.width < 370 ? "text-2xl" : "text-3xl"
                }`}
              >
                {coinPriceLoading ? (
                  <Skeleton className="h-6 w-[200px] bg-gray-500" />
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
                    currency: singleUser?.currency?.code,
                    ...(totalWalletBalance > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(totalWalletBalance)
                )}
              </div>
            )}

            {/* coin equivalent */}
            {!singleUser?.isManualAssetMode && (
              <p className="text-sm font-semibold">
                {totalWalletBalance &&
                  Number(
                    totalWalletBalance /
                      allCoins[0]?.quotes?.[
                        singleUser?.currency?.code.toUpperCase()
                      ]?.price
                  ).toFixed(8)}{" "}
                {allCoins[0]?.symbol?.toUpperCase()}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-2 xs:p-3 mt-3 gap-2">
        <div className="grid grid-cols-2 gap-3.5">
          {combinedAssets &&
            combinedAssets.length > 0 &&
            combinedAssets?.map((asset, index) => (
              <div
                key={index}
                className="rounded-xl cursor-pointer bg-secondary"
                onClick={() => {
                  setSelectedAsset(asset);
                  setOpenAsset(true);
                }}
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
                        width={50}
                        height={50}
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
                      {singleUser?.isManualAssetMode ? (
                        <p className="font-extrabold">
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: singleUser?.currency?.code,
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
                              currency: singleUser?.currency?.code,
                              ...(asset?.totalValue > 9999
                                ? { notation: "compact" }
                                : {}),
                            }).format(asset?.totalValue)
                          )}
                        </div>
                      )}

                      {/* Balance - Coin */}
                      <p className="text-xs font-medium">
                        {singleUser?.isManualAssetMode
                          ? Number(asset?.Manualbalance).toFixed(2)
                          : Number(asset?.balance).toFixed(2)}{" "}
                        {asset?.symbol?.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Delete Icon */}
                  <Button
                    size={"icon-sm"}
                    variant={"ghost"}
                    className="absolute top-2 right-2 p-1 rounded z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAsset(asset);
                      setOpenDelete(true);
                    }}
                  >
                    <Trash className="size-5!" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* UPDATE ASSET WALLET */}
      <Dialog open={openAsset} onOpenChange={setOpenAsset}>
        <form>
          <DialogContent className="sm:max-w-[425px] p-3 sm:p-4">
            <DialogHeader>
              <DialogTitle>
                {type === "debit" ? "Debit Wallet" : "Fund Wallet"}
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <UpdateAsset selectedAsset={selectedAsset} type={type} />
          </DialogContent>
        </form>
      </Dialog>

      {/* ADD NEW ASSET WALLET */}
      <Dialog open={openAddWalletMoodal} onOpenChange={setOpenAddWalletModal}>
        <form>
          <DialogContent className="sm:max-w-[425px] p-3 sm:p-4">
            <DialogHeader>
              <DialogTitle>Add Wallet</DialogTitle>
            </DialogHeader>

            <Separator />

            <AddNewAssetWallet />
          </DialogContent>
        </form>
      </Dialog>

      {/* DELETE ASSET WALLET DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete {selectedAsset?.name} Wallet?</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all wallet data?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                handleAssetDelete();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletUpdate;
