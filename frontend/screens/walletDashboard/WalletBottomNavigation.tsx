"use client";

import ConnectWalletComponent from "@/components/connectWalletComponents/ConnectWalletComponent";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Box, ChartPie, Coins, Home, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import useWindowSize from "@/hooks/useWindowSize";

const WalletBottomNavigation = () => {
  const pathname = usePathname();
  const size = useWindowSize();

  const hidden = pathname === "/dashboard/livetradesssss";

  const [openConnectWallet, setOpenConnectWallet] = useState(false);

  return (
    <>
      {/* MOBILE BOTTOM NAVIGATION */}
      <div
        className={cn(
          "fixed bottom-2.5 left-0 right-0 z-40 mx-auto h-16.25 w-[90%]",
          "rounded-2xl backdrop-blur-md transition-opacity duration-500",
          "lg:hidden bg-[rgba(11,18,20,0.9)] dark:bg-[rgba(255,255,255,0.9)]",

          hidden && "pointer-events-none opacity-0"
        )}
      >
        <div className="flex h-full items-center justify-between">
          {/* Home */}
          <Link
            href="/dashboard"
            className="flex-1 flex justify-center items-center h-full transition-colors duration-150 active:bg-white/15 dark:active:bg-black/10"
          >
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 text-xs transition-colors",
                pathname === "/dashboard"
                  ? "text-green-500"
                  : "text-white dark:text-[#111820]"
              )}
            >
              <Home className="h-7 w-7" />
              <span>Home</span>
            </button>
          </Link>

          {/* Portfolio */}
          <Link
            href="/wallet"
            className="flex-1 flex justify-center items-center h-full transition-colors duration-150 active:bg-white/15 dark:active:bg-black/10"
          >
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 text-xs transition-colors",
                pathname === "/wallet"
                  ? "text-green-500"
                  : "text-white dark:text-[#111820]"
              )}
            >
              <ChartPie className="h-7 w-7" />
              <span>Portfolio</span>
            </button>
          </Link>

          {/* Nfts */}
          <Link
            href="/wallet/nfts"
            className="flex-1 flex justify-center items-center h-full transition-colors duration-150 active:bg-white/15 dark:active:bg-black/10"
          >
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 text-xs transition-colors",
                pathname === "/wallet/nfts"
                  ? "text-green-500"
                  : "text-white dark:text-[#111820]"
              )}
            >
              <Box className="h-7 w-7" />
              <span>Nfts</span>
            </button>
          </Link>

          {/* Assets */}
          <Link
            href="/wallet/assets"
            className="flex-1 flex justify-center items-center h-full transition-colors duration-150 active:bg-white/15 dark:active:bg-black/10"
          >
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 text-xs transition-colors",
                pathname === "/wallet/assets"
                  ? "text-green-400"
                  : "text-white dark:text-[#111820]"
              )}
            >
              <Coins className="h-7 w-7" />
              <span>Assets</span>
            </button>
          </Link>

          {/* Connect */}
          <div
            className="flex-1 flex justify-center items-center h-full transition-colors duration-150 active:bg-white/15 dark:active:bg-black/10"
            onClick={() => setOpenConnectWallet(true)}
          >
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 text-xs transition-colors",
                pathname === ""
                  ? "text-green-500"
                  : "text-white dark:text-[#111820]"
              )}
            >
              <Wallet className="h-7 w-7" />
              <span>Connect</span>
            </button>
          </div>
        </div>

        {/* CONNECT WALLET SHEET  */}
        <Drawer
          open={openConnectWallet}
          onOpenChange={setOpenConnectWallet}
          direction={size.width && size.width < 1024 ? "bottom" : "right"}
        >
          <DrawerContent
            className="w-full! lg:w-lg lg:max-w-md! min-h-[80%]! xs:min-h-[70%]! h-full xs:h-full lg:h-full! rounded-3xl! lg:rounded-none!"
            showHandle={false}
          >
            <VisuallyHidden>
              <DialogTitle>Connect Wallet</DialogTitle>
            </VisuallyHidden>
            <ScrollArea className="h-full overflow-y-auto">
              {openConnectWallet && <ConnectWalletComponent />}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default WalletBottomNavigation;
