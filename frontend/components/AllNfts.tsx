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
import { useAllNfts } from "@/hooks/useNfts";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";
import { NftSettingsType } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Drawer, DrawerContent } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import useWindowSize from "@/hooks/useWindowSize";
import NftDepositComponent from "./depositComponents/NftDepositComponent";
import { useTypeOfDepositStore } from "@/store/typeOfDepositStore";

const AllNfts = () => {
  const size = useWindowSize();

  const { allNfts, isLoading, error, refetch, isRefetching } = useAllNfts();

  const { setTypeOfDeposit } = useTypeOfDepositStore();

  const [selectedNft, setSelectedNft] = useState<NftSettingsType | null>(null);
  const [openViewNft, setOpenViewNft] = useState(false);
  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);

  const [nftList, setNftList] = useState<NftSettingsType[]>(allNfts);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllNfts = Array.isArray(nftList)
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
      if (allNfts.length !== 0) {
        setNftList(allNfts);
      }
    }, 0);
  }, [allNfts]);

  // const handleAddNft = async (nftID: string | undefined) => {
  //   const formData = {
  //     nftID,
  //     UserId: id,
  //   };

  //   await mutate(formData);
  //   setOpenViewNft(false);
  // };

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
        <CardTitle className="text-2xl">Top Nfts</CardTitle>
        <CardDescription className="text-base">List of all Nft</CardDescription>
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
          {allNfts && allNfts.length > 0 ? (
            filteredAllNfts.map((nft: NftSettingsType, index: number) => (
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
                          setOpenViewNft(true);
                        }}
                      >
                        View
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
                      sizes="(max-width: 640px) 150px, (max-width: 1024px) 250px, 250px" // rendered sizes
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

      {/* openViewNft Dialog */}
      <Dialog open={openViewNft} onOpenChange={setOpenViewNft}>
        <DialogContent className="sm:max-w-112.5 max-h-[90%] overflow-auto p-0 bg-secondary">
          <VisuallyHidden>
            <DialogTitle>Hidden Title</DialogTitle>
          </VisuallyHidden>

          <div className="relative w-full h-full p-2">
            <div className="relative">
              <Image
                src={selectedNft?.photo || "/qrCode_placeholder.jpg"}
                alt={selectedNft?.nftName || "image"}
                width={200}
                height={200}
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 300px" // rendered sizes
                className="w-full border border-gray-500 rounded-md"
              />
              <div className="absolute bottom-0 left-0 bg-black/70 px-2 rounded-tr-xl">
                <p className="text-2xl font-semibold">{selectedNft?.nftName}</p>
              </div>
            </div>

            <div className="absolute top-3 left-3 ">
              <Button
                className="rounded"
                onClick={() => {
                  setTypeOfDeposit("NFT");
                  setOpenViewNft(false);
                  setOpenDepositDrawer(true);
                }}
              >
                Buy Now
              </Button>
            </div>

            <div className="px-1 mt-2">
              <div className="flex gap-1">
                <p className="text-lg font-semibold">Price:</p>
                <p className="text-lg font-semibold">
                  {" "}
                  {selectedNft?.nftPrice} ETH
                </p>
              </div>
              <div className="flex gap-1 mb-2">
                <p className="text-lg font-semibold">Nft Code</p>
                <p className="text-lg font-semibold">{selectedNft?.nftCode} </p>
              </div>
              <Separator />
              <div className="flex gap-1 mt-2">
                <p className="text-lg font-semibold">
                  Info: {selectedNft?.comment}
                </p>
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
            {openDepositDrawer && <NftDepositComponent />}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </Card>
  );
};

export default AllNfts;
