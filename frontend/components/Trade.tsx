import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, History, MoreVertical, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import Image from "next/image";
import TradeSection from "./TradeSection";
import { ScrollArea } from "./ui/scroll-area";
import { useTradeSettings } from "@/hooks/useTradeSettings";
import { ExchangeItemType } from "@/types";
import TradeHistory from "./TradeHistory";

const Trade = ({
  type,
  isQuickTrade,
}: {
  type?: string | undefined;
  isQuickTrade: boolean;
}) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const { allTradeSettings } = useTradeSettings();

  // console.log(allTradeSettings);

  const [openHistoryMenu, setOpenHistoryMenu] = useState(false);
  const [openTradeHistory, setOpenTradeHistory] = useState(false);

  const [openExcahnge, setOpenExchange] = useState(false);
  const [selectedExchange, setSelectedExchange] =
    useState<ExchangeItemType | null>(null);

  const [openSymbol, setOpenSymbol] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    // Clear selected value when exchange changes
    setTimeout(() => {
      setSelectedSymbol(null);
    }, 0);
  }, [selectedExchange?.tradingPairs]);

  if (pageLoading) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full px-0 gap-3">
      {/* Header */}
      {!isQuickTrade && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span
              className={cn(
                "px-2 text-sm font-semibold rounded-md",
                type?.toLowerCase() === "live"
                  ? "border border-green-500 text-green-500"
                  : "border border-red-500 text-red-500"
              )}
            >
              {type}
            </span>

            <p className="text-base">Trade Account</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Menu */}
            <Popover open={openHistoryMenu} onOpenChange={setOpenHistoryMenu}>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-42 p-0">
                <Button
                  variant={"ghost"}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-accent rounded-lg"
                  onClick={() => {
                    setOpenHistoryMenu(false);
                    setOpenTradeHistory(true);
                  }}
                >
                  <History className="w-5 h-5" />
                  <span>Trade History</span>
                </Button>
              </PopoverContent>
            </Popover>

            {/* Close Button */}
            {/* <SheetClose asChild> */}
            <X className="w-7 h-7 cursor-pointer" />
            {/* </SheetClose> */}
          </div>
        </div>
      )}

      {/* Select Exchange and symbols */}
      <div className="w-full flex flex-row gap-4">
        {/* select exchange */}
        <div className="flex-1">
          <Popover
            open={openExcahnge}
            onOpenChange={setOpenExchange}
            modal={true}
          >
            <PopoverTrigger asChild className="rounded-full">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openExcahnge}
                className="w-36 xs:w-full  justify-between"
              >
                <span className="truncate overflow-hidden text-ellipsis max-w-[80%] text-left">
                  {selectedExchange
                    ? selectedExchange.exchangeType
                    : "Exchange"}
                </span>
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput
                  placeholder="Search Exchange..."
                  className="h-9"
                />
                <CommandList className="max-h-64 overflow-y-auto touch-pan-y">
                  <CommandEmpty>No Options.</CommandEmpty>
                  <CommandGroup>
                    {allTradeSettings.map((exchange: ExchangeItemType) => (
                      <CommandItem
                        key={exchange._id}
                        value={exchange.exchangeType}
                        onSelect={() => {
                          setSelectedExchange(
                            selectedExchange?.exchangeType ===
                              exchange.exchangeType
                              ? null
                              : exchange
                          );
                          setOpenExchange(false);
                        }}
                      >
                        <Image
                          src={exchange.photo}
                          alt={exchange.exchangeType}
                          width={30}
                          height={30}
                          className="size-8 rounded-full"
                        />{" "}
                        {exchange.exchangeType}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedExchange?.exchangeType ===
                              exchange.exchangeType
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Select Symbol */}
        <div className="flex-1 flex justify-end">
          <Popover open={openSymbol} onOpenChange={setOpenSymbol} modal={true}>
            <PopoverTrigger asChild className="rounded-full">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSymbol}
                className="w-36 xs:w-full justify-between"
              >
                <span className="truncate overflow-hidden text-ellipsis max-w-[80%] text-left">
                  {selectedSymbol ? selectedSymbol : "Symbols"}
                </span>
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Search Symbol..." className="h-9" />
                <CommandList className="max-h-64 overflow-y-auto touch-pan-y">
                  <CommandEmpty>No Options.</CommandEmpty>
                  <CommandGroup>
                    {selectedExchange?.tradingPairs.map((tradingPairs) => (
                      <CommandItem
                        key={tradingPairs}
                        value={tradingPairs}
                        onSelect={() => {
                          setSelectedSymbol(
                            selectedSymbol === tradingPairs
                              ? null
                              : tradingPairs
                          );
                          setOpenSymbol(false);
                        }}
                      >
                        {tradingPairs}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedSymbol === tradingPairs
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Sell / Buy Box */}
      <div className="flex w-full">
        <div className="flex-1 bg-[#009e4a] text-white p-1 px-3 sm:p-2 rounded-l-xl">
          <p className="font-medium">Sell</p>
          <p className="font-medium">{selectedSymbol || "None"}</p>
        </div>
        <div className="flex-1 bg-[#d01724] text-white p-1 px-3 sm:p-2 rounded-r-xl flex justify-end">
          <div className="flex flex-col items-end">
            <p className="font-medium">Buy</p>
            <p className="font-medium">{selectedSymbol || "None"}</p>
          </div>
        </div>
      </div>

      {/* Trading Section */}
      <ScrollArea className="h-full overflow-y-auto">
        <TradeSection
          type={type}
          isQuickTrade={isQuickTrade}
          selectedExchange={selectedExchange}
          selectedSymbol={selectedSymbol}
        />
      </ScrollArea>

      {/* Trade History */}
      <Sheet open={openTradeHistory} onOpenChange={setOpenTradeHistory}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Trade History</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-0">
              <TradeHistory type={type} />
              </div>
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

export default Trade;
