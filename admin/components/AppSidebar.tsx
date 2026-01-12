"use client";

import React from "react";
import {
  Home,
  Settings,
  Users,
  ChevronRight,
  Mail,
  Wallet,
  UsersRound,
  ChartCandlestick,
  Bot,
  ChartNoAxesCombined,
  Box,
  Download,
  UploadIcon,
  KeyRound,
  LockKeyhole,
  Sparkles,
  ChevronsUpDown,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import { usePathname } from "next/navigation";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import { Spinner } from "./ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useCurrentUser } from "@/hooks/useAuth";

const overview = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },

  {
    title: "All-Users",
    url: "/dashboard/users",
    icon: Users,
  },
];

const settingsArr = [
  {
    title: "Wallet Address",
    url: "/dashboard/wallet-address",
    icon: Wallet,
  },

  {
    title: "Expert Traders",
    url: "/dashboard/expert-traders",
    icon: UsersRound,
  },
  {
    title: "Trading Pairs",
    url: "/dashboard/trade-settings",
    icon: ChartCandlestick,
  },
];

const moreSettingsArr = [
  {
    title: "Connect Wallet",
    url: "/dashboard/connect-wallet",
    icon: Wallet,
  },

  {
    title: "Trading Bots",
    url: "/dashboard/trading-bots",
    icon: Bot,
  },
  {
    title: "Trading Signals",
    url: "/dashboard/trading-signals",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Nft Settings",
    url: "/dashboard/nfts",
    icon: Box,
  },
];

const requestsArr = [
  {
    title: "Deposit Request",
    url: "/dashboard/deposit-request",
    icon: UploadIcon,
  },

  {
    title: "Withdrawal Request",
    url: "/dashboard/withdrawal-request",
    icon: Download,
  },
];

const securityArr = [
  {
    title: "Change Password",
    url: "/dashboard/change-password",
    icon: KeyRound,
  },

  {
    title: "2fa Authentication",
    url: "/dashboard/2fa-authentication",
    icon: LockKeyhole,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { data: user } = useCurrentUser();
  const { toggleSidebar } = useSidebar(); // ✅ Add this
  const { isLoading, unreadMessages } = useTotalCounts();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"}>
                <Image
                  src={"/Racket-logo.png"}
                  alt="logo"
                  width={30}
                  height={30}
                />
                <span className="text-xl">Tradexs10</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="-ml-0.5" />
      <SidebarContent className="gap-1">
        {/* Dashboard & all users */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overview.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size={"lg"}
                    className="h-10 text-base"
                    asChild
                    isActive={pathname === item.url ? true : false}
                    onClick={() => {
                      if (isMobile) toggleSidebar(); // ✅ Only closes on small screens
                    }}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-6!" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MailBox */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">MailBox</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size={"lg"}
                  className="h-10 text-base"
                  asChild
                  isActive={pathname === "/dashboard/mailbox" ? true : false}
                  onClick={() => {
                    if (isMobile) toggleSidebar();
                  }}
                >
                  <Link href={"/dashboard/mailbox"}>
                    <Mail className="size-6!" /> Mailbox
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge className="min-w-7 min-h-7 size-auto bg-green-300/50  text-sm border border-green-500/80 rounded-full -mt-1">
                  {isLoading ? (
                    <Spinner />
                  ) : unreadMessages > 100 ? (
                    "99+"
                  ) : (
                    unreadMessages
                  )}
                </SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsArr.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size={"lg"}
                    className="h-10 text-base"
                    asChild
                    isActive={pathname === item.url ? true : false}
                    onClick={() => {
                      if (isMobile) toggleSidebar(); // ✅ Only closes on small screens
                    }}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-6!" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* More setting collapsible */}
              <Collapsible defaultOpen={false} className="group">
                {/* Parent menu item */}
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="h-10 text-base flex items-center justify-between"
                      asChild
                      isActive={pathname === "" ? true : false}
                    >
                      <Link href="#">
                        <div className="flex items-center gap-2">
                          <Settings className="size-6 shrink-0" />
                          <span>More Settings</span>
                        </div>
                        <ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>

                {/* Submenu */}
                <CollapsibleContent className="ml-8 mt-1 space-y-1">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {moreSettingsArr.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            size={"lg"}
                            className="h-10 text-base"
                            asChild
                            isActive={pathname === item.url ? true : false}
                            onClick={() => {
                              if (isMobile) toggleSidebar(); // ✅ Only closes on small screens
                            }}
                          >
                            <Link href={item.url}>
                              <item.icon className="size-6!" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Request */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Request</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {requestsArr.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size={"lg"}
                    className="h-10 text-base"
                    asChild
                    isActive={pathname === "" ? true : false}
                    onClick={() => {
                      if (isMobile) toggleSidebar(); // ✅ Only closes on small screens
                    }}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-6!" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Security */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Security</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {securityArr.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size={"lg"}
                    className="h-10 text-base"
                    asChild
                    isActive={item.title === "Overview" ? true : false}
                    onClick={() => {
                      if (isMobile) toggleSidebar(); // ✅ Only closes on small screens
                    }}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-6!" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="-ml-0.5" />

      <SidebarFooter>
        {/* Nav User */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      src={user && user?.photo}
                      alt={user?.firstname}
                    />
                    <AvatarFallback className="rounded-full">
                      {user
                        ? user?.firstname?.[0] + "" + user?.lastname?.[0]
                        : "AA"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user && user?.firstname + " " + user?.lastname}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage src={user?.photo} alt={user?.firstname} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user && user?.firstname + " " + user?.lastname}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Nav User */}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
