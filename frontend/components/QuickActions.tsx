import { useCurrentUser } from "@/hooks/useAuth";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import CopyTrader from "./CopyTrader";
import { Button } from "./ui/button";
import { useState } from "react";
import Link from "next/link";
import TradingBots from "./TradingBots";
import MarketSignals from "./MarketSignals";
import GiftsRewards from "./GiftsRewards";
import CardComponentDrawer from "./CardComponentDrawer";
import { useTradingModeStore } from "@/store/tradingModeStore";

const QuickActions = () => {
  const { data: user } = useCurrentUser();
  const { setTradingModeStore } = useTradingModeStore();

  const [openCopyTrader, setOpenCopyTrader] = useState(false);
  const [openTradingBot, setOpenTradingBot] = useState(false);
  const [openMarketSignals, setOpenMarketSignals] = useState(false);
  const [openRewards, setOpenReward] = useState(false);
  const [openCardDrawer, setOpenCardDrawer] = useState(false);

  return (
    <Card className={`mt-1 rounded-md py-2  bg-secondary/50`}>
      <div className="grid grid-cols-4 gap-y-6 gap-x-3 text-center">
        {/* Wallet */}
        <Link href={"/wallet"}>
          <div className="flex flex-col gap-1 items-center cursor-pointer">
            <Image
              src="/svgIcons/walletSvgIcon.svg"
              alt="total deposit icon"
              width={36}
              height={36}
              className=""
              unoptimized
            />
            <p className="text-[12px] font-semibold -mt-1">Wallet</p>
          </div>
        </Link>

        {/* Demo */}
        <Link
          href="/dashboard/livetrades"
          onClick={() => setTradingModeStore("Demo")}
        >
          <div className="flex flex-col gap-1 items-center cursor-pointer">
            <Image
              src="/svgIcons/demoSvgIcon.svg"
              alt="total deposit icon"
              width={36}
              height={36}
              className=""
              unoptimized
            />
            <p className="text-[12px] font-semibold -mt-1">Demo</p>
          </div>
        </Link>

        {/* Card */}

        <div
          className="flex flex-col gap-1 items-center cursor-pointer"
          onClick={() => setOpenCardDrawer(true)}
        >
          <Image
            src="/svgIcons/cardSvgIcon.svg"
            alt="total deposit icon"
            width={36}
            height={36}
            className=""
            unoptimized
          />
          <p className="text-[12px] font-semibold -mt-1">Card</p>
        </div>

        {/* Rewards */}
        <div
          className=" flex flex-col gap-1 items-center cursor-pointer"
          onClick={() => setOpenReward(true)}
        >
          <div className="relative inline-block">
            <Badge className="absolute -top-1 -right-3 h-5 min-w-5 rounded-full px-1 tabular-nums opacity-100  pointer-events-none">
              {user?.giftRewards?.length}
            </Badge>
            <Image
              src="/svgIcons/giftSvgIcon.svg"
              alt="total deposit icon"
              width={36}
              height={36}
              className="mx-auto"
              unoptimized
            />
          </div>
          <p className="text-[12px] font-semibold">Rewards</p>
        </div>

        {/* Referral */}
        <div
          className="flex flex-col gap-1 items-center cursor-pointer"
          // onClick={handleOpenReferralDrawer}
        >
          <Image
            src="/svgIcons/inviteSvgIcon.svg"
            alt="total deposit icon"
            width={36}
            height={36}
            className="mx-auto"
            unoptimized
          />
          <p className="text-[12px] font-semibold -mt-1">Referral</p>
        </div>

        {/* Copy Trade */}
        <div
          className="flex flex-col gap-1 items-center cursor-pointer"
          onClick={() => setOpenCopyTrader(true)}
        >
          <div className="relative inline-block">
            <Badge className="absolute -top-2 -right-3 px-1">new</Badge>
            <Image
              src="/svgIcons/copySvgIcon.svg"
              alt="total deposit icon"
              width={36}
              height={36}
              className="mx-auto"
              unoptimized
            />
          </div>
          <p className="text-[12px] font-semibold">CopyTrade</p>
        </div>

        {/* Trading Bot */}
        <div
          className="flex flex-col gap-1 items-center cursor-pointer"
          onClick={() => setOpenTradingBot(true)}
        >
          <Image
            src="/svgIcons/botSvgIcon.svg"
            alt="total deposit icon"
            width={36}
            height={36}
            className="mx-auto"
            unoptimized
          />
          <p className="text-[12px] font-semibold -mt-1">TradingBot</p>
        </div>

        {/* Signals */}
        <div
          className="flex flex-col gap-1 items-center cursor-pointer"
          onClick={() => setOpenMarketSignals(true)}
        >
          <Image
            src="/svgIcons/signalSvgIcon.svg"
            alt="total deposit icon"
            width={36}
            height={36}
            className="mx-auto"
            unoptimized
          />
          <p className="text-[12px] font-semibold -mt-1">Signals</p>
        </div>
      </div>

      {/* CARD APPLICATION */}
      <Sheet open={openCardDrawer} onOpenChange={setOpenCardDrawer}>
        <SheetContent className="w-full max-w-md! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Card Application</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto px-2">
            {openCardDrawer && <CardComponentDrawer />}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* COPY TRADER SHEET  */}
      <Sheet open={openCopyTrader} onOpenChange={setOpenCopyTrader}>
        <SheetContent className="w-full! max-w-3xl! 2xl:max-w-6xl! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Copy Expert Trader</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openCopyTrader && (
              <div className="mx-0">
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
        <SheetContent className="w-full! max-w-3xl! 2xl:max-w-6xl! data-[state=closed]:duration-300 data-[state=open]:duration-300">
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
        <SheetContent className="w-full! max-w-3xl! 2xl:max-w-6xl! data-[state=closed]:duration-300 data-[state=open]:duration-300">
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
    </Card>
  );
};

export default QuickActions;
