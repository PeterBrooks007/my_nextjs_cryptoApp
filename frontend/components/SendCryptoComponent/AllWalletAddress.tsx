import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import { SearchIcon } from "lucide-react";
import { shortenText } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { CoinpaprikaCoin, combinedAssetsTypes, UserAsset } from "@/types";
import { useCurrentUser } from "@/hooks/useAuth";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { Spinner } from "../ui/spinner";

type AllWalletAddressProps = {
  setWallet: Dispatch<SetStateAction<string | null>>;
  setWalletAddress: Dispatch<SetStateAction<combinedAssetsTypes | null>>;
  setSelectedView: Dispatch<SetStateAction<number>>;
};

const AllWalletAddress = ({
  setWallet,
  setWalletAddress,
  setSelectedView,
}: AllWalletAddressProps) => {
  const { data: user } = useCurrentUser();

  const {
    allCoins,
    isLoading: coinPriceLoading,
    // refetch,
  } = useCoinpaprika(user?.currency?.code);

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

  const [searchTerm, setSearchTerm] = useState("");

  const filteredWallets = Array.isArray(combinedAssets)
    ? combinedAssets.filter(
        (wallet) =>
          wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wallet.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (coinPriceLoading) {
    return (
      <div className="w-full flex justify-center mt-5">
        <Spinner className="size-7" />
      </div>
    );
  }

  return (
    <div className="mt-4 mx-1 space-y-4">
      {/* Search */}
      <div className="relative px-2">
        <InputGroup className="h-10">
          <InputGroupInput
            placeholder="Search Wallet"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Wallet Grid */}
      <div
        className="
          grid gap-4 p-2 overflow-auto
          grid-cols-4
        
        "
      >
        {filteredWallets.map((wallet) => (
          <div
            key={wallet._id}
            onClick={() => {
              setWallet(wallet?.name);
              setWalletAddress(wallet);
              setSelectedView(2);
            }}
            className=" flex flex-col items-center gap-0
              rounded-lg p-1 bg-muted hover:bg-muted/80 transition cursor-pointer
            "
          >
            <div className="rounded-md p-1">
              <Image
                src={wallet.image}
                alt={wallet.name}
                width={100}
                height={100}
                className="size-14 bg-white rounded-full"
              />
            </div>

            <span className="text-xs whitespace-nowrap">
              {shortenText(wallet.name, 10)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllWalletAddress;
