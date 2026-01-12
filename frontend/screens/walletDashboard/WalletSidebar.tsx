"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import { shortenText } from "@/lib/utils";
import { useConversionRateStore } from "@/store/conversionRateStore";
import {
  Box,
  ChartPie,
  ChevronRight,
  CircleDollarSign,
  CircleQuestionMark,
  Coins,
  House,
  IdCard,
  LogOut,
  Mail,
  Moon,
  Package,
  PlusCircle,
  Send,
  Shield,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import useWindowSize from "@/hooks/useWindowSize";
import { DialogTitle } from "@/components/ui/dialog";
import DepositComponent from "@/components/depositComponents/DepositComponent";
import { useTypeOfDepositStore } from "@/store/typeOfDepositStore";
import { useFundAccountStore } from "@/store/fundAccountStore";
import SendCryptoComponent from "@/components/SendCryptoComponent/SendCryptoComponent";
import ContactUs from "@/components/ContactUs";
import ConnectWalletComponent from "@/components/connectWalletComponents/ConnectWalletComponent";
import CardComponentDrawer from "@/components/CardComponentDrawer";

const WalletSidebar = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { isLoading, unreadMessages } = useTotalCounts();

  const size = useWindowSize();

  const { mutate } = useLogout();
  const { resolvedTheme } = useTheme();
  const { setTypeOfDeposit } = useTypeOfDepositStore();
  const { setIsFundAccount } = useFundAccountStore();

  const [openConnectWallet, setOpenConnectWallet] = useState(false);
  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
  const [openSendCryptoDrawer, setOpenSendCryptoDrawer] = useState(false);
  const [openCardDrawer, setOpenCardDrawer] = useState(false);
  const [openContactUs, setOpenContactUs] = useState(false);

  const logoutUser = async () => {
    await mutate();

    //use timer so it first remove token completely before navigation to avoid _layout redirect glitch seen in the url
    setTimeout(() => {
      router.replace("/auth/login");
    }, 300);
  };

  const { conversionRate } = useConversionRateStore();

  return (
    <div className="h-full flex flex-col justify-between items-center overflow-auto">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div>
          <Image src={"/favicon_logo.png"} alt="logo" width={30} height={30} />
        </div>
        {/* Home */}
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/dashboard">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <House className="size-6" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Home</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col gap-5 px-1 py-4 bg-green-500/30 rounded-full">
            {/* Portfolio */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/wallet">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="cursor-pointer"
                  >
                    <ChartPie className="size-6" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm">Portfolio</p>
              </TooltipContent>
            </Tooltip>

            {/* Assets */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/wallet/assets">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="cursor-pointer"
                  >
                    <Coins className="size-6" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm">Assets</p>
              </TooltipContent>
            </Tooltip>

            {/* Nfts */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/wallet/nfts">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="cursor-pointer"
                  >
                    <Box className="size-6" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm">Nfts</p>
              </TooltipContent>
            </Tooltip>

            {/* Connect Wallet */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                  onClick={() => setOpenConnectWallet(true)}
                >
                  <Wallet className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm">Connect Wallet</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-5 px-1 py-4 bg-red-500/30 rounded-full">
            {/* Deposit */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                  onClick={() => {
                    setTypeOfDeposit("Wallet");
                    setOpenDepositDrawer(true);
                  }}
                >
                  <PlusCircle className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm">Deposit</p>
              </TooltipContent>
            </Tooltip>

            {/* Send Crypto */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                  onClick={() => {
                    setIsFundAccount(false);
                    setOpenSendCryptoDrawer(true);
                  }}
                >
                  <Send className="size-6" />{" "}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm">Send Crypto</p>
              </TooltipContent>
            </Tooltip>

            {/* Fund Trade */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                  onClick={() => {
                    setIsFundAccount(true);
                    setOpenSendCryptoDrawer(true);
                  }}
                >
                  <CircleDollarSign className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm">Fund Trade</p>
              </TooltipContent>
            </Tooltip>

            {/* Card */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                  onClick={() => setOpenCardDrawer(true)}
                >
                  <IdCard className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm">Card</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Reward hub */}
      <div className="flex flex-col gap-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="cursor-pointer"
              onClick={() => setOpenContactUs(true)}
            >
              <CircleQuestionMark className="size-6" />{" "}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-sm">Contact Support</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* User Avatar */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-10 cursor-pointer">
              <AvatarImage src={user && user?.photo} />
              <AvatarFallback>
                {user ? user?.firstname?.[0] + "" + user?.lastname?.[0] : "AA"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            sideOffset={10}
            align="end"
            className="min-w-80 w-80 md:w-100"
          >
            <div className="flex flex-col space-y-2">
              {/* Header */}
              <div className="flex items-center px-2 py-2">
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
                        {shortenText(user?.email || "", 30)}
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
              <div className="flex flex-col px-2 py-2 space-y-3">
                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5" />
                    <span className="font-medium">Balance</span>
                  </div>
                  <span>
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
                  onClick={() => router.push("/admin/mailbox")}
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
      </div>

      {/* CONNECT WALLET SHEET  */}
      <Drawer
        open={openConnectWallet}
        onOpenChange={setOpenConnectWallet}
        direction={size.width && size.width < 1024 ? "bottom" : "right"}
      >
        <DrawerContent
          className="w-full! lg:w-lg lg:max-w-md! min-h-[80%]! xs:min-h-[70%]! h-full lg:h-full! rounded-3xl! lg:rounded-none!"
          showHandle={false}
        >
          <VisuallyHidden>
            <DialogTitle>Connect Wallet</DialogTitle>
          </VisuallyHidden>

          <ScrollArea className="h-full overflow-y-auto">
            {openConnectWallet && <ConnectWalletComponent />}
          </ScrollArea>
        </DrawerContent>
      </Drawer>

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

      {/* SEND CRYPTO DRAWER */}
      <Drawer
        open={openSendCryptoDrawer}
        onOpenChange={setOpenSendCryptoDrawer}
        direction={size.width && size.width < 1024 ? "bottom" : "right"}
      >
        <DrawerContent
          className="w-full! lg:w-lg lg:max-w-md! min-h-[95%]! xs:min-h-[95%]! h-full lg:h-full! rounded-3xl! lg:rounded-none!"
          showHandle={false}
        >
          <VisuallyHidden>
            <DialogTitle>Send Crypto</DialogTitle>
          </VisuallyHidden>

          <ScrollArea className="h-full overflow-y-auto">
            {openSendCryptoDrawer && <SendCryptoComponent />}
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* CARD APPLICATION */}
      <Sheet open={openCardDrawer} onOpenChange={setOpenCardDrawer}>
        <SheetContent className="w-full max-w-md! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Card Application</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto px-2">
            {openCardDrawer && <CardComponentDrawer />}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* CONTACT SUPPORT SHEET  */}
      <Sheet open={openContactUs} onOpenChange={setOpenContactUs}>
        <SheetContent className="w-full! max-w-lg!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Contact Us</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openContactUs && (
              <div className="mx-4">
                <ContactUs />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default WalletSidebar;
