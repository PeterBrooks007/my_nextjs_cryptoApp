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
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";
import { ExpertTraderType } from "@/types";

import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import {
  useAdminRemoveUserExpertTrader,
  useUserExpertTraders,
} from "@/hooks/useCopyTrader";

const ClientTraders = () => {
  const params = useParams();
  const id = params?.userId as string;
  const { singleUser } = useUser(id);

  const { allUserExpertTraders, isLoading, error, refetch, isRefetching } =
    useUserExpertTraders(singleUser?.email);
  const { mutate, isPending } = useAdminRemoveUserExpertTrader(
    singleUser?.email
  );

  const [expertTraderList, setexpertTraderList] =
    useState<ExpertTraderType[]>(allUserExpertTraders);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllNfts = Array.isArray(expertTraderList)
    ? expertTraderList.filter(
        (expertTraders) =>
          expertTraders.firstname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          expertTraders.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          expertTraders.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allUserExpertTraders.length !== 0) {
        setexpertTraderList(allUserExpertTraders);
      }
    }, 0);
  }, [allUserExpertTraders]);

  const handleRemoveTrader = (id: string) => {
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
        <CardTitle className="text-2xl">Top Traders</CardTitle>
        <CardDescription className="text-base">
          Copy any of our top traders
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 px-4 sm:px-6">
        <div className="absolute top-6 right-5 flex gap-2 w-[150px] xs:w-[200px] sm:w-[300px]  h-9">
          <InputGroup>
            <InputGroupInput
              placeholder="Search Trader"
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
          {allUserExpertTraders && allUserExpertTraders.length > 0 ? (
            filteredAllNfts.map(
              (experttrader: ExpertTraderType, index: number) => (
                <div key={experttrader?._id}>
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
                            handleRemoveTrader(experttrader?._id);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="h-[180px] sm:h-[370px] md:h-[250px]">
                      <Image
                        src={experttrader?.photo}
                        alt={experttrader?.firstname || ""}
                        width={800}
                        height={800}
                        className="w-full h-full rounded-[10px] object-cover object-top border border-gray-400"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {experttrader?.firstname} {experttrader?.lastname}
                  </p>
                  {/* Email */}
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {experttrader?.email}
                  </p>

                  {/* Win rate */}
                  <div className="flex gap-1">
                    <p className="font-bold">Win rate:</p>
                    <p>{experttrader?.winRate}</p>
                  </div>

                  {/* Profit Share */}
                  <div className="flex gap-1">
                    <p className="font-bold"> Profit Share:</p>
                    <p>{experttrader?.profitShare}</p>
                  </div>
                </div>
              )
            )
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

export default ClientTraders;
