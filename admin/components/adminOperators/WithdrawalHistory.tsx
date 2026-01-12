import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { WithdrawalHistoryType } from "@/types";

import { useWithdrawalHistory } from "@/hooks/useWithdrawalHistory";
import WithdrawalDetails from "../WithdrawalDetails";

const WithdrawalHistory = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  const {
    openWithdrawalDetails,
    setOpenWithdrawalDetails,

    allUserWithdrawalHistories,
    isLoading,
    error,
    refetch,
    isRefetching,

    approveWithdrawalHistory,
    isApprovingWithdrawalHistory,

    deleteWithdrawalHistory,
    isDeletingwithdrawalHistory,
  } = useWithdrawalHistory(id);

  type ConversionRate = {
    code: string;
    rate: number;
  };

  console.log(allUserWithdrawalHistories);

  const [conversionRate] = useState<ConversionRate | null>(null);

  const [selectedHistory, setSelectedHistory] =
    useState<WithdrawalHistoryType | null>(null);

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

  if (
    pageLoading ||
    isLoading ||
    isApprovingWithdrawalHistory ||
    isDeletingwithdrawalHistory
  ) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-4">
      <Card className="p-3 gap-2">
        <div className="flex justify-between  gap-3">
          <Button
            className="flex-1"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? <Spinner /> : <RefreshCw />} Refresh History
          </Button>
          {/* <Button
            className="flex-1 bg-orange-500"
            onClick={() => setOpenAddWithdrawalRequest(true)}
          >
            <CirclePlus /> Add History
          </Button> */}
        </div>
      </Card>

      <Card className="py-3 mt-3">
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-2 truncate">
            <div className="relative w-16 min-w-16">
              <Image
                src={singleUser?.photo || "/qrCode_placeholder.jpg"}
                alt="wallet-qrcode"
                width={100}
                height={100}
                className="size-16 object-cover border-2 border-gray-400 rounded-full"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {singleUser?.firstname + " " + singleUser?.lastname}
              </h3>
              <h3 className="text-sm font-semibold">{singleUser?.email}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-3 mt-3">
        <CardContent className="grid gap-6 px-3">
          <div className="space-y-3">
            {allUserWithdrawalHistories.map(
              (withdrawal: WithdrawalHistoryType) => (
                <div
                  key={withdrawal?._id}
                  className="w-full bg-secondary flex flex-col gap-1  cursor-pointer rounded-xl border p-3 transition"
                  onClick={() => {
                    setSelectedHistory(withdrawal);
                    setOpenWithdrawalDetails(true);
                  }}
                >
                  <div className="flex justify-between">
                    <div className="flex flex-row items-center gap-3">
                      <Image
                        src={
                          withdrawal?.method === "Bank"
                            ? "/bank.png"
                            : withdrawal?.methodIcon ||
                              "/qrCode_placeholder.png"
                        }
                        alt={withdrawal?.method}
                        width={50}
                        height={50}
                        className="rounded-lg bg-white p-1"
                      />

                      <div className="flex flex-col">
                        <p className="sm:hidden text-sm font-medium ">
                          ID-{withdrawal?._id?.slice(0, 10)}...
                        </p>

                        <p className="hidden sm:block text-sm font-medium ">
                          ID-{withdrawal?._id}
                        </p>

                        <p className="text-base text-muted-foreground line-clamp-1">
                          {withdrawal?.method} Method
                        </p>
                      </div>
                    </div>

                    <div className="ml-auto flex flex-col text-right">
                      <p className="text-base text-muted-foreground">
                        {new Date(withdrawal?.createdAt).toLocaleString(
                          "en-US",
                          {
                            month: "2-digit", // 12 for December
                            day: "2-digit", // 12 for the day
                            year: "numeric", // 2024 for the year
                          }
                        )}
                      </p>

                      <p className="text-base sm:text-xl text-red-500 font-semibold">
                        -
                        {conversionRate?.rate
                          ? Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: conversionRate?.code,
                              ...(withdrawal?.amount * conversionRate?.rate >
                              9999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(withdrawal?.amount * conversionRate?.rate)
                          : Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: singleUser?.currency?.code,
                              ...(withdrawal?.amount > 9999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(withdrawal?.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-base">
                      Tap to display receipt
                    </p>
                    <p
                      className="text-sm sm:text-base font-semibold"
                      style={{
                        color:
                          withdrawal?.status === "APPROVED"
                            ? "springgreen"
                            : withdrawal?.status === "NOT-APPROVED"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {withdrawal?.status}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* VIEW DEPOSIT DETAILS */}
      <Dialog
        open={openWithdrawalDetails}
        onOpenChange={setOpenWithdrawalDetails}
      >
        <form>
          <DialogContent className="sm:max-w-[525px] max-h-[90%] overflow-auto p-3 sm:p-4 bg-secondary">
            <DialogHeader>
              <DialogTitle asChild>
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      selectedHistory?.method === "Bank"
                        ? "/bank.png"
                        : selectedHistory?.methodIcon ||
                          "/qrCode_placeholder.jpg"
                    }
                    alt={selectedHistory?.method || "image"}
                    width={40}
                    height={40}
                    className="size-9 rounded-lg bg-white p-0.5"
                  />
                  <p className="font-bold">
                    {selectedHistory?.method} Withdrawal
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <WithdrawalDetails
              selectedHistory={selectedHistory}
              approveWithdrawalHistory={approveWithdrawalHistory}
              deleteWithdrawalHistory={deleteWithdrawalHistory}
            />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default WithdrawalHistory;
