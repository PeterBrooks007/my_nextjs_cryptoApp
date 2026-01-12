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

import { useSheetStore } from "@/store/sheetStore";
import { CirclePlus, Pen, RefreshCw, SearchIcon, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

import { TradeSettingsType } from "@/types";

import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useTradeSettings } from "@/hooks/useTradeSettings";
import AddTradeSetting from "@/components/AddTradeSetting";
import UpdateTradeSetting from "@/components/UpdateTradeSetting";

const TradeSettings = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const {
    allTradeSettings,
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteTradeSetting,
    isDeletingTradeSetting,
    deleteArrayOfExchanges,
    isDeletingArrayOfExchanges,
  } = useTradeSettings();

  // console.log(allTradeSettings);

  const [openDelete, setOpenDelete] = useState(false);

  const {
    openAddTradeSetting,
    setOpenAddTradeSetting,
    openEditTradeSetting,
    setOpenEditTradeSetting,
  } = useSheetStore();

  const [selectedTradeSetting, setSelectedTradeSetting] =
    useState<TradeSettingsType | null>(null);

  const [TradeSettingsList, setTradeSettingsList] = useState<
    TradeSettingsType[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);

  const filteredTradeSettings = Array.isArray(TradeSettingsList)
    ? TradeSettingsList.filter((exchange) =>
        exchange.exchangeType
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allTradeSettings.length !== 0) {
        setTradeSettingsList(allTradeSettings);
      }
    }, 0);
  }, [allTradeSettings]);

  const paginatedTradeSetting = filteredTradeSettings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // delete Wallet Address
  const deleteTradeSettingFunc = async () => {
    await deleteTradeSetting(selectedTradeSetting?._id);

    setOpenDelete(false);
    setSelectedTradeSetting(null);
  };

  //START OF PART TO MULTIPLE SELECT AND DELETE WALLETS

  const [selectedWalletsChecked, setSelectedWalletsChecked] = useState<
    Set<string>
  >(new Set());

  const isAllSelected = selectedWalletsChecked.size === allTradeSettings.length;

  const [openDeleteSelectedWalletChecked, setDeleteSelectedWalletChecked] =
    useState(false);

  // Function to handle master checkbox change
  const handleSelectAllWallet = (checked: boolean) => {
    if (checked) {
      // Map all wallet IDs into a Set<string>
      const allWalletIds: Set<string> = new Set(
        allTradeSettings.map((wallet: TradeSettingsType) => wallet._id)
      );
      setSelectedWalletsChecked(allWalletIds);
    } else {
      setSelectedWalletsChecked(new Set());
    }
  };

  // Function to handle single checkbox change
  const handleSelectSingleWalletChecked = (id: string) => {
    const updatedSelection = new Set(selectedWalletsChecked);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setSelectedWalletsChecked(updatedSelection);
  };

  // Function to handle delete arrays of wallets
  const handleDeleteSelectedWalletsChecked = async () => {
    await deleteArrayOfExchanges(Array.from(selectedWalletsChecked));

    setSelectedWalletsChecked(new Set());
    setDeleteSelectedWalletChecked(false);
  };

  //END OF PART TO MULTIPLE SELECT AND DELETE WALLETS

  if (error) {
    return (
      <div>
        Error Loading Trading Settings,
        <Button onClick={() => refetch()}>
          {isRefetching && <Spinner />} Retry
        </Button>
      </div>
    );
  }

  if (
    pageLoading ||
    isLoading ||
    isDeletingTradeSetting ||
    isDeletingArrayOfExchanges
  ) {
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
            onClick={() => setOpenAddTradeSetting(true)}
          >
            <CirclePlus size={25} color="orange" />
            Add New Exchange
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
              placeholder="Search Exchange"
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
        <div>
          <div className="flex justify-between items-center bg-green-600 text-white p-2">
            <p className="text-base text-white font-bold">Trading Exchange</p>
            <div className="flex items-center gap-3">
              <Checkbox
                className="border-white"
                checked={isAllSelected}
                onCheckedChange={handleSelectAllWallet}
              />
              <Button
                size={"icon-sm"}
                variant={"ghost"}
                disabled={selectedWalletsChecked.size === 0}
                onClick={() => {
                  setDeleteSelectedWalletChecked(true);
                }}
              >
                <Trash className="size-5!" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-2 m-1 xs:m-2 ">
            {allTradeSettings &&
              allTradeSettings.length > 0 &&
              paginatedTradeSetting.map((exchange) => (
                <Card key={exchange?._id} className="p-2">
                  {/* Top Row - Checkbox + Buttons */}
                  <div className="flex items-center justify-between mb-2">
                    <Checkbox
                      checked={selectedWalletsChecked.has(exchange?._id)}
                      onCheckedChange={() =>
                        handleSelectSingleWalletChecked(exchange?._id)
                      }
                    />

                    <div className="flex gap-2">
                      {/* Edit Button */}
                      <Button
                        variant="outline"
                        className="border-2 border-green-600 h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedTradeSetting(exchange);
                          setOpenEditTradeSetting(true);
                        }}
                      >
                        <Pen className="h-4 w-4 text-green-600" />
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="outline"
                        className="border-2 border-red-600 h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedTradeSetting(exchange);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Wallet Avatar + Name */}
                  <div className="flex items-center gap-2 p-1">
                    <Avatar className="size-10 xs:size-16 md:size-18 border-2 border-primary">
                      <AvatarImage
                        src={exchange?.photo}
                        alt={exchange?.exchangeType}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {exchange?.exchangeType?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <p className="text-sm font-medium wrap-break-word truncate">
                      {exchange?.exchangeType.toUpperCase()}
                    </p>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <SmartPagination
        page={page}
        totalItems={filteredTradeSettings.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
      />

      {/* ADD TRADING EXCHANGE  */}
      <Sheet open={openAddTradeSetting} onOpenChange={setOpenAddTradeSetting}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Add New Exchange</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <AddTradeSetting />
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* EDIT TRADING EXCHANGE  */}
      <Sheet open={openEditTradeSetting} onOpenChange={setOpenEditTradeSetting}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Update Trade Exchange</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-4">
              <UpdateTradeSetting selectedTradeSetting={selectedTradeSetting} />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* DELETE TRADING EXCHANGE DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Delete This Exchange{" "}
              {selectedTradeSetting?.exchangeType.toUpperCase()}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all this exchange&apos;s data?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                deleteTradeSettingFunc();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE SELECTED CHECK TRADING EXCHANGE DIALOG */}
      <Dialog
        open={openDeleteSelectedWalletChecked}
        onOpenChange={setDeleteSelectedWalletChecked}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {`Are you sure you want to delete ${selectedWalletsChecked.size} selected exchange(s)?`}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all this selected exchange&apos;s data?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteSelectedWalletChecked(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteSelectedWalletsChecked();
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

export default TradeSettings;
