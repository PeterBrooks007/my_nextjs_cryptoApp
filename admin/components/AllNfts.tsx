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

import { PlusCircle, RefreshCcw, SearchIcon, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  useAdminAddNftToUser,
  useAllNfts,
} from "@/hooks/useNftSettingsApproval";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";
import { NftSettingsType } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const AllNfts = () => {
  const params = useParams();
  const id = params?.userId as string;
  const { singleUser } = useUser(id);

  const { allNfts, isLoading, error, refetch, isRefetching } = useAllNfts();
  const { mutate, isPending } = useAdminAddNftToUser(singleUser?.email);

  const [selectedNft, setSelectedNft] = useState<NftSettingsType | null>(null);
  const [openViewNft, setOpenViewNft] = useState(false);

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

  const handleAddNft = async (nftID: string | undefined) => {
    const formData = {
      nftID,
      UserId: id,
    };

    await mutate(formData);
    setOpenViewNft(false);
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

  if (isLoading || isPending) {
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
        <div className="absolute top-6 right-5 flex gap-2 w-[150px] xs:w-[200px] sm:w-[300px]  h-9">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                        className="bg-green-600 text-white hover:bg-green-700"
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
                  <div className="h-[180px] sm:h-[370px] md:h-[250px]">
                    <Image
                      src={nft?.photo}
                      alt={nft?.nftName || ""}
                      width={800}
                      height={800}
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

      {/* Screenshot Dialog */}
      <Dialog open={openViewNft} onOpenChange={setOpenViewNft}>
        <DialogContent className="sm:max-w-[450px] max-h-[90%] overflow-auto p-0 bg-secondary">
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
                className="w-full border border-gray-500 rounded-md"
              />
              <div className="absolute bottom-0 left-0 bg-black/70 px-2 rounded-tr-xl">
                <p className="text-2xl font-semibold">{selectedNft?.nftName}</p>
              </div>
            </div>

            <div className="absolute top-3 left-3 ">
              <Button
                className="rounded"
                disabled={isPending}
                onClick={() => {
                  handleAddNft(selectedNft?._id);
                }}
              >
                {isPending ? <Spinner /> : <PlusCircle />}
                Add Nft To This User
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
                  Bio: {selectedNft?.comment}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AllNfts;
