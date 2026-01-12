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

import { useNftSettings } from "@/hooks/useNftSettings";

import { NftSettingsType } from "@/types";
import AddNft from "@/components/AddNft";
import UpdateNft from "@/components/UpdateNft";

const NftSettings = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const {
    allNfts,
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteNft,
    isDeletingNft,
  } = useNftSettings();

  // console.log(allNfts);

  const [openDelete, setOpenDelete] = useState(false);

  const { openAddNft, setOpenAddNft, openEditNft, setOpenEditNft } =
    useSheetStore();

  const [selectedNft, setSelectedNft] = useState<NftSettingsType | null>(null);

  const [nftsList, setNftsList] = useState<NftSettingsType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);

  const filteredNfts = Array.isArray(nftsList)
    ? nftsList.filter(
        (nft) =>
          nft.nftName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          nft.comment.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          nft.nftCode.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          String(nft.nftPrice)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allNfts.length !== 0) {
        setNftsList(allNfts);
      }
    }, 0);
  }, [allNfts]);

  const paginatedNft = filteredNfts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // delete Wallet Address
  const deleteNftFunc = async () => {
    await deleteNft(selectedNft?._id);

    setOpenDelete(false);
    setSelectedNft(null);
  };

  if (error) {
    return (
      <div>
        Error Loading Nfts,
        <Button onClick={() => refetch()}>
          {isRefetching && <Spinner />} Retry
        </Button>
      </div>
    );
  }

  if (pageLoading || isLoading || isDeletingNft) {
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
            onClick={() => setOpenAddNft(true)}
          >
            <CirclePlus size={25} color="orange" />
            Add New Nft
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
              placeholder="Search Nft"
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
                Nft
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Nft Price
              </TableHead>
              <TableHead className="text-base hidden xl:table-cell text-white font-bold">
                Nft Code
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
            {allNfts &&
              allNfts.length > 0 &&
              paginatedNft.map((nft) => (
                <TableRow
                  key={nft._id}
                  className="hover:bg-muted/50 odd:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar className="size-20 xs:size-24 md:size-32 border-2 border-primary rounded-xl">
                        <AvatarImage
                          src={nft?.photo}
                          alt={nft?.nftName}
                          className="object-cover rounded-xl"
                        />
                        <AvatarFallback className="rounded-xl">
                          {nft?.nftName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 2xl:w-78 text-base font-semibold truncate ">
                          Name: {nft?.nftName}
                        </div>

                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          Price: {nft?.nftPrice} ETH
                        </div>
                        <div className="w-28 xs:w-40 sm:w-48 md:w-42 lg:w-78 2xl:w-78 xl:hidden text-base font-semibold truncate">
                          Nft Code: {nft?.nftCode}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="text-base">{nft?.nftPrice} ETH</div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-base">
                      {nft?.nftCode}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="text-base whitespace-normal wrap-break-word">
                      {nft?.comment}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-green-500 hover:bg-green-100"
                        onClick={() => {
                          setSelectedNft(nft);
                          setOpenEditNft(true);
                        }}
                      >
                        <Pen className="h-4 w-4 text-green-600" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="border-red-500 hover:bg-red-100"
                        onClick={() => {
                          setSelectedNft(nft);
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
        totalItems={filteredNfts.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
      />

      {/* ADD NFT */}
      <Sheet open={openAddNft} onOpenChange={setOpenAddNft}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Add Nft</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <AddNft />
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* EDIT NFT  */}
      <Sheet open={openEditNft} onOpenChange={setOpenEditNft}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Update Nft</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-4">
              <UpdateNft selectedNft={selectedNft} />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* DELETE NFT DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete This Nft {selectedNft?.nftName}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all this Nft&apos;s data?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                deleteNftFunc();
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

export default NftSettings;
