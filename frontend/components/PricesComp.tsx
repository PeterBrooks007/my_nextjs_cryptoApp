"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopBar from "./TopBar";
import Tradable from "./Tradables";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { SearchIcon } from "lucide-react";
import { useCoingeckoCoins } from "@/hooks/useCoingeckoCoins";
import { useEffect, useState } from "react";
import { CoinGeckoCoin } from "@/types";
import Favourite from "./Favourite";
import All from "./All";

const NftsComp = () => {
  const { allCoins } = useCoingeckoCoins();

  const [allCoinsNow, setAllCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(allCoinsNow)
    ? allCoinsNow.filter(
        (allCoin: CoinGeckoCoin) =>
          allCoin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          allCoin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    setAllCoins(allCoins);
  }, [allCoins]);

  return (
    <div className="flex w-full max-w-full flex-col">
      <div className="pb-5 pt-2">
        <TopBar />
      </div>

      <div className="mb-4">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <Tabs defaultValue="Tradables">
        <TabsList className="w-full">
          <TabsTrigger value="Tradables">Tradables</TabsTrigger>
          <TabsTrigger value="Favourites">Favourites</TabsTrigger>
          <TabsTrigger value="All">All Coins </TabsTrigger>
        </TabsList>

        <TabsContent value="Tradables" className="mt-3">
          <Tradable filteredAllCoins={filteredAllCoins} />
        </TabsContent>

        <TabsContent value="Favourites" className="mt-3">
          <Favourite filteredAllCoins={[]} />
        </TabsContent>

        <TabsContent value="All" className="mt-3">
          <All filteredAllCoins={filteredAllCoins} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NftsComp;
