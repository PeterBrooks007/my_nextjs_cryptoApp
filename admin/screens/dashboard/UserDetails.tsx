"use client";

import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  BadgeCheck,
  Candy,
  CheckCircle,
  ChevronRight,
  DollarSign,
  Globe,
  Lock,
  LockKeyhole,
  Phone,
  Shield,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Operators from "@/components/Operators";
import { Switch } from "@/components/ui/switch";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { timeAgo } from "@/lib/utils";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinpaprikaCoin, UserAsset } from "@/types";
import Image from "next/image";

type SwitchKey = "switch1" | "switch2" | "switch3";

interface SwitchState {
  switch1: boolean;
  switch2: boolean;
  switch3: boolean;
}

const UserDetails = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const {
    singleUser,
    isLoading,
    error,
    refetch,
    isRefetching,
    adminLockAccount,
    adminLockAccountLoading,
  } = useUser(id);

  const { allCoins, isLoading: coinpaprikaLoading } = useCoinpaprika(
    singleUser?.currency?.code,
    id
  );

  const combinedAssets = singleUser?.assets?.map((asset: UserAsset) => {
    const priceData = allCoins?.find(
      (price: CoinpaprikaCoin) => price?.symbol === asset?.symbol?.toUpperCase()
    );

    if (priceData) {
      const totalValue =
        asset.balance * priceData?.quotes?.[singleUser?.currency?.code]?.price;
      return {
        ...asset,
        price: priceData?.quotes?.[singleUser?.currency.code]?.price,
        totalValue,
      };
    }
    return { ...asset, price: 0, totalValue: 0 };
  });

  // console.log(combinedAssets);

  const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;

  const totalWalletBalanceManual = Array.isArray(singleUser?.assets)
    ? singleUser?.assets.reduce(
        (total, asset) => total + (asset.ManualFiatbalance || 0),
        0
      )
    : 0;

  const [checked, setChecked] = useState<SwitchState>({
    switch1: singleUser?.accountLock?.generalLock ?? false,
    switch2: singleUser?.accountLock?.upgradeLock ?? false,
    switch3: singleUser?.accountLock?.signalLock ?? false,
  });

  useEffect(() => {
    setTimeout(() => {
      setChecked({
        switch1: singleUser?.accountLock?.generalLock ?? false,
        switch2: singleUser?.accountLock?.upgradeLock ?? false,
        switch3: singleUser?.accountLock?.signalLock ?? false,
      });
    }, 0);
  }, [singleUser?.accountLock]);

  const handleSwitchChange = (switchKey: SwitchKey) => {
    setChecked((prevState) => {
      const newSwitchState = {
        switch1: false,
        switch2: false,
        switch3: false,
        [switchKey]: !prevState[switchKey], // Toggle the current switchKey
      };
      // Schedule a call to handleAccountLock with the updated state
      setTimeout(() => {
        handleAccountLock(newSwitchState);
      }, 500);

      return newSwitchState; // Update the state
    });
  };

  const handleAccountLock = (newSwitchState: SwitchState) => {
    const formData = {
      generalLock: newSwitchState.switch1,
      upgradeLock: newSwitchState.switch2,
      signalLock: newSwitchState.switch3,
    };

    // console.log(formData);
    adminLockAccount({ id, formData });
  };

  if (error) {
    return (
      <p>
        Error fetching data, retry{" "}
        <Button onClick={() => refetch()}>retry</Button>
      </p>
    );
  }

  if (pageLoading || isLoading || adminLockAccountLoading) {
    return (
      <div>
        <div className="flex gap-2 mt-1">
          <Skeleton className="w-[70px] h-4  bg-gray-500/30" />
          <Skeleton className="w-[70px] h-4   bg-gray-500/30" />
          <Skeleton className="w-[70px] h-4  bg-gray-500/30" />
        </div>

        <div className="mt-1 flex flex-col xl:flex-row gap-4">
          <Skeleton className=" h-16 md:h-20  mt-4 bg-gray-500/30  w-full xl:w-1/3 space-y-6" />
          <Skeleton className="hidden xl:flex h-20  mt-4 bg-gray-500/30  w-full xl:w-2/3 space-y-6 " />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={"/dashboard/users"}>Users</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {singleUser?.firstname + " " + singleUser?.lastname}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isRefetching && <Spinner />}
      </div>

      {/* CONTAINER */}
      <div className="mt-4 flex flex-col xl:flex-row gap-4">
        {/* LEFT */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* USER BADES CONTAINER */}
          <div className="bg-primary-foreground p-4 py-4 md:py-7 rounded-lg shadow-sm">
            {/* <h1 className="text-xl font-semibold">User Badges</h1> */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4 mt-0">
                <HoverCard>
                  <HoverCardTrigger>
                    <BadgeCheck
                      size={36}
                      className="rounded-full bg-blue-500/30 border border-blue-500/50 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Verified User</h1>
                    <p className="text-sm text-muted-foreground">
                      This user has been verified by the admin
                    </p>
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                    <Shield
                      size={36}
                      className="rounded-full bg-green-800/30 border border-green-800/50 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Admin</h1>
                    <p className="text-sm text-muted-foreground">
                      Admin users have access to all features and can manage
                      users.
                    </p>
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                    <Candy
                      size={36}
                      className="rounded-full bg-yellow-500/30 border border-yellow-500/50 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Awarded</h1>
                    <p className="text-sm text-muted-foreground">
                      This user has been awarded for their contributions.
                    </p>
                  </HoverCardContent>
                </HoverCard>
                {/* <HoverCard>
                  <HoverCardTrigger>
                    <Citrus
                      size={36}
                      className="rounded-full bg-orange-500/30 border border-orange-500/50 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Popular</h1>
                    <p className="text-sm text-muted-foreground">
                      This user has been popular in the community.
                    </p>
                  </HoverCardContent>
                </HoverCard> */}
              </div>

              <span
                className={`text-sm font-medium inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                  singleUser.isIdVerified === "VERIFIED"
                    ? "bg-green-400 text-green-950"
                    : singleUser?.isIdVerified === "PENDING"
                    ? "bg-orange-500 text-red"
                    : "bg-red-800 text-red"
                }`}
              >
                {singleUser?.isIdVerified === "VERIFIED" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {singleUser?.isIdVerified}
              </span>
            </div>
          </div>
          {/* INFORMATION CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center gap-2">
              <span
                className={`text-xs font-medium inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                  singleUser.isOnline
                    ? "bg-green-400 text-green-950"
                    : "bg-gray-800 text-white"
                }`}
              >
                {singleUser.isOnline ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {singleUser.isOnline ? "Online" : "Offline"}
              </span>

              <Button variant={"ghost"} onClick={() => refetch()}>
                Refresh Data
              </Button>
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              <div className="relative">
                <Avatar className="size-40 border-2">
                  <AvatarImage
                    src={singleUser?.photo}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {singleUser?.firstname?.[0] +
                      "" +
                      singleUser?.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                {/* online indicator with ping */}
                {singleUser.isOnline && (
                  <span className="absolute right-4.5 bottom-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 ring-2 ring-white dark:ring-slate-800"></span>
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center">
                <h1 className="text-xl md:text-2xl font-semibold">
                  {singleUser?.firstname + " " + singleUser?.lastname}
                </h1>
                <h1 className="text-sm md:text-base font-medium">
                  {singleUser?.email}
                </h1>
              </div>
            </div>

            <div className="mt-3 rounded-md px-2 py-2 bg-secondary border-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1 text-sm">
                <Globe className="h-4 w-4" />
                <div>Country: {singleUser.address?.country}</div>
                <Avatar className="h-5 w-5 ml-auto">
                  <AvatarImage
                    src={`https://flagcdn.com/w80/${singleUser?.address?.countryFlag}.png`}
                    alt={`country flag`}
                  />
                  <AvatarFallback>
                    <Globe className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone: {singleUser?.phone}
              </div>

              <div className="text-sm flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password: {singleUser?.password}
              </div>

              <div className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Last seen:{" "}
                {singleUser?.lastSeen === null
                  ? "now"
                  : timeAgo(new Date(singleUser?.lastSeen).getTime())}
              </div>
            </div>

            <div className="mt-2 text-base text-muted-foreground">
              Joined on{" "}
              {(() => {
                const date = new Date(singleUser?.createdAt);
                return date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
              })()}
            </div>
          </div>
          {/* CARD LIST CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg shadow-sm">
            <div className="space-y-4">
              {/* First Box */}
              <div className="w-full p-3 rounded-lg border bg-muted/30 shadow-sm">
                <div className="space-y-4">
                  {/* Demo Balance */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      <span className="text-sm font-medium">Demo Balance</span>
                    </div>
                    <span className="font-semibold">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: singleUser?.currency?.code,
                        ...(singleUser?.demoBalance > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(singleUser?.demoBalance)}
                    </span>
                  </div>

                  {/* Referral Bonus */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      <span className="text-sm font-medium">
                        Referral Bonus
                      </span>
                    </div>
                    <span className="font-semibold">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: singleUser?.currency?.code,
                        ...(singleUser?.referralBonus > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(singleUser?.referralBonus)}
                    </span>
                  </div>

                  {/* Referral System */}
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      <span className="text-sm font-medium">
                        Referral System
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">View</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Box */}
              <div className="w-full p-3 rounded-lg border bg-muted/30 shadow-sm">
                <div className="space-y-4">
                  {/* General Lock */}
                  <div className="flex items-center justify-between cursor-not-allowed">
                    <div className="flex items-center gap-2">
                      <LockKeyhole className="w-7 h-7" />
                      <span className="text-sm font-medium">General Lock</span>
                    </div>
                    <Switch
                      className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
                      checked={checked.switch1}
                      onCheckedChange={() => handleSwitchChange("switch1")}
                      name="switch1"
                    />
                  </div>

                  {/* Upgrade Lock */}
                  <div className="flex items-center justify-between cursor-not-allowed">
                    <div className="flex items-center gap-2">
                      <LockKeyhole className="w-7 h-7" />
                      <span className="text-sm font-medium">Upgrade Lock</span>
                    </div>
                    <Switch
                      className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
                      checked={checked.switch2}
                      onCheckedChange={() => handleSwitchChange("switch2")}
                      name="switch2"
                    />
                  </div>

                  {/* Signal Lock */}
                  <div className="flex items-center justify-between cursor-not-allowed">
                    <div className="flex items-center gap-2">
                      <LockKeyhole className="w-7 h-7" />
                      <span className="text-sm font-medium">Signal Lock</span>
                    </div>
                    <Switch
                      className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
                      checked={checked.switch3}
                      onCheckedChange={() => handleSwitchChange("switch3")}
                      name="switch3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/* USER CARD CONTAINER */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex-1 flex flex-row items-center gap-2 bg-primary-foreground p-4 rounded-lg shadow-sm ">
              <DollarSign
                size={60}
                className="text-green-400 hidden sm:flex lg:hidden 2xl:flex"
              />
              <div>
                <p className="text-lg font-medium leading-5 text-muted-foreground">
                  Trade Balance
                </p>
                <p className="text-2xl font-semibold ">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: singleUser?.currency?.code,
                    ...(singleUser?.balance > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(singleUser?.balance)}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-row items-center gap-2 bg-primary-foreground p-4 rounded-lg shadow-sm">
              <Image
                src="/svgIcons/totalDepositSvgIcon.svg"
                alt="total deposit icon"
                width={60}
                height={60}
                className="hidden sm:flex lg:hidden 2xl:flex"
              />
              <div>
                <p className="text-lg font-medium leading-5 text-muted-foreground">
                  Total Deposit
                </p>
                <p className="text-2xl font-semibold ">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: singleUser?.currency?.code,
                    ...(singleUser?.totalDeposit > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(singleUser?.totalDeposit)}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-row items-center gap-2 bg-primary-foreground p-4 rounded-lg shadow-sm">
              <Image
                src="/svgIcons/earnedSvgIcon.svg"
                alt="total deposit icon"
                width={60}
                height={60}
                className="hidden sm:flex lg:hidden 2xl:flex"
              />
              <div>
                <p className="text-lg font-medium leading-5 text-muted-foreground">
                  Profit Earned
                </p>
                <p className="text-2xl font-semibold">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: singleUser?.currency?.code,
                    ...(singleUser?.earnedTotal > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(singleUser?.earnedTotal)}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-row items-center gap-2 bg-primary-foreground p-4 rounded-lg shadow-sm">
              <Image
                src="/svgIcons/walletSvgIcon.svg"
                alt="total deposit icon"
                width={50}
                height={50}
                className="hidden sm:flex lg:hidden 2xl:flex"
              />
              <div>
                <p className="text-lg font-medium leading-5 text-muted-foreground">
                  Wallet Balance
                </p>
                {singleUser?.isManualAssetMode ? (
                  <p className="text-2xl font-semibold ">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: singleUser?.currency?.code,
                      ...(totalWalletBalanceManual > 999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(totalWalletBalanceManual)}
                  </p>
                ) : (
                  <div className="text-2xl font-semibold ">
                    {coinpaprikaLoading ? (
                      <Skeleton className="w-[100px] h-5 mt-2  bg-gray-500/30" />
                    ) : allCoins.length !== 0 ? (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: singleUser?.currency?.code,
                        ...(totalWalletBalance > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(totalWalletBalance)
                    ) : (
                      "UNAVAILABLE"
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* OPEREATOR CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg shadow-sm">
            <Operators />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
