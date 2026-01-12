"use client";

import { useEffect, useMemo, useState } from "react";
import {
  History,
  X,
  ChevronLeft,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { useWalletAddress } from "@/hooks/useWalletAddress";
import { useCurrentUser } from "@/hooks/useAuth";
import { DrawerClose } from "../ui/drawer";
import Image from "next/image";
import { Card } from "../ui/card";

import { DepositSkeleton } from "../skeletonComponents/DepositSkeleton";
import AmountToDeposit from "./AmountToDeposit";
import { WalletAddressType } from "@/types";
import MakeTheDepositNow from "./MakeTheDepositNow";
import DepositHistory from "./DepositHistory";
import RequestDetails from "./RequestDetails";
import AllWalletAddress from "./AllWalletAddress";

export default function DepositComponent() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const { allWalletAddress, isLoading, refetch, isRefetching } =
    useWalletAddress();
  // console.log(allWalletAddress);
  const { data: user } = useCurrentUser();
  const [selectedView, setSelectedView] = useState(1);
  const [Wallet, setWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<WalletAddressType | null>(
    null
  );

  const sortedWallets = useMemo(() => {
    if (!Array.isArray(allWalletAddress)) return [];

    return [...allWalletAddress]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .slice(0, 4);
  }, [allWalletAddress]);

  if (pageLoading || isLoading || isRefetching) {
    return <DepositSkeleton type="Deposit Funds" />;
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedView(4)}
          >
            <History className="size-5!" />
          </Button>

          <h2 className="font-semibold">Deposit Funds</h2>

          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>

        <Separator />

        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm text-muted-foreground">Total Deposit</p>
            <p className="font-medium">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: user?.currency?.code,
              }).format(user?.totalDeposit || 0)}
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedView(4)}
            >
              <History className="h-4 w-4" />
              History
            </Button>
          </div>
        </div>

        {/* select the deposit wallet */}
        <div className="space-y-2">
          {sortedWallets.map((wallet) => (
            <Card
              key={wallet._id}
              onClick={() => {
                setWallet(wallet?.walletName);
                setWalletAddress(wallet);
                setSelectedView(2);
              }}
              className={`flex flex-row items-center justify-between px-4 py-4 mx-3 cursor-pointer bg-secondary/50 border-none`}
            >
              {/* Left */}
              <div className="flex items-center gap-2 ">
                <Image
                  src={wallet?.walletPhoto}
                  alt={wallet?.walletName}
                  width={40}
                  height={40}
                  className="rounded-[10px] bg-white p-px"
                />

                <span className="text-[18px] font-semibold w-50 truncate">
                  {wallet?.walletName} Deposit
                </span>
              </div>

              {/* Right Icon */}
              <ChevronRight className="size-6" />
            </Card>
          ))}

          {["Request Details", "All Deposit Methods"].map((deposit) => (
            <Card
              key={deposit}
              onClick={() => {
                if (deposit === "Request Details") {
                  setWallet("Bank");
                  setSelectedView(2);
                } else {
                  setSelectedView(6);
                }
              }}
              className={`flex flex-row items-center justify-between px-4 py-4 mx-3 cursor-pointer bg-secondary/50 border-none
     
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
                  width={40}
                  height={40}
                  className="rounded-[10px] bg-white "
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

      {/* ============== Enter Amount to Deposit View 2  ==============*/}
      <div
        className={`h-full
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 2 ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {selectedView === 2 && (
          <AmountToDeposit
            Wallet={Wallet}
            walletAddress={walletAddress}
            setSelectedView={setSelectedView}
          />
        )}
      </div>

      {/* ============== Make the Deposit Now with wallet details  ==============*/}
      <div
        className={`h-full
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 3 ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {selectedView === 3 && (
          <MakeTheDepositNow
            Wallet={Wallet}
            setSelectedView={setSelectedView}
          />
        )}
      </div>

      {/* ============== Depost History ============== */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 4 ? "opacity-100 visible" : "opacity-0 invisible"}
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
          <h2 className="font-semibold">Deposit History</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>
        <Separator />
        {selectedView === 4 && <DepositHistory />}
      </div>

      {/* ============== Request deposit detail ============== */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-300
          ${selectedView === 5 ? "opacity-100 visible" : "opacity-0 invisible"}
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
          <h2 className="font-semibold">Request Details</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>
        <Separator />

        {selectedView === 5 && <RequestDetails />}
      </div>

      {/* ============== All Deposit Method  ============== */}
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
            setWallet={setWallet}
            setWalletAddress={setWalletAddress}
            setSelectedView={setSelectedView}
          />
        )}
      </div>
    </div>
  );
}
