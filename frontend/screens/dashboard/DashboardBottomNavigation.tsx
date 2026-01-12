"use client";

import { cn } from "@/lib/utils";
import { useTradingModeStore } from "@/store/tradingModeStore";
import {
  ArrowLeftRight,
  ChartNoAxesColumn,
  Home,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardBottomNavigation = () => {
  const pathname = usePathname();
  const { setTradingModeStore } = useTradingModeStore();

  const hidden = pathname === "/dashboard/livetradesssss";

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
        <div className="flex h-full items-center justify-center ">
          {/* Home */}
          <Link
            href="/dashboard"
            className="flex-1 flex justify-center items-center h-full transition-colors duration-150 active:bg-white/15 dark:active:bg-black/10"
          >
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 text-xs transition-color",
                pathname === "/dashboard"
                  ? "text-green-500"
                  : "text-white dark:text-[#111820]"
              )}
            >
              <Home className="h-7 w-7" />
              <span>Home</span>
            </button>
          </Link>

          {/* Prices */}
          <Link
            href="/dashboard/prices"
            className="flex-1 flex justify-center items-center h-full transition-colors duration-150 active:bg-white/15 dark:active:bg-black/10"
          >
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 text-xs transition-colors ",
                pathname === "/dashboard/prices"
                  ? "text-green-500"
                  : "text-white dark:text-[#111820]"
              )}
            >
              <ChartNoAxesColumn className="h-7 w-7" />
              <span>Prices</span>
            </button>
          </Link>

          {/* Trade (center button) */}
          <Link
            href="/dashboard/livetrades"
            className="flex-1 flex justify-center items-center h-full transition-all duration-150 active:scale-95 active:bg-white/10"
            onClick={() => setTradingModeStore("Live")}
          >
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
              <ArrowLeftRight className="h-10 w-10 border-2 border-white rounded-full p-1.5" />
            </button>
          </Link>

          {/* Wallet */}
          <Link
            href="/wallet"
            className="flex-1 flex justify-center items-center h-full transition-colors duration-150 active:bg-white/15 dark:active:bg-black/10"
          >
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 text-xs transition-colors",
                pathname === "/wallet/home"
                  ? "text-green-400"
                  : "text-white dark:text-[#111820]"
              )}
            >
              <Wallet className="h-7 w-7" />
              <span>Wallet</span>
            </button>
          </Link>

          {/* Profile */}
          <Link
            href="/dashboard/profile"
            className="flex-1 flex justify-center items-center h-full transition-colors duration-150 active:bg-white/15 dark:active:bg-black/10"
          >
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 text-xs transition-colors",
                pathname === "/dashboard/profile"
                  ? "text-green-500"
                  : "text-white dark:text-[#111820]"
              )}
            >
              <User className="h-7 w-7" />
              <span>Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardBottomNavigation;
