"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Mail, Laptop } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useAuth";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import { Spinner } from "./ui/spinner";

import AllUserNotifications from "./AllUserNotifications";
import useWindowSize from "@/hooks/useWindowSize";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import Image from "next/image";

export default function TopBar() {
  const { theme, setTheme } = useTheme();

  const size = useWindowSize();

  const { data: user } = useCurrentUser();
  const [openNotifications, setOpenNotifications] = useState(false);

  const { isLoading, unreadMessages, newNotifications } = useTotalCounts();

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
                <div className="relative w-full h-full">
                  <Image
                    src={user.photo}
                    alt={`${user.firstname} ${user.lastname}`}
                    fill
                    sizes="(max-width: 640px) 48px, (max-width: 1024px) 52px, 60px"
                    className="object-cover rounded-full"
                  />
                </div>
              ) : (
                <AvatarFallback>
                  {user
                    ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`
                    : ""}
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
            <p className=" font-semibold">Hi, {user?.firstname}</p>

            <p className=" text-xs text-muted-foreground">{greeting()}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
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
                className={theme === "light" ? "bg-green-600 text-white text-base" : "text-base"}
                onClick={() => setTheme("light")}
              >
                <Sun className={theme === "light" ? "text-white size-5" : "size-5"} /> Light
              </DropdownMenuItem>
              <DropdownMenuItem
                className={theme === "dark" ? "bg-green-600 text-white text-base" : "text-base"}
                onClick={() => setTheme("dark")}
              >
                <Moon className={theme === "dark" ? "text-white size-5" : "size-5"} /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                className={theme === "system" ? "bg-green-600 text-white text-base" : "text-base"}
                onClick={() => setTheme("system")}
              >
                <Laptop className={theme === "system" ? "text-white size-5" : "size-5"} />{" "}
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* MESSAGE */}
          <Link href={"/dashboard/mailbox"}>
            <div className="relative ">
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
            </div>
          </Link>

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
    </>
  );
}
