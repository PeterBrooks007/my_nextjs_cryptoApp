import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import { SearchIcon } from "lucide-react";
import { shortenText } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { ConnectWalletsType } from "@/types";

type AllConnectWalletsProps = {
  setWalletAddress: Dispatch<SetStateAction<ConnectWalletsType | null>>;
  setSelectedView: Dispatch<SetStateAction<number>>;
  allConnectWallets: ConnectWalletsType[];
};

const AllConnectWallets = ({
  setWalletAddress,
  setSelectedView,
  allConnectWallets,
}: AllConnectWalletsProps) => {
  const sortedAllWallets = allConnectWallets
    ?.slice()
    .sort(
      (a: ConnectWalletsType, b: ConnectWalletsType) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const [searchTerm, setSearchTerm] = useState("");

  const filteredWallets = Array.isArray(sortedAllWallets)
    ? sortedAllWallets.filter((wallet) =>
        wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
              setWalletAddress(wallet);
              setSelectedView(2);
            }}
            className=" flex flex-col items-center gap-0
              rounded-lg p-1 bg-muted/70 hover:bg-muted/50 transition cursor-pointer
            "
          >
            <div className="rounded-md p-1">
              <Image
                src={wallet.photo ?? null}
                alt={wallet.name}
                width={60}
                height={60}
                sizes="56px"
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

export default AllConnectWallets;
