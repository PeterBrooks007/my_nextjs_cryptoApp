"use client";

import Image from "next/image";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";
import { CoinGeckoCoin } from "@/types";
import TradableCryptoAssets from "./TradableCryptoAssets";
import { Card } from "./ui/card";
import { useConversionRateStore } from "@/store/conversionRateStore";
import { Drawer, DrawerContent } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import CoinDetailsDrawer from "./CoinDetailsDrawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import { DialogTitle } from "./ui/dialog";

interface TradablesProps {
  filteredAllCoins: CoinGeckoCoin[];
}

const Tradables = ({ filteredAllCoins }: TradablesProps) => {
  const { data: user } = useCurrentUser();

  const size = useWindowSize();

  const { conversionRate } = useConversionRateStore();

  const [openCoinDetailsDrawer, setCoinDetailsDrawer] = useState(false);
  const [singleCoinDetails, setSingleCoinDetails] =
    useState<CoinGeckoCoin | null>(null);

  const firstSix = Array.isArray(filteredAllCoins)
    ? filteredAllCoins.slice(0, 6)
    : [];

  return (
    <div className="flex flex-col gap-8">
      {/* ================= Top Crypto ================= */}
      <div className="flex flex-col">
        <h3 className="pl-2 pb-1 text-sm font-medium">Top Crypto 🔥</h3>

        <div className="flex gap-4 overflow-x-auto p-1">
          {firstSix.map((data, index) => {
            const isNegative = data?.price_change_percentage_24h < 0;

            return (
              <Card
                key={index}
                onClick={() => {
                  setSingleCoinDetails(data);
                  setCoinDetailsDrawer(true);
                }}
                className="flex h-30 min-w-[40%] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl "
              >
                {/* Coin name */}
                <div className="flex items-center gap-2">
                  <Image
                    src={data?.image}
                    alt={data?.name}
                    width={50}
                    height={50}
                    sizes="24px"
                    className="size-6 rounded-full bg-white border"
                  />
                  <span className="text-sm font-medium uppercase">
                    {data?.symbol}
                  </span>
                </div>

                {/* Price change */}
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    isNegative ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {isNegative ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                  {Number(data?.price_change_percentage_24h).toFixed(2)}%
                </div>

                {/* Price */}
                <span className="text-sm font-semibold">
                  {conversionRate?.rate
                    ? Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate.code,
                        ...(data?.current_price * conversionRate.rate >
                        9_999_999
                          ? { notation: "compact" }
                          : {}),
                      }).format(data?.current_price * conversionRate.rate)
                    : Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(data?.current_price > 9_999_999
                          ? { notation: "compact" }
                          : {}),
                      }).format(data?.current_price)}
                </span>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ================= Tradable Cryptos ================= */}
      <div className="flex flex-col gap-2">
        <div className="mx-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold">Tradable Cryptos</span>
          </div>
          <ArrowRight size={18} />
        </div>

        <Card className="flex flex-col gap-3 rounded-2xl p-0 pt-0 lg:pt-2 pb-2">
          <TradableCryptoAssets filteredAllCoins={filteredAllCoins}  />
        </Card>
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
    </div>
  );
};

export default Tradables;
