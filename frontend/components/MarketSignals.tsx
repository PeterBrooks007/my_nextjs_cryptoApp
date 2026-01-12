import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { RefreshCcw, SearchIcon, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";
import { TradingBotType } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { useCurrentUser } from "@/hooks/useAuth";
import { Drawer, DrawerContent } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import DepositComponent from "./depositComponents/DepositComponent";
import useWindowSize from "@/hooks/useWindowSize";
import { useTradingSignals } from "@/hooks/useTradingSignals";

const MarketSignals = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const { data: user } = useCurrentUser();
  const size = useWindowSize();

  const { allTradingSignals, isLoading, error, refetch, isRefetching } =
    useTradingSignals();

  const [selectedSignal, setselectedSignal] = useState<TradingBotType | null>(
    null
  );

  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);

  const [openViewSignal, setOpenViewSignal] = useState(false);

  const [signalList, setSignalList] =
    useState<TradingBotType[]>(allTradingSignals);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllSignals = Array.isArray(signalList)
    ? signalList.filter(
        (matketSignal) =>
          matketSignal.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(matketSignal.dailyTrades)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(matketSignal.price)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          matketSignal.winRate
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allTradingSignals.length !== 0) {
        setSignalList(allTradingSignals);
      }
    }, 0);
  }, [allTradingSignals]);

  if (error) {
    return (
      <p>
        Error fetching data, retry{" "}
        <Button disabled={isRefetching} onClick={() => refetch()}>
          {isRefetching && <Spinner />}
          retry
        </Button>
      </p>
    );
  }

  if (pageLoading || isLoading) {
    return (
      <div className="flex w-full max-w-6xl  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <Card className="relative">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
          <div>
            <CardTitle className="text-2xl">Welcome to the Market!</CardTitle>
            <CardDescription className="text-base">
              Purchase various trading signals with 99% winning assurance.
            </CardDescription>
          </div>

          <div className=" flex gap-2 w-full sm:w-75  h-9">
            <InputGroup>
              <InputGroupInput
                placeholder="Search Signal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
            <Button variant={"outline"} onClick={() => refetch()}>
              {isRefetching ? <Spinner /> : <RefreshCcw />}
              <span className="hidden sm:flex">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {allTradingSignals && allTradingSignals.length > 0 ? (
            filteredAllSignals.map((bot: TradingBotType, index: number) => (
              <div key={bot?._id}>
                <div className="relative">
                  {/* Top Controls */}
                  <div className="absolute top-0 left-0 right-0 p-1 flex justify-between items-start">
                    {/* Index Bubble */}

                    <Badge className="text-white bg-black/40 text-sm">
                      {index + 1}
                    </Badge>

                    {/* View Button */}
                    <div className="flex justify-end">
                      <Button
                        size={"sm"}
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => {
                          setselectedSignal(bot);
                          setOpenViewSignal(true);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="h-45 sm:h-92.5 md:h-62.5">
                    <Image
                      src={bot?.photo}
                      alt={bot?.name || ""}
                      width={300} // retina-ready intrinsic width
                      height={300} // retina-ready intrinsic height
                      sizes="(max-width: 640px) 150px, (max-width: 1024px) 250px, 250px" // rendered sizes
                      priority={false} // lazy-load
                      className="w-full h-full rounded-[10px] object-cover object-top border border-gray-400"
                    />
                  </div>
                </div>

                {/* Name */}
                <p className="whitespace-nowrap overflow-hidden text-ellipsis text-orange-400 font-semibold">
                  {bot?.name}
                </p>

                {/* Profit Share */}
                <div className="flex gap-1">
                  <p className="font-bold"> Daily Trades:</p>
                  <p>{bot?.dailyTrades}</p>
                </div>

                {/* Win rate */}
                <div className="flex gap-1">
                  <p className="font-bold">Win rate:</p>
                  <p>{bot?.winRate}</p>
                </div>

                {/* price rate */}
                <div className="flex gap-1 text-green-400">
                  <p className="font-bold">Price:</p>
                  <p className="font-bold">
                    {" "}
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code || "USD",
                      ...(bot?.price > 99999 ? { notation: "compact" } : {}),
                    }).format(bot?.price)}{" "}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 flex flex-col gap-2 items-center">
              <XCircle className="size-12" />
              <p className="text-xl">No Data Available</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Screenshot Dialog */}
      <Dialog open={openViewSignal} onOpenChange={setOpenViewSignal}>
        <DialogContent className="sm:max-w-112.5 max-h-[90%] overflow-auto p-0 bg-secondary">
          <VisuallyHidden>
            <DialogTitle>Hidden Title</DialogTitle>
          </VisuallyHidden>

          <div className="relative w-full h-full p-2">
            <div className="relative">
              <Image
                src={selectedSignal?.photo || "/qrCode_placeholder.jpg"}
                alt={selectedSignal?.name || "image"}
                width={200}
                height={200}
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 300px" // rendered sizes
                className="w-full border border-gray-500 rounded-md"
              />
              <div className="absolute bottom-0 left-0 bg-black/70 px-2 rounded-tr-xl">
                <p className="text-2xl font-semibold">
                  {" "}
                  {selectedSignal?.name}
                </p>
              </div>
            </div>

            <div className="absolute top-3 left-3 ">
              <Button
                className="rounded"
                onClick={() => {
                  setOpenDepositDrawer(true);
                }}
              >
                Buy Now
              </Button>
            </div>

            <div className="px-1 mt-2">
              {/* price rate */}
              <div className="flex gap-1 text-base sm:text-xl text-green-400">
                <p className="font-bold">Price:</p>
                <p className="font-bold">
                  {" "}
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code || "USD",
                    ...((selectedSignal?.price || 0) > 99999
                      ? { notation: "compact" }
                      : {}),
                  }).format(selectedSignal?.price || 0)}{" "}
                </p>
              </div>

              {/* Win rate */}
              <div className="flex gap-1 mt-1">
                <p className="font-bold">Win rate:</p>
                <p>{selectedSignal?.winRate}</p>
              </div>

              {/* Profit Share */}
              <div className="flex gap-1 mt-1 mb-2">
                <p className="font-bold"> Daily Trades:</p>
                <p>{selectedSignal?.dailyTrades}</p>
              </div>

              <Separator />

              <div className="flex gap-1 mt-2">
                <p className="font-bold">Info: {selectedSignal?.comment}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DEPOSIT DRAWER */}
      <Drawer
        open={openDepositDrawer}
        onOpenChange={setOpenDepositDrawer}
        direction={size.width && size.width < 1024 ? "bottom" : "right"}
      >
        <DrawerContent
          className="w-full! lg:w-lg lg:max-w-md! min-h-[95%]! xs:min-h-[95%]! h-full lg:h-full! rounded-3xl! lg:rounded-none!"
          showHandle={false}
        >
          <VisuallyHidden>
            <DialogTitle>Deposit Funds</DialogTitle>
          </VisuallyHidden>

          <ScrollArea className="h-full overflow-y-auto">
            <DepositComponent />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </Card>
  );
};

export default MarketSignals;
