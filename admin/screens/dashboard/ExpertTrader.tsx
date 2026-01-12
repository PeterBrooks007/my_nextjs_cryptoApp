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
import { useExpertTraders } from "@/hooks/useExpertTraders";
import { ExpertTraderType } from "@/types";
import AddExpertTrader from "@/components/AddExpertTrader";
import UpdateExpertTrader from "@/components/UpdateExpertTrader";

const ExpertTrader = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const {
    allExpertTraders,
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteExpertTrader,
    isDeletingExpertTrader,
  } = useExpertTraders();

  console.log(allExpertTraders);

  const [openDelete, setOpenDelete] = useState(false);

  const { openAddTrader, setOpenAddTrader, openEditTrader, setOpenEditTrader } =
    useSheetStore();

  const [selectedTrader, setSelectedTrader] = useState<ExpertTraderType | null>(
    null
  );

  const [expertTradersList, setExpertTradersList] = useState<
    ExpertTraderType[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);

  const filteredExpertTraders = Array.isArray(expertTradersList)
    ? expertTradersList.filter(
        (expertTrader) =>
          expertTrader.firstname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          expertTrader.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          expertTrader.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allExpertTraders.length !== 0) {
        setExpertTradersList(allExpertTraders);
      }
    }, 0);
  }, [allExpertTraders]);

  const paginatedTrader = filteredExpertTraders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // delete Wallet Address
  const deleteUserFunc = async () => {
    await deleteExpertTrader(selectedTrader?._id);

    setOpenDelete(false);
    setSelectedTrader(null);
  };

  if (error) {
    return (
      <div>
        Error Loading Traders,
        <Button onClick={() => refetch()}>
          {isRefetching && <Spinner />} Retry
        </Button>
      </div>
    );
  }

  if (pageLoading || isLoading || isDeletingExpertTrader) {
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
            onClick={() => setOpenAddTrader(true)}
          >
            <CirclePlus size={25} color="orange" />
            Add New Trader
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
              placeholder="Search Expert Trader"
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
                Expert Trader
              </TableHead>

              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Email
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Win Rate
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Profit Share
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
            {allExpertTraders &&
              allExpertTraders.length > 0 &&
              paginatedTrader.map((trader) => (
                <TableRow
                  key={trader._id}
                  className="hover:bg-muted/50 odd:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar className="size-20 xs:size-24 md:size-32 border-2 border-primary">
                        <AvatarImage
                          src={trader?.photo}
                          alt={trader?.firstname}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {trader?.firstname?.[0] + "" + trader?.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 2xl:w-78 text-base font-semibold truncate">
                          {trader?.firstname + " " + trader.lastname}
                        </div>

                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          {trader?.email}
                        </div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          Win Rate: {trader?.winRate}
                        </div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          Profit Share: {trader?.profitShare}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="text-base">{trader?.email}</div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-base">
                      {trader?.winRate}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-base">
                      {trader?.profitShare}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="text-base whitespace-normal wrap-break-word">
                      {trader?.comment}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-green-500 hover:bg-green-100"
                        onClick={() => {
                          setSelectedTrader(trader);
                          setOpenEditTrader(true);
                        }}
                      >
                        <Pen className="h-4 w-4 text-green-600" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="border-red-500 hover:bg-red-100"
                        onClick={() => {
                          setSelectedTrader(trader);
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
        totalItems={filteredExpertTraders.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
      />

      {/* ADD WALLET ADDRESS  */}
      <Sheet open={openAddTrader} onOpenChange={setOpenAddTrader}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Add Expert Trader</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <AddExpertTrader />
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* EDIT WALLET ADDRESS  */}
      <Sheet open={openEditTrader} onOpenChange={setOpenEditTrader}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Update Expert Trader</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-4">
              <UpdateExpertTrader selectedTrader={selectedTrader} />
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
              Delete This Trader{" "}
              {selectedTrader?.firstname + " " + selectedTrader?.lastname}{" "}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all this trader&apos;s data?
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

export default ExpertTrader;
