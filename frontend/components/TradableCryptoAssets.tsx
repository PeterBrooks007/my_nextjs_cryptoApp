"use client";

import Image from "next/image";
import { List, type RowComponentProps } from "react-window";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";
import { CoinGeckoCoin, ConversionRateType } from "@/types";
import { useConversionRateStore } from "@/store/conversionRateStore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Drawer, DrawerContent } from "./ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import useWindowSize from "@/hooks/useWindowSize";
import { DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import CoinDetailsDrawer from "./CoinDetailsDrawer";

interface TradableCryptoAssetsProps {
  filteredAllCoins: CoinGeckoCoin[];
}

type RowProps = {
  coins: CoinGeckoCoin[];
  conversionRate: ConversionRateType | null;
  setSingleCoinDetails: React.Dispatch<SetStateAction<CoinGeckoCoin | null>>;
  setCoinDetailsDrawer: Dispatch<SetStateAction<boolean>>;
};

/* ================= Row Component ================= */
function Row({
  index,
  style,
  coins,
  conversionRate,
  setSingleCoinDetails,
  setCoinDetailsDrawer,
}: RowComponentProps<RowProps>) {
  const coin = coins[index];
  const isLastItem = index === coins.length - 1;
  const isNegative = coin?.price_change_percentage_24h < 0;

  const { data: user } = useCurrentUser();

  return (
    <div
      style={{
        ...style,
        paddingBottom: isLastItem ? "156px" : "0",
        paddingTop: isLastItem ? "36px" : "0",
      }}
      className="flex cursor-pointer items-center justify-between px-4"
      onClick={() => {
        setSingleCoinDetails(coin);
        setCoinDetailsDrawer(true);
      }}
    >
      {/* ================= Left ================= */}
      <div className="flex items-center gap-3">
        <Image
          src={coin?.image}
          alt={coin?.name}
          width={50}
          height={50}
          sizes="44px"
          className="size-11 rounded-full bg-white border"
        />

        <div className="flex flex-col">
          <span className="text-sm font-medium">{coin?.name}</span>
          <span className="text-xs uppercase text-muted-foreground">
            {coin?.symbol}
          </span>
        </div>
      </div>

      {/* ================= Right ================= */}
      <div className="flex flex-col items-end">
        <span className="text-base font-semibold">
          {conversionRate?.rate
            ? Intl.NumberFormat("en-US", {
                style: "currency",
                currency: conversionRate.code,
                ...(coin?.current_price * conversionRate.rate > 9_999_999
                  ? { notation: "compact" }
                  : {}),
              }).format(coin?.current_price * conversionRate.rate)
            : Intl.NumberFormat("en-US", {
                style: "currency",
                currency: user?.currency?.code,
                ...(coin?.current_price > 9_999_999
                  ? { notation: "compact" }
                  : {}),
              }).format(coin?.current_price)}
        </span>

        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isNegative ? "text-red-500" : "text-green-500"
          }`}
        >
          {isNegative ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          {Number(coin?.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

export default function TradableCryptoAssets({
  filteredAllCoins,
}: TradableCryptoAssetsProps) {
  const { conversionRate } = useConversionRateStore();
  const size = useWindowSize();

  const [openCoinDetailsDrawer, setCoinDetailsDrawer] = useState(false);
  const [singleCoinDetails, setSingleCoinDetails] =
    useState<CoinGeckoCoin | null>(null);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  if (pageLoading) {
    return (
      <div className="h-[70vh] flex  w-full px-3 justify-between mt-3">
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-22 h-3 " />
              <Skeleton className="w-16 h-4 " />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="w-30 h-4" />
          <Skeleton className="w-15 h-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[70vh] overflow-auto">
      <List
        rowComponent={Row}
        rowCount={filteredAllCoins.length}
        rowHeight={70}
        rowProps={{
          coins: filteredAllCoins,
          conversionRate,
          setSingleCoinDetails,
          setCoinDetailsDrawer,
        }}
      />

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
    </div>
  );
}
