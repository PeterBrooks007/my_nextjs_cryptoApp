import React, { memo, useState } from "react";
import { Card } from "./ui/card";
import CryptoBox from "./CryptoBox";
import { useCoingeckoCoins } from "@/hooks/useCoingeckoCoins";
import { Drawer, DrawerContent } from "./ui/drawer";
import { DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import CoinDetailsDrawer from "./CoinDetailsDrawer";
import useWindowSize from "@/hooks/useWindowSize";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CoinGeckoCoin } from "@/types";

const TopCryptocurrencies = () => {
  const { allCoins } = useCoingeckoCoins();
  const [openCoinDetailsDrawer, setCoinDetailsDrawer] = useState(false);
  const [singleCoinDetails, setSingleCoinDetails] =
    useState<CoinGeckoCoin | null>(null);

  const size = useWindowSize();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card
        className="border rounded-md w-full h-37 sm:h-40 p-0 bg-secondary/50 "
        onClick={() => {
          setSingleCoinDetails(allCoins[0]);
          setCoinDetailsDrawer(true);
        }}
      >
        <CryptoBox data={allCoins[0]} />
      </Card>
      <Card
        className="border rounded-md w-full h-37 sm:h-40 p-0  bg-secondary/50"
        onClick={() => {
          setSingleCoinDetails(allCoins[1]);
          setCoinDetailsDrawer(true);
        }}
      >
        <CryptoBox data={allCoins[1]} />
      </Card>
      <Card
        className="border rounded-md w-full h-37 sm:h-40 p-0  bg-secondary/50"
        onClick={() => {
          setSingleCoinDetails(allCoins[2]);
          setCoinDetailsDrawer(true);
        }}
      >
        <CryptoBox data={allCoins[2]} />
      </Card>
      <Card
        className="border rounded-md w-full h-37 sm:h-40 p-0  bg-secondary/50"
        onClick={() => {
          setSingleCoinDetails(allCoins[3]);
          setCoinDetailsDrawer(true);
        }}
      >
        <CryptoBox data={allCoins[3]} />
      </Card>

      {/* COINDETAILS DRAWER */}
      <Drawer
        open={openCoinDetailsDrawer}
        onOpenChange={setCoinDetailsDrawer}
        direction={size.width && size.width < 1024 ? "bottom" : "right"}
      >
        <DrawerContent
          className="w-full! lg:w-lg lg:max-w-md! min-h-[70%]! xs:min-h-[65%]! h-[70%] xs:h-[65%] lg:h-full! rounded-3xl! lg:rounded-none! outline-none!"
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

export default memo(TopCryptocurrencies);
