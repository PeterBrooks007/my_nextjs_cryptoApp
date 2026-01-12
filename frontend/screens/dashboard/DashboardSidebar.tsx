"use client";

import CopyTrader from "@/components/CopyTrader";
import GiftsRewards from "@/components/GiftsRewards";
import MarketSignals from "@/components/MarketSignals";
import TradingBots from "@/components/TradingBots";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import { shortenText } from "@/lib/utils";
import { useTradingModeStore } from "@/store/tradingModeStore";
import {
  Activity,
  Bot,
  ChartCandlestick,
  ChartLine,
  ChartNoAxesColumn,
  ChevronRight,
  CircleDollarSign,
  CircleQuestionMark,
  Copy,
  Gift,
  House,
  LogOut,
  Mail,
  Moon,
  Package,
  Shield,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ContactUs from "@/components/ContactUs";
import { useConversionRateStore } from "@/store/conversionRateStore";

const DashboardSidebar = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { isLoading, unreadMessages } = useTotalCounts();

  const [openCopyTrader, setOpenCopyTrader] = useState(false);
  const [openTradingBot, setOpenTradingBot] = useState(false);
  const [openMarketSignals, setOpenMarketSignals] = useState(false);
  const [openRewards, setOpenReward] = useState(false);
  const [openContactUs, setOpenContactUs] = useState(false);

  const { setTradingModeStore } = useTradingModeStore();

  const { mutate } = useLogout();
  const { resolvedTheme } = useTheme();

  const logoutUser = async () => {
    await mutate();

    //use timer so it first remove token completely before navigation to avoid _layout redirect glitch seen in the url
    setTimeout(() => {
      router.replace("/auth/login");
    }, 300);
  };

  const { conversionRate } = useConversionRateStore();

  return (
    <div className="h-full flex flex-col justify-between items-center overflow-auto">
      {/* Logo */}
      <div>
        <Image src={"/favicon_logo.png"} alt="logo" width={30} height={30} />
      </div>

      {/* Home */}
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/dashboard">
              <Button
                variant={"ghost"}
                size={"icon"}
                className="cursor-pointer"
              >
                <House className="size-6" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-sm">Home</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-5 px-1 py-4 bg-green-500/30 rounded-full">
          {/* Live Trade */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/livetrades"
                onClick={() => setTradingModeStore("Live")}
              >
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <ChartLine className="size-6" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Live Trades</p>
            </TooltipContent>
          </Tooltip>

          {/* Wallet */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/wallet">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <Wallet className="size-6" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Wallet</p>
            </TooltipContent>
          </Tooltip>

          {/* Prices */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/dashboard/prices">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <ChartNoAxesColumn className="size-6" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Prices</p>
            </TooltipContent>
          </Tooltip>

          {/* Copy Trade */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="cursor-pointer"
                onClick={() => setOpenCopyTrader(true)}
              >
                <Copy className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Copy Trade</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-5 px-1 py-4 bg-red-500/30 rounded-full">
          {/* Bot */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="cursor-pointer"
                onClick={() => setOpenTradingBot(true)}
              >
                <Bot className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Tradings Bots</p>
            </TooltipContent>
          </Tooltip>

          {/* Signal */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="cursor-pointer"
                onClick={() => setOpenMarketSignals(true)}
              >
                <Activity className="size-6" />{" "}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Trade Signals</p>
            </TooltipContent>
          </Tooltip>

          {/*  Demo Trade*/}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/livetrades"
                onClick={() => setTradingModeStore("Demo")}
              >
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <ChartCandlestick className="size-6" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Demo Trade</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Reward hub */}
      <div className="flex flex-col gap-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="relative inline-block"
              onClick={() => setOpenReward(true)}
            >
              <Badge className="absolute -top-1 -right-1.5 h-5 min-w-5 rounded-full px-1 tabular-nums opacity-100  pointer-events-none">
                {user?.giftRewards?.length}
              </Badge>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="cursor-pointer"
              >
                <Gift className="size-6" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-sm">Reward Hub</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="cursor-pointer"
              onClick={() => setOpenContactUs(true)}
            >
              <CircleQuestionMark className="size-6" />{" "}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-sm">Contact Support</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* User Avatar */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-10 cursor-pointer overflow-hidden">
              {user?.photo ? (
                <div className="relative size-10">
                  <Image
                    src={user.photo}
                    alt={`${user.firstname} ${user.lastname}`}
                    fill
                    sizes="40px"
                    className="object-cover rounded-full"
                  />
                </div>
              ) : (
                <AvatarFallback>
                  {user
                    ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`
                    : ""}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            sideOffset={10}
            align="end"
            className="min-w-80 w-80 md:w-100"
          >
            <div className="flex flex-col space-y-2">
              {/* Header */}
              <div className="flex items-center px-2 py-2">
                <div className="flex w-full items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <Avatar className="size-12 overflow-hidden">
                        {user?.photo ? (
                          <div className="relative size-12">
                            <Image
                              src={user.photo}
                              alt={`${user.firstname} ${user.lastname}`}
                              fill
                              sizes="48px"
                              className="object-cover rounded-full"
                            />
                          </div>
                        ) : (
                          <AvatarFallback>
                            {`${user?.firstname?.[0] ?? ""}${
                              user?.lastname?.[0] ?? ""
                            }`}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-base sm:text-xl font-semibold">
                        {user?.firstname + " " + user?.lastname}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {shortenText(user?.email || "", 30)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border border-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DropdownMenuItem>
                </div>
              </div>

              <Separator />

              {/* Account info */}
              <div className="flex flex-col px-2 py-2 space-y-3">
                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5" />
                    <span className="font-medium">Balance</span>
                  </div>
                  <span>
                    {conversionRate?.rate
                      ? Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate.code ?? "USD",
                          ...((user?.balance ?? 0) * conversionRate.rate >
                          9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format((user?.balance ?? 0) * conversionRate.rate)
                      : Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code ?? "USD",
                          ...((user?.balance ?? 0) > 9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(user?.balance ?? 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Account Type</span>
                  </div>
                  {user?.accounttype}
                </div>

                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">Package Plan</span>
                  </div>
                  {user?.package}
                </div>
              </div>

              <Separator />

              {/* Other actions */}
              <div className="flex flex-col px-4 py-2 space-y-3">
                {/* Messages */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => router.push("/admin/mailbox")}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">Message</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {isLoading ? (
                        <Spinner />
                      ) : unreadMessages > 0 ? (
                        unreadMessages
                      ) : (
                        0
                      )}
                    </span>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>

                {/* Theme toggle */}
                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    <span className="font-medium">Theme</span>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    // onClick={() => colorMode.toggleColorMode()}
                  >
                    <span className="text-sm">{resolvedTheme} mode</span>
                  </div>
                </div>

                {/* Profile */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="font-medium">My Profile</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>

              <Separator />

              {/* Logout */}
              <div
                className="flex items-center gap-2 px-4 py-2 text-red-600 cursor-pointer"
                onClick={logoutUser}
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* COPY TRADER SHEET  */}
      <Sheet open={openCopyTrader} onOpenChange={setOpenCopyTrader}>
        <SheetContent className="w-full! max-w-4xl! 2xl:max-w-6xl! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Copy Expert Trader</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openCopyTrader && (
              <div className="mx-4">
                <CopyTrader />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* TRADING BOT SHEET  */}
      <Sheet open={openTradingBot} onOpenChange={setOpenTradingBot}>
        <SheetContent className="w-full! max-w-4xl! 2xl:max-w-6xl! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Robotic Softwares</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openTradingBot && (
              <div className="mx-4">
                <TradingBots />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* MARKET SIGNAL SHEET  */}
      <Sheet open={openMarketSignals} onOpenChange={setOpenMarketSignals}>
        <SheetContent className="w-full! max-w-4xl! 2xl:max-w-6xl! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Market Signals</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openMarketSignals && (
              <div className="mx-4">
                <MarketSignals />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* REWARDS SHEET  */}
      <Sheet open={openRewards} onOpenChange={setOpenReward}>
        <SheetContent className="w-full! max-w-lg!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Rewards Hub</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openRewards && (
              <div className="mx-4">
                <GiftsRewards />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* CONTACT SUPPORT SHEET  */}
      <Sheet open={openContactUs} onOpenChange={setOpenContactUs}>
        <SheetContent className="w-full! max-w-lg!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Contact Us</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openContactUs && (
              <div className="mx-4">
                <ContactUs />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardSidebar;
