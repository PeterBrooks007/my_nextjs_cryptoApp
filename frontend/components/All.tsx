"use client";

import { CoinGeckoCoin } from "@/types";
import TradableCryptoAssets from "./TradableCryptoAssets";
import { Card } from "./ui/card";

interface TradablesProps {
  filteredAllCoins: CoinGeckoCoin[];
}

const All = ({ filteredAllCoins }: TradablesProps) => {
  return (
    <div className="flex flex-col gap-8">
      {/* ================= Favourite Cryptos ================= */}
      <div className="flex flex-col gap-2">
        <Card className="flex flex-col gap-3 rounded-2xl p-0 pt-0 lg:pt-2 pb-2">
          <TradableCryptoAssets filteredAllCoins={filteredAllCoins} />
        </Card>
      </div>
    </div>
  );
};

export default All;
