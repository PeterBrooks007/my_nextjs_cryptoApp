"use client";

import { SmartPagination } from "@/components/SmartPagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSheetStore } from "@/store/sheetStore";
import { CirclePlus, Pen, RefreshCw, SearchIcon, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

// import { TradingSignalType } from "@/types";
import AddTradingSignal from "@/components/AddTradingSignal";
import { useTradingSignals } from "@/hooks/useTradingSignals";
import UpdateTradingSignal from "@/components/UpdateTradingSignal";
import { TradingBotType } from "@/types";

const TradingSignals = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const {
    allTradingSignals,
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteTradingSignal,
    isDeletingTradingSignal,
  } = useTradingSignals();

  // console.log(allTradingSignals);

  const [openDelete, setOpenDelete] = useState(false);

  const { openAddSignal, setOpenAddSignal, openEditSignal, setOpenEditSignal } =
    useSheetStore();

  const [selectedSignal, setSelectedSignal] = useState<TradingBotType | null>(
    null
  );

  const [tradingSignalsList, setTradingSignalsList] = useState<
    TradingBotType[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);

  const filteredTradingSignals = Array.isArray(tradingSignalsList)
    ? tradingSignalsList.filter(
        (tradingSignal) =>
          tradingSignal.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(tradingSignal.dailyTrades)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(tradingSignal.price)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          tradingSignal.winRate
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allTradingSignals.length !== 0) {
        setTradingSignalsList(allTradingSignals);
      }
    }, 0);
  }, [allTradingSignals]);

  const paginatedSignal = filteredTradingSignals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // delete Wallet Address
  const deleteSignalrFunc = async () => {
    await deleteTradingSignal(selectedSignal?._id);

    setOpenDelete(false);
    setSelectedSignal(null);
  };

  if (error) {
    return (
      <div>
        Error Loading Signals,
        <Button onClick={() => refetch()}>
          {isRefetching && <Spinner />} Retry
        </Button>
      </div>
    );
  }

  if (pageLoading || isLoading || isDeletingTradingSignal) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Set States */}
          <div className="flex flex-row gap-2 my-2 ml-0 mt-0">
            <Skeleton className="w-38 h-9" />
            <Skeleton className="w-24 h-9" />
          </div>

          {/* Search input */}
          <div className="w-full lg:w-[300px]  h-9">
            <Skeleton className="w-full lg:w-[300px] h-9" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex flex-row gap-2 my-2 ml-0 mt-0">
          <Button
            variant="outline"
            className="border-orange-500 text-[12px] sm:text-[14px]"
            onClick={() => setOpenAddSignal(true)}
          >
            <CirclePlus size={25} color="orange" />
            Add New Signal
          </Button>

          <Button
            variant="outline"
            className="border-green-500 text-[12px] sm:text-[14px]"
            onClick={() => refetch()}
          >
            {isRefetching ? (
              <Spinner className="text-green-500" />
            ) : (
              <RefreshCw size={25} className="text-green-500" />
            )}
            Refresh
          </Button>
        </div>

        {/* Search input */}
        <div className="w-full lg:w-[300px]  h-9">
          <InputGroup>
            <InputGroupInput
              placeholder="Search Trading Signal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-600 text-white">
              <TableHead className="text-base text-white font-bold">
                Trading Signal
              </TableHead>

              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Daily Trades
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Price Amount
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Win Rate
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Comment
              </TableHead>

              <TableHead className="text-base text-white font-bold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allTradingSignals &&
              allTradingSignals.length > 0 &&
              paginatedSignal.map((Signal) => (
                <TableRow
                  key={Signal._id}
                  className="hover:bg-muted/50 odd:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar className="size-20 xs:size-24 md:size-32 border-2 border-primary">
                        <AvatarImage
                          src={Signal?.photo}
                          alt={Signal?.name}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {Signal?.name?.[0] + "" + Signal?.name?.[1]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 2xl:w-78 text-base font-semibold truncate ">
                          {Signal?.name}
                        </div>

                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          Daily Trades: {Signal?.dailyTrades}
                        </div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          Win Rate: {Signal?.winRate}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="text-base">
                      {Signal?.dailyTrades} Trades Daily
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-base">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        ...(Signal?.price > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(Signal?.price)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-base">
                      {Signal?.winRate}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="text-base whitespace-normal wrap-break-word">
                      {Signal?.comment}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-green-500 hover:bg-green-100"
                        onClick={() => {
                          setSelectedSignal(Signal);
                          setOpenEditSignal(true);
                        }}
                      >
                        <Pen className="h-4 w-4 text-green-600" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="border-red-500 hover:bg-red-100"
                        onClick={() => {
                          setSelectedSignal(Signal);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <SmartPagination
        page={page}
        totalItems={filteredTradingSignals.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
      />

      {/* ADD SIGNAL  */}
      <Sheet open={openAddSignal} onOpenChange={setOpenAddSignal}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Add Trading Signal</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <AddTradingSignal />
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* EDIT SIGNAL  */}
      <Sheet open={openEditSignal} onOpenChange={setOpenEditSignal}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Update Trading Signal</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-4">
              <UpdateTradingSignal selectedSignal={selectedSignal} />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* DELETE SIGNAL DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete This Signal {selectedSignal?.name}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all this Signal&apos;s data?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                deleteSignalrFunc();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TradingSignals;
