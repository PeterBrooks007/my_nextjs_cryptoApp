"use client";

import {
  Bell,
  ChevronRight,
  CircleDollarSign,
  Laptop,
  LogOut,
  Mail,
  Moon,
  Package,
  SearchIcon,
  Shield,
  Sun,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "./ui/sidebar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import { Spinner } from "./ui/spinner";
import { Badge } from "./ui/badge";
import AllAdminNotifications from "./AllAdminNotifications";
import { shortenText } from "@/lib/utils";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";

const Navbar = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const { isLoading, unreadMessages, newNotifications } = useTotalCounts();

  const { mutate } = useLogout();

  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);

  // const { toggleSidebar } = useSidebar(); // manually toggle sidebar

  const logoutUser = async () => {
    await mutate();

    //use timer so it first remove token completely before navigation to avoid _layout redirect glitch seen in the url
    setTimeout(() => {
      router.replace("/auth/login");
    }, 300);
  };

  return (
    <nav className="bg-primary-foreground p-4 flex items-center justify-between sticky top-0 z-10 shadow">
      {/* LEFT */}
      <div className="flex items-center gap-2 xs:gap-4 mr-1">
        <SidebarTrigger />
        <div className="w-24 sm:w-42 lg:w-md xl:w-lg">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      {/* <Button variant={"outline"} onClick={toggleSidebar}>
        Custom Button
      </Button> */}

      {/* RIGHT */}
      <div className="flex items-center gap-2 xs:gap-3 md:gap-4">
        {/* <Link href="/">Dashboard</Link> */}

        {/* THEME MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.3rem]! w-[1.3rem]! scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.3rem]! w-[1.3rem]! scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* MESSAGE */}
        <div className="relative">
          <Button variant="outline" size="icon" className="relative">
            <Mail className="h-[1.3rem]! w-[1.3rem]!" />
          </Button>

          {/* Badge */}
          <Badge
            className="absolute -top-1.5 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums opacity-100 bg-red-600 text-white pointer-events-none"
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
        </div>

        {/* NOTIFICATION */}
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-[1.3rem]! w-[1.3rem]!" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              sideOffset={10}
              align="center"
              className="mr-2"
            >
              <AllAdminNotifications showAllNotification={false} />

              {/* View All Button */}
              <div className="p-4 border-t  text-center">
                <DropdownMenuItem asChild>
                  <Button
                    className="w-full text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setOpen(true)}
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

        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-10">
              <AvatarImage src={user && user?.photo} />
              <AvatarFallback>
                {user ? user?.firstname?.[0] + "" + user?.lastname?.[0] : "AA"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            sideOffset={10}
            align="end"
            className="min-w-80 w-80 md:w-[400px]"
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
                      <p className="text-sm sm:text-base text-muted-foreground">
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
              <div className="flex flex-col px-4 py-2 space-y-3">
                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5" />
                    <span className="font-medium">Balance</span>
                  </div>
                  <span>$0.00</span>
                </div>

                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Account Type</span>
                  </div>
                </div>

                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">Package Plan</span>
                  </div>
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
                      {unreadMessages}
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
                    <span className="text-sm">{theme} mode</span>
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

      {/* All Notification Drawer Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">All Notification</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto -mt-4 -mb-2 ">
            <AllAdminNotifications showAllNotification={true} />
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
