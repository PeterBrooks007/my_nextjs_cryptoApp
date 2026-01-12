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
import { useReSellNft, useUserNfts } from "@/hooks/useNfts";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";
import { NftSettingsType } from "@/types";
import { useCurrentUser } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { toast } from "sonner";

const UserNfts = () => {
  const { data: user } = useCurrentUser();

  const { allUserNfts, isLoading, error, refetch, isRefetching } = useUserNfts(
    user?.email
  );

  const [selectedNft, setSelectedNft] = useState<NftSettingsType | null>(null);
  const [value, setValue] = useState("");

  const [nftList, setNftList] = useState<NftSettingsType[]>(allUserNfts);

  const [searchTerm, setSearchTerm] = useState("");
  const [openSellNft, setOpenSellNft] = useState(false);

  const { mutate, isPending } = useReSellNft(setOpenSellNft);

  const filteredAllUserNfts = Array.isArray(nftList)
    ? nftList.filter(
        (nft) =>
          nft.nftName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          nft.nftCode.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          String(nft.nftPrice)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allUserNfts.length !== 0) {
        setNftList(allUserNfts);
      }
    }, 0);
  }, [allUserNfts]);

  const handleResell = () => {
    if (!value) {
      return toast.error("Enter Amount Selling for");
    }
    if (!user?._id || !selectedNft) {
      return toast.error("Invalid request");
    }

    const formData = {
      email: user.email,
      nftName: `${selectedNft.nftName} ETH`,
      nftPrice: `${selectedNft.nftPrice} ETH`,
      sellingPrice: value,
    };

    mutate({ id: user._id, formData });
    // console.log({ formData });
  };

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

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <Card className="relative">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-2xl">My Nfts</CardTitle>
        <CardDescription className="text-base">
          List of all My Nft
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 px-4 sm:px-6">
        <div className="absolute top-6 right-5 flex gap-2 w-37.5 xs:w-50 sm:w-75  h-9">
          <InputGroup>
            <InputGroupInput
              placeholder="Search Nfts"
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-5 gap-4 sm:gap-6">
          {allUserNfts && allUserNfts.length > 0 ? (
            filteredAllUserNfts.map((nft: NftSettingsType, index: number) => (
              <div key={nft?._id}>
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
                        className="bg-green-600 text-white hover:bg-green-700 rounded"
                        onClick={() => {
                          setSelectedNft(nft);
                          setOpenSellNft(true);
                        }}
                      >
                        SELL NFT
                      </Button>
                    </div>
                  </div>

                  {/* Image */}

                  <div className="h-42 xs:h-45 sm:h-62.5 md:h-62.5">
                    <Image
                      src={nft?.photo ?? "/placeholder.png"}
                      alt={nft?.nftName || "NFT image"}
                      width={300} // retina-ready intrinsic width
                      height={300} // retina-ready intrinsic height
                      sizes="(max-width: 640px) 84px, (max-width: 1024px) 250px, 250px" // rendered sizes
                      priority={false} // lazy-load
                      className="w-full h-full rounded-[10px] object-cover object-top border border-gray-400"
                    />
                  </div>
                </div>

                {/* Name */}
                <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {nft?.nftName}
                </p>

                {/* Code */}
                <div className="flex gap-1">
                  <p className="font-bold">Code:</p>
                  <p>{nft?.nftCode}</p>
                </div>

                {/* Price */}
                <div className="flex gap-1">
                  <p className="font-bold">Price:</p>
                  <p>{nft?.nftPrice} ETH</p>
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

      {/* openSellNft Dialog */}
      <Dialog open={openSellNft} onOpenChange={setOpenSellNft}>
        <DialogContent className="sm:max-w-112.5 max-h-[90%] overflow-auto p-0 bg-secondary">
          <VisuallyHidden>
            <DialogTitle>Hidden Title</DialogTitle>
          </VisuallyHidden>

          <ScrollArea className="h-full pb-5">
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-3">
              <p className="text-lg font-medium">Sell this NFT</p>

              {/* <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setOpenSellNft(false)}
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>

            <Separator />

            {/* NFT INFO */}
            <div className="flex flex-col items-center gap-3 px-4 py-3 text-center">
              <p className="text-base">
                I confirmed that I (
                <span className="font-semibold">
                  {user?.firstname} {user?.lastname}
                </span>
                ) want to resell my collection of NFT.
              </p>

              <div className="flex flex-col items-center gap-2">
                <div className="relative h-40 w-40 overflow-hidden rounded-lg">
                  <Image
                    src={selectedNft?.photo || ""}
                    alt="NFT"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-base font-semibold">
                    Name:{" "}
                    <span className="font-normal">{selectedNft?.nftName}</span>
                  </p>

                  <p className="text-base font-semibold">
                    Price:{" "}
                    <span className="font-normal">
                      {selectedNft?.nftPrice} ETH
                    </span>
                  </p>

                  <div className="flex gap-2">
                    <p className="text-base font-semibold">NFT Code:</p>
                    <p className="text-base">{selectedNft?.nftCode}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* SELL INPUT */}
            <div className="flex flex-col items-center gap-1 px-4 py-2">
              <p className="text-base font-medium">Amount selling for?</p>

              <div className="flex w-full items-center gap-3">
                <div className="relative flex-1">
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter amount"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    ETH
                  </span>
                </div>

                <Button
                  className="rounded-lg bg-green-600 hover:bg-green-700"
                  disabled={isPending}
                  onClick={handleResell}
                >
                  {isPending && <Spinner />}
                  SELL NOW
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserNfts;
