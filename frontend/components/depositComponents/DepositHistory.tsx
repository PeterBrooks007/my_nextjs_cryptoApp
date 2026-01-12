import React, { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useDepositHistory } from "@/hooks/useDepositHistory";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { DepositHistoryType } from "@/types";

import DepositDetails from "./DepositDetails";
import { useCurrentUser } from "@/hooks/useAuth";
import { useConversionRateStore } from "@/store/conversionRateStore";

const DepositHistory = () => {
  const { data: user } = useCurrentUser();

  const {
    openDepositDetails,
    setOpenDepositDetails,

    allUserDepositHistories,
    isLoading,
    error,
    refetch,
    isRefetching,

    deletedepositHistory,
    isDeletingdepositHistory,
  } = useDepositHistory();

   const { conversionRate } = useConversionRateStore();
 

  const [selectedHistory, setSelectedHistory] =
    useState<DepositHistoryType | null>(null);

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

  if (isLoading || isDeletingdepositHistory) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-4 mt-4">
      <Card className="p-3 gap-2">
        <div className="flex justify-between  gap-3">
          <Button
            className="flex-1"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? <Spinner /> : <RefreshCw />} Refresh History
          </Button>
        </div>
      </Card>

      <Card className="py-3 mt-3">
        <CardContent className="grid gap-6 px-3">
          <div className="space-y-3">
            {allUserDepositHistories.map((deposit: DepositHistoryType) => (
              <div
                key={deposit?._id}
                className="w-full bg-secondary flex flex-col gap-1  cursor-pointer rounded-xl border p-3 transition"
                onClick={() => {
                  setSelectedHistory(deposit);
                  setOpenDepositDetails(true);
                }}
              >
                <div className="flex justify-between">
                  <div className="flex flex-row items-center gap-3">
                    <Image
                      src={
                        deposit?.method === "Bank"
                          ? "/bank.png"
                          : deposit?.methodIcon
                      }
                      alt={deposit?.method}
                      width={50}
                      height={50}
                      className="rounded-lg bg-white p-1"
                    />

                    <div className="flex flex-col">
                      <p className="sm:hidden text-sm font-medium ">
                        ID-{deposit?._id?.slice(0, 10)}...
                      </p>

                      <p className="hidden sm:block text-sm font-medium ">
                        ID-{deposit?._id?.slice(0, 15)}
                      </p>

                      <p className="text-base text-muted-foreground line-clamp-1">
                        {deposit?.method} Method
                      </p>
                    </div>
                  </div>

                  <div className="ml-auto flex flex-col text-right">
                    <p className="text-base text-muted-foreground">
                      {new Date(deposit?.createdAt).toLocaleString("en-US", {
                        month: "2-digit", // 12 for December
                        day: "2-digit", // 12 for the day
                        year: "numeric", // 2024 for the year
                      })}
                    </p>

                    <p className="text-base sm:text-xl text-green-400 font-semibold">
                      {conversionRate?.rate
                        ? Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate?.code,
                            ...(deposit?.amount * conversionRate?.rate > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(deposit?.amount * conversionRate?.rate)
                        : Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(deposit?.amount > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(deposit?.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-base">Tap to display receipt</p>
                  <p
                    className="text-sm sm:text-base font-semibold"
                    style={{
                      color:
                        deposit?.status === "APPROVED"
                          ? "springgreen"
                          : deposit?.status === "NOT-APPROVED"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {deposit?.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* VIEW DEPOSIT DETAILS */}
      <Dialog open={openDepositDetails} onOpenChange={setOpenDepositDetails}>
        <form>
          <DialogContent className="sm:max-w-131.25 max-h-[90%] overflow-auto p-3 sm:p-4 bg-secondary">
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
                  <p className="font-bold">{selectedHistory?.method} Deposit</p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <DepositDetails
              selectedHistory={selectedHistory}
              deletedepositHistory={deletedepositHistory}
            />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default DepositHistory;
