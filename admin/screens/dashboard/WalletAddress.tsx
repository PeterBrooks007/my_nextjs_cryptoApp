"use client";

import AddWalletAddress from "@/components/AddWalletAddress";
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
import { useWalletAddress } from "@/hooks/useWalletAddress";
import { useSheetStore } from "@/store/sheetStore";
import { WalletAddressType } from "@/types";
import { CirclePlus, Pen, RefreshCw, SearchIcon, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import UpdateWalletAddress from "@/components/UpdateWalletAddress";

const WalletAddress = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const {
    allWalletAddress,
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteWalletAddress,
    isDeletingWalletAddress,
  } = useWalletAddress();

  const [openDelete, setOpenDelete] = useState(false);

  const { openAddWallet, setOpenAddWallet, openEditWallet, setOpenEditWallet } =
    useSheetStore();

  const [selectedWallet, setSelectedWallet] =
    useState<WalletAddressType | null>(null);

  const [walletAddressList, setWalletAddressList] = useState<
    WalletAddressType[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);

  const filteredWalletAddress = Array.isArray(walletAddressList)
    ? walletAddressList.filter(
        (walletAddress) =>
          walletAddress.walletName
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          walletAddress.walletSymbol
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          walletAddress.walletAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allWalletAddress.length !== 0) {
        setWalletAddressList(allWalletAddress);
      }
    }, 0);
  }, [allWalletAddress]);

  const paginatedUsers = filteredWalletAddress.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // delete Wallet Address
  const deleteUserFunc = async () => {
    await deleteWalletAddress(selectedWallet?._id);

    setOpenDelete(false);
    setSelectedWallet(null);
  };

  if (error) {
    return (
      <div>
        Error Loading Wallet,
        <Button onClick={() => refetch()}>
          {isRefetching && <Spinner />} Retry
        </Button>
      </div>
    );
  }

  if (pageLoading || isLoading || isDeletingWalletAddress) {
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
            onClick={() => setOpenAddWallet(true)}
          >
            <CirclePlus size={25} color="orange" />
            Add New Wallet
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
              placeholder="Search Wallet Address"
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
                Wallet Name
              </TableHead>

              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Wallet Symbol
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Wallet Address
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Wallet QrCode
              </TableHead>

              <TableHead className="text-base text-white font-bold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allWalletAddress &&
              allWalletAddress.length > 0 &&
              paginatedUsers.map((wallet) => (
                <TableRow
                  key={wallet._id}
                  className="hover:bg-muted/50 odd:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar className="size-16 md:size-24 border-2 border-primary">
                        <AvatarImage
                          src={wallet?.walletPhoto}
                          alt={wallet?.walletName}
                          className="object-cover"
                        />
                        <AvatarFallback>{wallet?.walletSymbol}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="w-28 xs:w-48 sm:w-48 md:w-42 2xl:w-78 text-base font-semibold truncate">
                          {wallet?.walletName} Wallet
                        </div>

                        <div className="lg:hidden text-base font-semibold">
                          {wallet?.walletSymbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="text-base">
                      {wallet?.walletSymbol.toUpperCase()}
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-base">
                      {wallet?.walletAddress}
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-base">
                      <Image
                        className="size-24"
                        width={100}
                        height={100}
                        src={wallet?.walletQrcode || "/qrCode_placeholder.png"}
                        alt={wallet?.walletName || "image"}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-green-500 hover:bg-green-100"
                        onClick={() => {
                          setSelectedWallet(wallet);
                          setOpenEditWallet(true);
                        }}
                      >
                        <Pen className="h-4 w-4 text-green-600" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="border-red-500 hover:bg-red-100"
                        onClick={() => {
                          setSelectedWallet(wallet);
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
        totalItems={filteredWalletAddress.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
      />

      {/* ADD WALLET ADDRESS  */}
      <Sheet open={openAddWallet} onOpenChange={setOpenAddWallet}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Add Wallet Wallet</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <AddWalletAddress />
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* EDIT WALLET ADDRESS  */}
      <Sheet open={openEditWallet} onOpenChange={setOpenEditWallet}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Update Wallet Wallet</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-4">
              <UpdateWalletAddress selectedWallet={selectedWallet} />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* DELETE WALLET DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Delete {selectedWallet?.walletName} Wallet Address ?
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all Wallet data?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                deleteUserFunc();
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

export default WalletAddress;
