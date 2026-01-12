import Image from "next/image";
import React, { Fragment, useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Eye,
  EyeOff,
  PlusCircle,
  Box,
  CircleDollarSign,
  SendHorizontal,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/useAuth";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { CoinpaprikaCoin, UserAsset } from "@/types";
import TopBar from "./TopBar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import WalletTransactions from "./WalletTransactions";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import Link from "next/link";
import ChangeCurrency from "./ChangeCurrency";
import { useConversionRateStore } from "@/store/conversionRateStore";
import { Drawer, DrawerContent } from "./ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "./ui/dialog";
import useWindowSize from "@/hooks/useWindowSize";
import DepositComponent from "./depositComponents/DepositComponent";
import { useRouter } from "next/navigation";
import { useTypeOfDepositStore } from "@/store/typeOfDepositStore";
import { useFundAccountStore } from "@/store/fundAccountStore";
import SendCryptoComponent from "./SendCryptoComponent/SendCryptoComponent";

const WalletLeft = () => {
  const { data: user } = useCurrentUser();

  const size = useWindowSize();

  const router = useRouter();

  const {
    allCoins,
    isLoading: coinPriceLoading,
    // refetch,
  } = useCoinpaprika(user?.currency?.code);

  // const allCoins = [];
  const { setTypeOfDeposit } = useTypeOfDepositStore();
  const { setIsFundAccount } = useFundAccountStore();

  const [openWalletTransactionHistory, setOpenWalletTransactionHistory] =
    useState(false);
  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
  const [openSendCryptoDrawer, setOpenSendCryptoDrawer] = useState(false);

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
      <div className="relative flex h-auto flex-col gap-3 justify-between rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900 overflow-hidden">
        {/* Background coin */}
        <div className="absolute -top-5 -right-5 inset-y-0">
          <Image
            src={combinedAssets?.[0]?.image ?? "/qrCode_placeholder.jpg"}
            alt=""
            width={100} // matches visual size
            height={100} // matches visual size
            sizes="(max-width: 640px) 80px, 100px"
            priority={false} // lazy-load
            className="size-25 rounded-full rotate-[-50deg] opacity-10 dark:opacity-5 object-cover"
          />
        </div>

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

        <Separator />

        {/* Asset Summary */}
        <div className="flex justify-around overflow-x-auto gap-4 pt-2">
          {combinedAssets?.slice(0, 2).map((asset, i) => (
            <Fragment key={i}>
              <div className="flex items-center gap-2">
                <Image
                  src={asset.image ?? "/placeholder.png"}
                  alt=""
                  width={48} // 2x of visual 28px
                  height={48} // retina-ready
                  sizes="28px" // visual display size
                  priority={false}
                  className="size-7 rounded-full object-cover"
                />
                <span className="font-semibold">
                  {coinPriceLoading ? (
                    <Skeleton className="h-4 w-20 bg-gray-500/50" />
                  ) : user?.isManualAssetMode ? (
                    conversionRate?.rate ? (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate?.code,
                        ...(asset.ManualFiatbalance * conversionRate.rate >
                          999999 && {
                          notation: "compact",
                        }),
                      }).format(asset.ManualFiatbalance * conversionRate.rate)
                    ) : (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(asset.ManualFiatbalance > 999999 && {
                          notation: "compact",
                        }),
                      }).format(asset.ManualFiatbalance)
                    )
                  ) : (
                    Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: conversionRate?.code || user?.currency?.code,
                      ...(asset.totalValue > 9999999 && {
                        notation: "compact",
                      }),
                    }).format(
                      conversionRate?.rate
                        ? asset.totalValue * conversionRate.rate
                        : asset.totalValue
                    )
                  )}
                </span>
              </div>

              {i === 0 && combinedAssets.length > 1 && (
                <div className="w-px h-6 bg-border"></div>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-around text-center">
        {[
          {
            label: "Deposit",
            icon: PlusCircle,
            onClick: () => {
              setTypeOfDeposit("Wallet");
              setOpenDepositDrawer(true);
            },
          },
          {
            label: "Send",
            icon: SendHorizontal,
            onClick: () => {
              setIsFundAccount(false);
              setOpenSendCryptoDrawer(true);
            },
          },
          {
            label: "NFTs",
            icon: Box,
            onClick: () => router.push("/wallet/nfts"),
          },
          {
            label: "Fund",
            icon: CircleDollarSign,
            onClick: () => {
              setIsFundAccount(true);
              setOpenSendCryptoDrawer(true);
            },
          },
        ].map(({ label, icon: Icon, onClick }) => (
          <div
            key={label}
            onClick={onClick}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <Button
              size="icon"
              className="rounded-full bg-[#009a4c] text-white h-14 w-14"
            >
              <Icon className="size-8" />
            </Button>
            <span className="text-xs font-semibold">{label}</span>
          </div>
        ))}
      </div>

      {/* Portfolio */}
      <div>
        <div className="flex justify-between px-2 mb-2">
          <span className="font-semibold text-sm">My Portfolio</span>
          <Link href={"/wallet/assets"}>
            <span className="text-sm cursor-pointer">See all</span>
          </Link>
        </div>

        <ScrollArea className="flex gap-4 w-full overflow-x-auto px-0">
          {combinedAssets &&
            combinedAssets.length > 0 &&
            combinedAssets?.slice(0, 4).map((asset, index) => (
              <div
                key={index}
                className="relative min-w-[70%] rounded-xl bg-zinc-100 dark:bg-zinc-900 p-4 overflow-hidden"
              >
                <Image
                  src={asset.image}
                  alt=""
                  width={100} // retina-ready (1.5x of visual size)
                  height={100} // retina-ready
                  sizes="(max-width: 640px) 60px, (max-width: 1024px) 80px, 100px" // responsive display sizes
                  priority={false} // lazy-load since non-critical
                  className="size-25 absolute top-0 -right-7 opacity-10 rotate-[-50deg] object-cover"
                />

                <div className="flex items-center gap-3">
                  <Image
                    src={asset.image ?? "/placeholder.png"}
                    alt=""
                    width={60}
                    height={60}
                    sizes="48px"
                    priority={false}
                    className="size-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm">
                      {user?.isManualAssetMode
                        ? Number(asset.Manualbalance).toFixed(2)
                        : Number(asset.balance).toFixed(2)}{" "}
                      {asset.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-xl font-semibold">
                  {user?.isManualAssetMode ? (
                    <div>
                      {coinPriceLoading ? (
                        <Skeleton className="h-6 w-24 bg-gray-500/50" />
                      ) : conversionRate?.rate ? (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate?.code,
                          ...(asset?.ManualFiatbalance * conversionRate?.rate >
                          999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(
                          asset?.ManualFiatbalance * conversionRate?.rate
                        )
                      ) : (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(asset?.ManualFiatbalance > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(asset?.ManualFiatbalance)
                      )}
                    </div>
                  ) : (
                    <div>
                      {coinPriceLoading ? (
                        <Skeleton className="h-6 w-24 bg-gray-500/50" />
                      ) : conversionRate?.rate ? (
                        allCoins[0]?.quotes?.[
                          user?.currency?.code.toUpperCase() ?? ""
                        ] ? (
                          Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate?.code,
                            ...(asset?.totalValue * conversionRate?.rate >
                            999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(asset?.totalValue * conversionRate?.rate)
                        ) : (
                          "UNAVAILABLE"
                        )
                      ) : allCoins[0]?.quotes?.[
                          user?.currency?.code.toUpperCase() ?? ""
                        ] ? (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(asset?.totalValue > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(asset?.totalValue)
                      ) : (
                        "UNAVAILABLE"
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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

      {/* DEPOSIT DRAWER */}
      <Drawer
        open={openDepositDrawer}
        onOpenChange={setOpenDepositDrawer}
        direction={size.width && size.width < 1024 ? "bottom" : "right"}
      >
        <DrawerContent
          className="w-full! lg:w-lg lg:max-w-md! min-h-[95%]! xs:min-h-[95%]! h-full lg:h-full! rounded-3xl! lg:rounded-none!"
          showHandle={false}
        >
          <VisuallyHidden>
            <DialogTitle>Deposit Funds</DialogTitle>
          </VisuallyHidden>

          <ScrollArea className="h-full overflow-y-auto">
            {openDepositDrawer && <DepositComponent />}
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* SEND CRYPTO DRAWER */}
      <Drawer
        open={openSendCryptoDrawer}
        onOpenChange={setOpenSendCryptoDrawer}
        direction={size.width && size.width < 1024 ? "bottom" : "right"}
      >
        <DrawerContent
          className="w-full! lg:w-lg lg:max-w-md! min-h-[95%]! xs:min-h-[95%]! h-full lg:h-full! rounded-3xl! lg:rounded-none!"
          showHandle={false}
        >
          <VisuallyHidden>
            <DialogTitle>Send Crypto</DialogTitle>
          </VisuallyHidden>

          <ScrollArea className="h-full overflow-y-auto">
            {openSendCryptoDrawer && <SendCryptoComponent />}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default WalletLeft;
