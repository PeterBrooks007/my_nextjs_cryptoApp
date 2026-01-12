import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

import { RefreshCcw, SearchIcon, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  useAdminRemoveUserNft,
  useUserNfts,
} from "@/hooks/useNftSettingsApproval";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";
import { NftSettingsType } from "@/types";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const UserNfts = () => {
  const params = useParams();
  const id = params?.userId as string;
  const { singleUser } = useUser(id);

  const { allUserNfts, isLoading, error, refetch, isRefetching } = useUserNfts(
    singleUser?.email
  );
  const { mutate, isPending } = useAdminRemoveUserNft(singleUser?.email);

  const [nftList, setNftList] = useState<NftSettingsType[]>(allUserNfts);

  const [searchTerm, setSearchTerm] = useState("");

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

  const handleRemovenft = (id: string) => {
    const formData = {
      email: singleUser?.email,
    };
    mutate({ id, formData });
    // console.log({id})
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
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => {
                          handleRemovenft(nft?._id);
                        }}
                      >
                        Remove
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
    </Card>
  );
};

export default UserNfts;
