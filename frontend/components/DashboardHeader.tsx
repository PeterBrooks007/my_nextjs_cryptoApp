"use client";

import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  PlusCircle,
  MinusCircle,
  User,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Mail,
  X,
  Laptop,
  ChevronRight,
  Package,
  Shield,
  CircleDollarSign,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";
import { Separator } from "./ui/separator";
import { shortenText } from "@/lib/utils";
import AllUserNotifications from "./AllUserNotifications";
import { useState } from "react";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ScrollArea } from "./ui/scroll-area";
import { Drawer, DrawerContent } from "./ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import DepositComponent from "./depositComponents/DepositComponent";
import { useTypeOfDepositStore } from "@/store/typeOfDepositStore";
import WithdrawalComponents from "./withdrawalComponents/WithdrawalComponents";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import Settings from "./Settings";
import { useConversionRateStore } from "@/store/conversionRateStore";
import Image from "next/image";

export default function DashboardHeader() {
  const router = useRouter();

  const size = useWindowSize();

  const { resolvedTheme, theme, setTheme } = useTheme();

  const { data: user } = useCurrentUser();
  const { setTypeOfDeposit } = useTypeOfDepositStore();

  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
  const [openWithdrawalDrawer, setOpenWithdrawerDrawer] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openSettings, setOpenSetting] = useState(false);

  const { conversionRate } = useConversionRateStore();

  const { isLoading, unreadMessages, newNotifications } = useTotalCounts();

  const { mutate } = useLogout();

  const logoutUser = async () => {
    await mutate();

    //use timer so it first remove token completely before navigation to avoid _layout redirect glitch seen in the url
    setTimeout(() => {
      router.replace("/auth/login");
    }, 300);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <div className="flex items-start justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-12 sm:size-13 lg:size-15 border-2 border-green-500 overflow-hidden">
              {user?.photo ? (
                <Image
                  src={user.photo}
                  alt={`${user.firstname} ${user.lastname}`}
                  width={80}
                  height={80}
                  sizes="(max-width: 640px) 48px, (max-width: 1024px) 52px, 60px"
                  className="h-full w-full object-cover"
                />
              ) : (
                <AvatarFallback>
                  {user?.firstname?.[0]}
                  {user?.lastname?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            {/* online indicator with ping */}
            <span className="absolute ring-2 ring-white dark:ring-slate-800 right-1 bottom-1 rounded-full flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 "></span>
            </span>
          </div>

          <div>
            <p className="hidden lg:block text-lg font-semibold">
              {greeting()} {user?.firstname}
            </p>

            <p className="lg:hidden font-semibold">Hi, {user?.firstname}</p>

            <p className="hidden lg:block text-sm text-muted-foreground">
              Take a Comprehensive dive into trading.
            </p>

            <p className="lg:hidden text-xs text-muted-foreground">
              {greeting()}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* Deposit / Withdraw */}
          <div className="hidden lg:flex gap-2">
            <Button
              variant="outline"
              className="border-green-700! text-green-700! dark:border-green-400! dark:text-green-400!"
              onClick={() => {
                setTypeOfDeposit("Trade");
                setOpenDepositDrawer(true);
              }}
            >
              <PlusCircle />
              DEPOSIT
            </Button>

            <Button
              variant="outline"
              className="border-green-700! text-green-700! dark:border-green-400! dark:text-green-400!"
              onClick={() => {
                // setTypeOfDeposit("Trade");
                setOpenWithdrawerDrawer(true);
              }}
            >
              <MinusCircle />
              WITHDRAW
            </Button>
          </div>

          {/* THEME MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative overflow-hidden  bg-[#f2f2f2] text-[#202020] dark:bg-muted dark:text-white border-none"
              >
                <Sun className="h-[1.3rem]! w-[1.3rem]! scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.3rem]! w-[1.3rem]! scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className={theme === "light" ? "bg-green-600 text-white" : ""}
                onClick={() => setTheme("light")}
              >
                <Sun className={theme === "light" ? "text-white" : ""} /> Light
              </DropdownMenuItem>
              <DropdownMenuItem
                className={theme === "dark" ? "bg-green-600 text-white" : ""}
                onClick={() => setTheme("dark")}
              >
                <Moon className={theme === "dark" ? "text-white" : ""} /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                className={theme === "system" ? "bg-green-600 text-white" : ""}
                onClick={() => setTheme("system")}
              >
                <Laptop className={theme === "system" ? "text-white" : ""} />{" "}
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* SETTINGS */}
          <Button
            size="icon"
            variant="outline"
            className="hidden lg:flex  bg-[#f2f2f2] text-[#202020] dark:bg-muted dark:text-white border-none"
            onClick={() => setOpenSetting(true)}
          >
            <SettingsIcon className="size-5" />
          </Button>

          {/* PROFILE MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className=" bg-[#f2f2f2] text-[#202020] dark:bg-muted dark:text-white border-none"
              >
                <User className="size-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              sideOffset={10}
              align={size.width && size.width < 640 ? "center" : "end"}
              className="min-w-70 w-80 xs:w-90 md:w-100 mr-2 z-1001"
            >
              <div className="flex flex-col space-y-2">
                {/* Header */}
                <div className="flex items-center px-4 py-2">
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <Avatar className="size-12">
                          <AvatarImage src={user?.photo} />
                          <AvatarFallback>
                            {user?.firstname?.[0] + "" + user?.lastname?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-base sm:text-xl font-semibold">
                          {user?.firstname + " " + user?.lastname}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {shortenText(user?.email || "", 25)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border border-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </DropdownMenuItem>
                  </div>
                </div>

                <Separator />

                {/* Account info */}
                <div className="flex flex-col px-4 py-2 space-y-3">
                  <div className="flex justify-between items-center cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-5 w-5" />
                      <span className="font-medium">Balance</span>
                    </div>
                    <span>
                      {" "}
                      {conversionRate?.rate
                        ? Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate.code ?? "USD",
                            ...((user?.balance ?? 0) * conversionRate.rate >
                            9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format((user?.balance ?? 0) * conversionRate.rate)
                        : Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code ?? "USD",
                            ...((user?.balance ?? 0) > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.balance ?? 0)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Account Type</span>
                    </div>
                    {user?.accounttype}
                  </div>

                  <div className="flex justify-between items-center cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      <span className="font-medium">Package Plan</span>
                    </div>
                    {user?.package}
                  </div>
                </div>

                <Separator />

                {/* Other actions */}
                <div className="flex flex-col px-4 py-2 space-y-3">
                  {/* Messages */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => router.push("/dashboard/mailbox")}
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      <span className="font-medium">Message</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {isLoading ? (
                          <Spinner />
                        ) : unreadMessages > 0 ? (
                          unreadMessages
                        ) : (
                          0
                        )}
                      </span>
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Theme toggle */}
                  <div className="flex justify-between items-center cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Moon className="h-5 w-5" />
                      <span className="font-medium">Theme</span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      // onClick={() => colorMode.toggleColorMode()}
                    >
                      <span className="text-sm">{resolvedTheme} mode</span>
                    </div>
                  </div>

                  {/* Profile */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span className="font-medium">My Profile</span>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>

                <Separator />

                {/* Logout */}
                <div
                  className="flex items-center gap-2 px-4 py-2 text-red-600 cursor-pointer"
                  onClick={logoutUser}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* MESSAGE */}
          <div className="relative hidden lg:block">
            <Link href={"/dashboard/mailbox"}>
              <Button
                variant="outline"
                size="icon"
                className="relative  bg-[#f2f2f2] text-[#202020] dark:bg-muted dark:text-white border-none"
              >
                <Mail className="h-[1.3rem]! w-[1.3rem]!" />
              </Button>

              {/* Badge */}
              <Badge
                className="absolute -top-1.5 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums opacity-100 bg-red-600 text-white pointer-events-none "
                // variant="destructive"
              >
                {isLoading ? (
                  <Spinner />
                ) : unreadMessages > 100 ? (
                  "99+"
                ) : (
                  unreadMessages
                )}
              </Badge>
            </Link>
          </div>

          {/* NOTIFICATION */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative  bg-[#f2f2f2] text-[#202020] dark:bg-muted dark:text-white border-none"
                >
                  <Bell className="h-[1.3rem]! w-[1.3rem]!" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                sideOffset={10}
                align={size.width && size.width < 640 ? "center" : "end"}
                className="mr-2 ml-2 z-1001"
              >
                <AllUserNotifications showAllNotification={false} />

                {/* View All Button */}
                <div className="p-4 border-t mt-5  text-center">
                  <DropdownMenuItem asChild>
                    <Button
                      className="w-full text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setOpenNotifications(true)}
                    >
                      View All Notifications
                    </Button>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Badge — placed outside DropdownMenu */}
            <Badge className="absolute -top-1.5 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-blue-500 text-white pointer-events-none">
              {isLoading ? (
                <Spinner />
              ) : newNotifications > 100 ? (
                "99+"
              ) : (
                newNotifications
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-0 flex items-center justify-between lg:hidden">
        {/* LEFT ICONS */}
        <div className="flex gap-2">
          <Link href={"/dashboard/mailbox"}>
            <Button
              size="icon"
              className="relative rounded-lg bg-[#f2f2f2] text-[#202020] dark:bg-muted dark:text-white"
            >
              <Badge
                variant="destructive"
                className="absolute -top-1.5 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums pointer-events-none"
              >
                {unreadMessages}
              </Badge>
              <Mail className="size-5" />
            </Button>
          </Link>

          <Button
            size="icon"
            className="rounded-lg bg-[#f2f2f2] text-[#202020] dark:bg-muted dark:text-white"
            onClick={() => router.push("/wallet")}
          >
            <Wallet className="size-5" />
          </Button>

          <Button
            size="icon"
            className="rounded-lg bg-[#f2f2f2] text-[#202020] dark:bg-muted dark:text-white"
            // onClick={handleOpenSettingsMenu}
          >
            <SettingsIcon className="size-5" />
          </Button>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-9.25 rounded-lg border-[#CC5500]! text-[#CC5500]!  dark:border-orange-400! dark:text-orange-400!"
            onClick={() => {
              setTypeOfDeposit("Trade");
              setOpenDepositDrawer(true);
            }}
            style={{
              color: resolvedTheme === "light" ? "#CC5500" : "orange",
              borderColor:
                resolvedTheme === "light" ? "#CC5500 !important" : "orange",
            }}
          >
            <PlusCircle className=" hidden min-[413px]:inline h-4 w-4" />
            Deposit
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-9.25 rounded-lg border-[#CC5500]! text-[#CC5500]!  dark:border-orange-400! dark:text-orange-400!"
            onClick={() => {
              setOpenWithdrawerDrawer(true);
            }}
          >
            <MinusCircle className=" hidden min-[413px]:inline h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </div>

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
            {openDepositDrawer && <DepositComponent />}
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* WITHDRAWAL DRAWER */}
      <Drawer
        open={openWithdrawalDrawer}
        onOpenChange={setOpenWithdrawerDrawer}
        direction={size.width && size.width < 1024 ? "bottom" : "right"}
      >
        <DrawerContent
          className="w-full! lg:w-lg lg:max-w-md! min-h-[95%]! xs:min-h-[95%]! h-full lg:h-full! rounded-3xl! lg:rounded-none!"
          showHandle={false}
        >
          <VisuallyHidden>
            <DialogTitle>Withdraw Funds</DialogTitle>
          </VisuallyHidden>

          <ScrollArea className="h-full overflow-y-auto">
            {openWithdrawalDrawer && <WithdrawalComponents />}
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* All Notification Drawer Sheet */}
      <Sheet open={openNotifications} onOpenChange={setOpenNotifications}>
        <SheetContent className="w-full min-w-full sm:min-w-md! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">All Notification</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto -mt-4 -mb-2 ">
            {openNotifications && (
              <AllUserNotifications showAllNotification={true} />
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Settings Drawer Sheet */}
      <Sheet open={openSettings} onOpenChange={setOpenSetting}>
        <SheetContent className="w-full min-w-md! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Settings</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto px-4">
            {openSettings && <Settings />}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
