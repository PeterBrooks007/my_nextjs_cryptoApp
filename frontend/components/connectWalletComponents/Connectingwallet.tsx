"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Smartphone,
  Globe,
  RotateCw,
  Link,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConnectWalletsType } from "@/types";

type Props = {
  walletAddress: ConnectWalletsType | null;
  setSelectedView: (v: number) => void;
};

export default function ConnectingWallet({
  walletAddress,
  setSelectedView,
}: Props) {
  const [isConnecting, setIsConnecting] = useState(true);

  const [tabIndex, setTabIndex] = useState("Mobile");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConnecting) {
      timer = setTimeout(() => setIsConnecting(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [isConnecting]);

  return (
    <div className="flex flex-col gap-0 mt-4">
      {/* Tabs */}
      <div className="mx-auto flex rounded-full bg-muted p-1">
        {["Mobile", "Browser"].map((item) => {
          const active = tabIndex === item;
          return (
            <button
              key={item}
              onClick={() => setTabIndex(item)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition",
                active ? "bg-white text-black shadow" : "text-muted-foreground"
              )}
            >
              {item === "Mobile" ? (
                <Smartphone className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              {item}
            </button>
          );
        })}
      </div>

      {/* MOBILE TAB */}
      {tabIndex === "Mobile" && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <Image
            src={walletAddress?.photo ?? "qrCode_placeholder.jpg"}
            alt={walletAddress?.name ?? "wallet"}
            width={100}
            height={100}
            sizes="(max-width: 640px) 80px,  100px"
            className="size-25 rounded-2xl border"
          />

          <div className="flex flex-col items-center gap-1.5">
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                <p className="font-bold text-lg">Connecting...</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <X className="h-6 w-6" />
                <p className="font-bold text-base">Error Connecting...</p>
              </div>
            )}

            <p className="text-sm font-medium text-muted-foreground">
              Accept connection request in the wallet
            </p>

            <Button
              className="mt-2 rounded-full"
              disabled={isConnecting}
              onClick={() => setIsConnecting(true)}
            >
              <RotateCw className="h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="ghost"
              disabled={isConnecting}
              onClick={() => setSelectedView(3)}
              className="mt-3 rounded-full"
            >
              <Link className="h-5 w-5" />
              Connect Manually
            </Button>
          </div>

          {/* Get Wallet */}
          <div className="mt-2 flex w-[90%] items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
            <p className="text-sm">Don&apos;t have {walletAddress?.name}?</p>

            <div className="flex items-center gap-1 rounded-lg bg-muted/80 px-3 py-1">
              <span className="text-sm text-muted-foreground">Get</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      )}

      {/* BROWSER TAB */}
      {tabIndex === "Browser" && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <Image
            src={walletAddress?.photo ?? "qrCode_placeholder.jpg"}
            alt={walletAddress?.name ?? "wallet"}
            width={100}
            height={100}
            className="rounded-2xl border"
          />

          <div className="flex items-center gap-2 text-red-500">
            <X className="h-6 w-6" />
            <p className="font-bold text-base">Not Detected</p>
          </div>

          <Button variant="ghost" onClick={() => setSelectedView(3)}>
            <Link className="mr-2 h-4 w-4" />
            Connect Manually
          </Button>
        </div>
      )}
    </div>
  );
}
