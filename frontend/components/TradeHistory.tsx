import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import useWindowSize from "@/hooks/useWindowSize";
import TradeHistoryOrders from "./TradeHistoryOrders";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { RefreshCw, XCircle } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";

const TradeHistory = ({
  type,
  isTradeorder,
}: {
  type?: string | undefined;
  isTradeorder?: boolean | undefined;
}) => {
  const [pageLoading, setPageLoading] = useState(true);

  // console.log(type);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, []);

  const { data: user } = useCurrentUser();
  const { refetch, isRefetching } = useTradeHistory(user?._id);

  const size = useWindowSize();

  if (pageLoading) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-4">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-16 min-w-16 ">
              <Image
                src={user?.photo || "/qrCode_placeholder.jpg"}
                alt="wallet-qrcode"
                width={80}
                height={80}
                className="size-16 object-cover border-2 border-gray-400 rounded-full"
              />
            </div>

            <div>
              <h3 className="w-24 xs:w-32 sm:w-52 text-lg font-semibold truncate">
                {user?.firstname + " " + user?.lastname}
              </h3>
              <h3 className="w-24 xs:w-32 sm:w-52 text-sm font-semibold truncate">
                {user?.email}
              </h3>
            </div>
          </div>

          <div className="space-y-1">
            <Button
              onClick={() => {
                refetch();
              }}
            >
              {isRefetching ? <Spinner /> : <RefreshCw />}
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Separator className="mt-3" />

      <div className="grid gap-6 mt-3">
        <div className="w-full">
          <div className="flex flex-row justify-between items-center">
            {/* LEFT SIDE */}
            <div className="flex flex-col">
              <p className="text-sm font-medium">Account Trades:</p>
              <p className="text-base">All Trade history</p>
            </div>

            {/* RIGHT SIDE */}
            {type === "Live" ? (
              <div className="flex flex-col text-right">
                <p className="text-sm font-medium">Trade Balance</p>
                <p className="text-sm font-semibold">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code ?? "USD",
                    ...((user?.balance ?? 0) > 9_999_999
                      ? { notation: "compact" }
                      : {}),
                  }).format(user?.balance ?? 0)}
                </p>
              </div>
            ) : (
              <div className="flex flex-col text-right">
                <p className="text-sm font-medium">Demo Balance</p>
                <p className="text-sm font-semibold">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code ?? "USD",
                    ...((user?.demoBalance ?? 0) > 9_999_999
                      ? { notation: "compact" }
                      : {}),
                  }).format(user?.demoBalance ?? 0)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 mt-5">
        <Tabs defaultValue="ORDERS">
          <ScrollArea
            className="bg-green-900/10 p-1 whitespace-nowrap border rounded-lg"
            style={{
              width: size.width && size.width < 500 ? size.width - 30 : "100%",
            }}
          >
            <TabsList className="bg-transparent">
              <TabsTrigger value="ORDERS">ORDERS</TabsTrigger>
              <TabsTrigger value="POSITION">POSITION</TabsTrigger>
              <TabsTrigger value="ACCOUNT SUMMARY">ACCOUNT SUMMARY</TabsTrigger>
              <TabsTrigger value="NOTIFICATION LOG">
                NOTIFICATION LOG
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* ORDERS TAB */}
          <TabsContent value="ORDERS" className="mt-2">
            <TradeHistoryOrders isTradeorder={isTradeorder} />
          </TabsContent>

          {/* POSITION TAB */}
          <TabsContent value="POSITION" className="mt-4">
            <div className="flex flex-col gap-2 items-center justify-center">
              <XCircle size={38} />
              <p>There are no open position in your trading account yet</p>
            </div>
          </TabsContent>

          {/* ACCOUNT SUMMARY */}
          <TabsContent value="ACCOUNT SUMMARY" className="mt-4">
            <div className="flex flex-col gap-2 items-center justify-center">
              <XCircle size={38} />
              <p>Nothing here at the moment</p>
            </div>
          </TabsContent>

          {/* NOTIFICATION LOG */}
          <TabsContent value="NOTIFICATION LOG" className="mt-4">
            <div className="flex flex-col gap-2 items-center justify-center">
              <XCircle size={38} />
              <p>Nothing here at the moment</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradeHistory;
