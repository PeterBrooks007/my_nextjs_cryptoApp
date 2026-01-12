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
import { Pen, RefreshCw, SearchIcon, Trash, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useWithdrawalRequest } from "@/hooks/useWithdrawalRequest";
import { WithdrawalRequestType } from "@/types";
import UpdateWithdrawalRequest from "@/components/UpdateWithdrawalRequest";

const WithdrawalRequest = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const {
    allWithdrawalRequests,
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteWithdrawalRequest,
    isDeletingWithdrawalRequest,
  } = useWithdrawalRequest();

  // console.log(allWithdrawalRequests);

  const [openDelete, setOpenDelete] = useState(false);

  const { openEditWithdrawalRequest, setOpenEditWithdrawalRequest } =
    useSheetStore();

  const [selectedWithdrawalRequest, setSelectedWithdrawalRequest] =
    useState<WithdrawalRequestType | null>(null);

  const [withdrawalRequestsList, setWithdrawalRequestsList] = useState<
    WithdrawalRequestType[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);

  const filteredWithdrawalRequests = Array.isArray(withdrawalRequestsList)
    ? withdrawalRequestsList.filter(
        (request) =>
          request?.userId?.firstname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(request?.userId?.lastname)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(request?.userId?.email)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(request?.amount)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          request?.status
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          request?.method
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allWithdrawalRequests.length !== 0) {
        setWithdrawalRequestsList(allWithdrawalRequests);
      }
    }, 0);
  }, [allWithdrawalRequests]);

  const paginatedWithdrawalRequest = filteredWithdrawalRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // delete DEPOSIT REQUEST
  const deleteWithdrawalRequestFunc = async () => {
    await deleteWithdrawalRequest(selectedWithdrawalRequest?._id);

    setOpenDelete(false);
    setSelectedWithdrawalRequest(null);
  };

  if (error) {
    return (
      <div>
        Error Loading Withdrawal Request,
        <Button onClick={() => refetch()}>
          {isRefetching && <Spinner />} Retry
        </Button>
      </div>
    );
  }

  if (pageLoading || isLoading || isDeletingWithdrawalRequest) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Set States */}
          <div className="flex flex-row gap-2 my-2 ml-0 mt-0">
            {/* <Skeleton className="w-38 h-9" /> */}
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
              placeholder="Search Expert bot"
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
                User
              </TableHead>

              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Type of Withdrawal
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Method
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Amount To Withdraw
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Status
              </TableHead>

              <TableHead className="text-base text-white font-bold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allWithdrawalRequests &&
              allWithdrawalRequests.length > 0 &&
              paginatedWithdrawalRequest.map((request) => (
                <TableRow
                  key={request._id}
                  className="hover:bg-muted/50 odd:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar className="size-16 xs:size-20 md:size-20 border-2 border-primary">
                        <AvatarImage
                          src={request?.userId.photo}
                          alt={request?.userId.firstname}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {request?.userId?.firstname?.[0] +
                            "" +
                            request?.userId?.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 2xl:w-78 text-base font-semibold truncate ">
                          {request?.userId?.firstname +
                            " " +
                            request?.userId?.lastname}
                        </div>

                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          Amount:{" "}
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            ...(request?.amount > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(request?.amount)}
                        </div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          Method: {request?.method}
                        </div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          <span
                            className={`text-xs font-medium inline-flex items-center gap-1 px-1 py-1 rounded-full bg-red-500 `}
                          >
                            <XCircle className="h-4 w-4" />
                            {request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="text-base">
                      {request?.typeOfWithdrawal} account withdrawal
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-base">
                      {request?.method} Method
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-lg font-bold text-green-400">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        ...(request?.amount > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(request?.amount)}{" "}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="text-base whitespace-normal wrap-break-word">
                      <span
                        className={`text-sm font-medium inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-red"
                        }`}
                      >
                        <XCircle className="h-4 w-4" />
                        {request.status}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-green-500 hover:bg-green-100"
                        onClick={() => {
                          setSelectedWithdrawalRequest(request);
                          setOpenEditWithdrawalRequest(true);
                        }}
                      >
                        <Pen className="h-4 w-4 text-green-600" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="border-red-500 hover:bg-red-100"
                        onClick={() => {
                          setSelectedWithdrawalRequest(request);
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
        totalItems={filteredWithdrawalRequests.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
      />

      {/* EDIT DEPOSIT REQUEST  */}
      <Sheet
        open={openEditWithdrawalRequest}
        onOpenChange={setOpenEditWithdrawalRequest}
      >
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">
              Update Trading WithdrawalRequest
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-4">
              <UpdateWithdrawalRequest
                selectedWithdrawalRequest={selectedWithdrawalRequest}
              />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* DELETE DEPOSIT REQUEST DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {`Delete this Withdrawal Request by ${selectedWithdrawalRequest?.userId?.firstname} ${selectedWithdrawalRequest?.userId?.lastname}?`}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete this request
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                deleteWithdrawalRequestFunc();
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

export default WithdrawalRequest;
