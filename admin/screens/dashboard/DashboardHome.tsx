"use client";

const AppAreaChart = lazy(() => import("@/components/AppAreaChart"));
const AppBarChart = lazy(() => import("@/components/AppBarChart"));
const CryptoTrending = lazy(() => import("@/components/CryptoTrending"));

import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/useAuth";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import { CircleAlert, Download, Mail, Upload, Users2 } from "lucide-react";
import Link from "next/link";
import React, { lazy, Suspense, useEffect, useState } from "react";

const DashboardHome = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const { isError, isLoading, refetch, isRefetching } = useCurrentUser();

  const {
    isLoading: totalCountsLoading,
    totalUsers,
    unreadMessages,
    totalDepositRequests,
    totalWithdrawalRequests,
  } = useTotalCounts();

  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDateString(
        new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading || isLoading)
    return (
      <div className="mb-4 lg:mb-6 px-4 py-3 bg-secondary rounded-md shadow-sm">
        <h1 className="font-semibold text-base lg:text-xl mb-2">
          <Skeleton className="w-52 h4 h-4 sm:h-5 bg-gray-500/30" />
        </h1>
        <h1 className="text-sm lg:text-base">
          <Skeleton className="w-48 h-3 sm:h-4 bg-gray-500/30" />
        </h1>
      </div>
    );

  if (isError) {
    return (
      <div>
        Error Loading User Data{" "}
        <Button onClick={() => refetch()}>
          {isRefetching && <Spinner />} Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 lg:mb-6 px-4 py-2 bg-secondary rounded-md shadow-sm">
        <h1 className="font-semibold text-base lg:text-xl">
          {(() => {
            const currentHour = new Date().getHours();
            if (currentHour < 12) return "Good Morning";
            if (currentHour < 18) return "Good Afternoon";
            return "Good Evening";
          })() +
            ", " +
            "Admin."}
        </h1>
        <h1 className="text-sm lg:text-base">{dateString}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 ">
        <div className="bg-primary-foreground p-2 md:p-4 rounded-lg lg:col-span-1 xl:col-span-1 2xl:col-span-1 shadow-sm">
          <div className="grid grid-cols-2 w-full h-full gap-3">
            <Card className="bg-secondary w-full h-auto p-3 md:p-4">
              <Link href={"/dashboard/users"}>
                <div className="flex flex-col gap-6 lg:gap-10">
                  <div className="flex items-center gap-2">
                    <Button
                      size={"icon"}
                      className="bg-green-600 border border-green-500/50"
                    >
                      <Users2 className="size-6!" color="white" />
                    </Button>
                    <p className="text-base sm:text-xl">Total Users</p>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex justify-center items-center gap-2">
                      {totalCountsLoading ? (
                        <Skeleton className="w-[60px] h-8 bg-gray-500/30" />
                      ) : (
                        <p className="text-2xl sm:text-3xl">{totalUsers}</p>
                      )}
                      <p className="text-green-500 font-bold">new</p>
                    </div>

                    <CircleAlert size={28} />
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="bg-secondary w-full h-auto p-4">
              <Link href={"/dashboard/mailbox"}>
                <div className="flex flex-col gap-6 lg:gap-10">
                  <div className="flex items-center gap-2">
                    <Button
                      size={"icon"}
                      className="bg-red-600 border border-red-500/50"
                    >
                      <Mail className="size-6!" color="white" />
                    </Button>
                    <p className="text-base sm:text-xl">Messages</p>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex justify-center items-center gap-2">
                      {totalCountsLoading ? (
                        <Skeleton className="w-[60px] h-8 bg-gray-500/30" />
                      ) : (
                        <p className="text-2xl sm:text-3xl">{unreadMessages}</p>
                      )}
                      <p className="text-green-500 font-bold">new</p>
                    </div>

                    <CircleAlert size={28} />
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="bg-secondary w-full h-auto p-4">
              <Link href={"/dashboard/deposit-request"}>
                <div className="flex flex-col gap-6 lg:gap-10">
                  <div className="flex items-center gap-2">
                    <Button
                      size={"icon"}
                      className="bg-yellow-600 border border-yellow-500/50"
                    >
                      <Upload className="size-6!" color="white" />
                    </Button>
                    <p className="text-base sm:text-xl">Deposits</p>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex justify-center items-center gap-2">
                      {totalCountsLoading ? (
                        <Skeleton className="w-[60px] h-8 bg-gray-500/30" />
                      ) : (
                        <p className="text-2xl sm:text-3xl">
                          {totalDepositRequests}
                        </p>
                      )}
                      <p className="text-green-500 font-bold">new</p>
                    </div>

                    <CircleAlert size={28} />
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="bg-secondary w-full h-auto p-4">
              <Link href={"/dashboard/withdrawal-request"}>
                <div className="flex flex-col gap-6 lg:gap-10">
                  <div className="flex items-center gap-2">
                    <Button
                      size={"icon"}
                      className="bg-sky-600 border border-sky-500/50"
                    >
                      <Download className="size-6!" color="white" />
                    </Button>
                    <p className="text-base sm:text-xl">Withdrawals</p>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex justify-center items-center gap-2">
                      {totalCountsLoading ? (
                        <Skeleton className="w-[60px] h-8 bg-gray-500/30" />
                      ) : (
                        <p className="text-2xl sm:text-3xl">
                          {totalWithdrawalRequests}
                        </p>
                      )}
                      <p className="text-green-500 font-bold">new</p>
                    </div>

                    <CircleAlert size={28} />
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg shadow-sm">
          <CardList title="Latest Registered Users" />
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg shadow-sm">
          <Suspense
            fallback={
              <div className="flex justify-center mt-26">
                <Spinner className="size-6" />
              </div>
            }
          >
            <CryptoTrending />
          </Suspense>
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg shadow-sm">
          <AppPieChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-1 xl:col-span-1 2xl:col-span-1 shadow-sm">
          <Suspense
            fallback={
              <div className="flex justify-center mt-26">
                <Spinner className="size-6" />
              </div>
            }
          >
            <AppAreaChart />
          </Suspense>
          {/* <AppBarChart /> */}
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg shadow-sm">
          {/* <CardList title="Popular Content" /> */}

          <Suspense
            fallback={
              <div className="flex justify-center mt-26">
                <Spinner className="size-6" />
              </div>
            }
          >
            <AppBarChart />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
