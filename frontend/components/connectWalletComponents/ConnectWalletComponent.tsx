"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, RefreshCcw, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { DrawerClose } from "../ui/drawer";
import Image from "next/image";
import { Card } from "../ui/card";

import { DepositSkeleton } from "../skeletonComponents/DepositSkeleton";
import { useConnectWallets } from "@/hooks/useConnectWallets";
import AllWalletAddress from "./AllWalletAddress";
import { ConnectWalletsType } from "@/types";
import Connectingwallet from "./Connectingwallet";
import ManualConnectWallet from "./ManualConnectWallet";

export default function ConnectWalletComponent() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const { allConnectWallets, isLoading, refetch, isRefetching } =
    useConnectWallets();

  const [selectedView, setSelectedView] = useState(1);
  const [walletAddress, setWalletAddress] = useState<ConnectWalletsType | null>(
    null
  );

  const sortedWallets = useMemo(() => {
    if (!Array.isArray(allConnectWallets)) return [];

    return [...allConnectWallets]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .slice(0, 5);
  }, [allConnectWallets]);

  if (pageLoading || isLoading || isRefetching) {
    return <DepositSkeleton type="Connect Wallet" />;
  }

  return (
    <div className="relative min-h-full w-full bg-transparent">
      {/* ============== Select Wallet View 1 =========== */}
      <div
        className={`pb-5
           transition-opacity duration-300 ${
             selectedView === 1 ? "opacity-100 visible" : "opacity-0 invisible"
           }
        `}
      >
        <div className="sticky top-0  bg-background rounded-3xl flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <RefreshCcw className="size-5!" />
          </Button>

          <h2 className="font-semibold">Connect Wallet</h2>

          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>

        <Separator />

        {/* select the deposit wallet */}
        <div className="space-y-2 mt-3">
          {sortedWallets.map((wallet) => (
            <Card
              key={wallet._id}
              onClick={() => {
                setWalletAddress(wallet);
                setSelectedView(2);
              }}
              className={`flex flex-row items-center justify-between p-2 mx-3 cursor-pointer bg-secondary/50 border-none`}
            >
              {/* Left */}
              <div className="flex items-center gap-2 ">
                <Image
                  src={wallet?.photo}
                  alt={wallet?.name}
                  width={60}
                  height={60}
                  sizes="(max-width: 640px) 44px,  44px"
                  className=" size-11 rounded-[10px] bg-white p-px"
                />

                <span className="text-[18px] font-semibold w-50 truncate">
                  {wallet?.name}
                </span>
              </div>

              {/* Right Icon */}
              <ChevronRight className="size-6" />
            </Card>
          ))}

          {["All Wallets"].map((deposit) => (
            <Card
              key={deposit}
              onClick={() => {
                if (deposit === "Request Details") {
                  setSelectedView(2);
                } else {
                  setSelectedView(6);
                }
              }}
              className={`flex flex-row items-center justify-between p-2 mx-3 cursor-pointer bg-secondary/50 border-none
     
    `}
            >
              {/* Left */}
              <div className="flex items-center gap-2 ">
                <Image
                  src={
                    deposit === "Request Details"
                      ? "/bank.png"
                      : "/wallet_connect.jpg"
                  }
                  alt={"bank"}
                  width={50}
                  height={50}
                  sizes="(max-width: 640px) 44px,  44px"
                  className=" size-11 rounded-[10px] bg-white p-px"
                />

                <span className="text-[18px] font-semibold w-50 truncate">
                  {deposit}
                </span>
              </div>

              {/* Right Icon */}
              <ChevronRight size={24} />
            </Card>
          ))}
        </div>
      </div>

      {/* ============== Connectingwallet View 2  ==============*/}
      <div
        className={`h-full
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 2 ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedView(1)}
          >
            <ChevronLeft className="size-5!" />
          </Button>
          <h2 className="font-semibold text-center">
            Connect {walletAddress?.name}
          </h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>

        <Separator />

        {selectedView === 2 && (
          <Connectingwallet
            walletAddress={walletAddress}
            setSelectedView={setSelectedView}
          />
        )}
      </div>

      {/* ============== ManualConnectWallet view 3  ==============*/}
      <div
        className={`h-full
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 3 ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedView(1)}
          >
            <ChevronLeft className="size-5!" />
          </Button>
          <h2 className="font-semibold text-center">
            Connect {walletAddress?.name}
          </h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>

        <Separator />

        {selectedView === 3 && (
          <ManualConnectWallet
            // Wallet={Wallet}
            walletAddress={walletAddress}
            // selectedView={selectedView}
            // setSelectedView={setSelectedView}
          />
        )}
      </div>

      {/* ============== All Wallet view 6  ============== */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 6 ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedView(1)}
          >
            <ChevronLeft className="size-5!" />
          </Button>
          <h2 className="font-semibold">All Wallets</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>
        <Separator />
        {selectedView === 6 && (
          <AllWalletAddress
            setWalletAddress={setWalletAddress}
            setSelectedView={setSelectedView}
            allConnectWallets={allConnectWallets}
          />
        )}
      </div>
    </div>
  );
}
