import React from "react";
import { Separator } from "./ui/separator";
import SymbolOverviewWidget from "./TradeviewWidgets/SymbolOverviewWidget";
import CryptoMarketWidget from "./TradeviewWidgets/CryptoMarketWidget";

const WalletRight = () => {
  return (
    <div className="flex h-full flex-col gap-6 w-full">
      {/* Symbol Overview */}
      <div className="flex-1">
        <SymbolOverviewWidget />
      </div>

      <Separator />

      {/* Crypto Market */}
      <div className="flex-[1.5] h-full rounded-lg border bg-background">
        <CryptoMarketWidget />
      </div>
    </div>
  );
};

export default WalletRight;
