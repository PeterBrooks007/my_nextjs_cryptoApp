"use client";

import React, { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

import {
  BoxIcon,
  SearchIcon,
  IdCard,
  TrendingUp,
  Pencil,
  PlusCircle,
  MinusCircle,
  Wallet,
  BarChart2,
  History,
  Send,
  Hand,
  DollarSign,
  CheckCircle,
  Globe,
  Activity as ActivityIcon,
  Copy,
  Mail,
  Lock,
  Gift,
  Bell,
} from "lucide-react";

import IdApproval from "./adminOperators/IdApproval";
import AutoTradeSettings from "./adminOperators/AutoTradeSettings";
import { useSheetStore } from "@/store/sheetStore";
import { ScrollArea } from "./ui/scroll-area";
import EditProfile from "./adminOperators/EditProfile";
import BalanceUpdate from "./adminOperators/BalanceUpdate";
import WalletUpdate from "./adminOperators/WalletUpdate";
import Trade from "./adminOperators/Trade";
import DepositHistory from "./adminOperators/DepositHistory";
import WithdrawalHistory from "./adminOperators/WithdrawalHistory";
import ResidencyApproval from "./adminOperators/ResidencyApproval";
import DemoAccount from "./adminOperators/DemoAccount";
import EmailVerification from "./adminOperators/EmailVerification";
import ChangeCurrency from "./adminOperators/ChangeCurrency";
import WithdrawalLock from "./adminOperators/WithdrawalLock";
import WalletTransactions from "./adminOperators/WalletTransactions";
import TradeHistory from "./adminOperators/TradeHistory";
import UserNotifications from "./adminOperators/UserNotifications";
import GiftsRewards from "./adminOperators/GiftsRewards";
import NftSettingsApproval from "./adminOperators/NftSettingsApproval";
import CopyTrader from "./adminOperators/CopyTrader";
import CustomizeMail from "./adminOperators/CustomizeMail";

type OperatorItem = {
  id: string;
  titleTop: string;
  titleBottom: string;
  bg: string;
  icon: React.ReactNode;
  sheetClassName?: string;
  component?: React.ComponentType<{ type?: string; isTradeorder?: boolean }>;
  props?: { type: string; isTradeorder?: boolean };
};

const OPERATOR_ITEMS: OperatorItem[] = [
  {
    id: "identity-approval",
    titleTop: "Identity",
    titleBottom: "Approval",
    bg: "bg-orange-400",
    icon: <IdCard className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: IdApproval,
  },
  {
    id: "autotrade-settings",
    titleTop: "AutoTrade",
    titleBottom: "Settings",
    bg: "bg-red-700",
    icon: <TrendingUp className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: AutoTradeSettings,
  },
  {
    id: "edit-account",
    titleTop: "Edit",
    titleBottom: "Account",
    bg: "bg-sky-500",
    icon: <Pencil className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: EditProfile,
  },
  {
    id: "fund-trade-bal",
    titleTop: "Fund",
    titleBottom: "Trade_Bal",
    bg: "bg-green-600",
    icon: <PlusCircle className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: BalanceUpdate,
  },
  {
    id: "debit-trade-bal",
    titleTop: "Debit",
    titleBottom: "Trade_Bal",
    bg: "bg-red-600",
    icon: <MinusCircle className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: BalanceUpdate,
    props: { type: "debit" },
  },
  {
    id: "fund-wallet",
    titleTop: "Fund",
    titleBottom: "Wallet",
    bg: "bg-violet-300",
    icon: <Wallet className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: WalletUpdate,
  },
  {
    id: "debit-wallet",
    titleTop: "Debit",
    titleBottom: "Wallet",
    bg: "bg-red-600",
    icon: <MinusCircle className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: WalletUpdate,
    props: { type: "debit" },
  },
  {
    id: "live-trade",
    titleTop: "Live",
    titleBottom: "Trade",
    bg: "bg-fuchsia-500",
    icon: <TrendingUp className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: Trade,
    props: { type: "Live" },
  },
  {
    id: "demo-trade",
    titleTop: "Demo",
    titleBottom: "Trade",
    bg: "bg-sky-300",
    icon: <BarChart2 className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: Trade,
    props: { type: "Demo" },
  },
  {
    id: "trade-history",
    titleTop: "Trade",
    titleBottom: "History",
    bg: "bg-orange-400",
    icon: <History className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: TradeHistory,
    props: { type: "Live" },
  },
  {
    id: "deposit-history",
    titleTop: "Deposit",
    titleBottom: "History",
    bg: "bg-yellow-300",
    icon: <Send className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: DepositHistory,
  },
  {
    id: "withdrawal-request",
    titleTop: "Withdrawal",
    titleBottom: "Request",
    bg: "bg-red-800",
    icon: <Hand className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: WithdrawalHistory,
  },
  {
    id: "wallet-transactions",
    titleTop: "Wallet",
    titleBottom: "Transactions",
    bg: "bg-orange-400",
    icon: <DollarSign className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: WalletTransactions,
  },
  {
    id: "residency-approval",
    titleTop: "Residency",
    titleBottom: "Approval",
    bg: "bg-yellow-400",
    icon: <CheckCircle className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: ResidencyApproval,
  },
  {
    id: "demo-request",
    titleTop: "Demo",
    titleBottom: "Request",
    bg: "bg-cyan-300",
    icon: <Globe className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: DemoAccount,
  },
  {
    id: "trade-orders",
    titleTop: "Trade",
    titleBottom: "Orders",
    bg: "bg-green-600",
    icon: <ActivityIcon className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: TradeHistory,
    props: { type: "Live", isTradeorder: true },
  },
  {
    id: "email-verification",
    titleTop: "Email",
    titleBottom: "Verification",
    bg: "bg-green-700",
    icon: <Pencil className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: EmailVerification,
  },
  {
    id: "change-currency",
    titleTop: "Change",
    titleBottom: "Currency",
    bg: "bg-yellow-400",
    icon: <DollarSign className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: ChangeCurrency,
  },
  {
    id: "copy-trader",
    titleTop: "Copied",
    titleBottom: "Trader",
    bg: "bg-red-700",
    icon: <Copy className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-5xl! 2xl:max-w-6xl!",
    component: CopyTrader,
  },
  {
    id: "customize-email",
    titleTop: "Customize",
    titleBottom: "Email",
    bg: "bg-sky-500",
    icon: <Mail className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-5xl! 2xl:max-w-6xl!",
    component: CustomizeMail,
  },
  {
    id: "withdrawal-locks",
    titleTop: "Withdrawal",
    titleBottom: "lock",
    bg: "bg-red-800",
    icon: <Lock className="w-5 h-5 text-white" />,
    sheetClassName: "max-w-lg!",
    component: WithdrawalLock,
  },
  {
    id: "nft-settings",
    titleTop: "NFT",
    titleBottom: "Settings",
    bg: "bg-sky-300",
    icon: <BoxIcon className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-5xl! 2xl:max-w-6xl!",
    component: NftSettingsApproval,
  },
  {
    id: "gift-reward",
    titleTop: "Gift",
    titleBottom: "Reward",
    bg: "bg-violet-400",
    icon: <Gift className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: GiftsRewards,
  },
  {
    id: "user-notifications",
    titleTop: "User",
    titleBottom: "Notifications",
    bg: "bg-fuchsia-500",
    icon: <Bell className="w-5 h-5 text-black" />,
    sheetClassName: "max-w-lg!",
    component: UserNotifications,
  },
];

const Operators = () => {
  const { openOperatorSheet, setOpenOperatorSheet } = useSheetStore();

  const [activeItem, setActiveItem] = useState<OperatorItem | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredOperators = OPERATOR_ITEMS.filter((operator) =>
    operator.id.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-xl font-semibold">Operators</h1>
        <div className="w-[120px] md:w-[200px] h-9">
          <InputGroup>
            <InputGroupInput
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 2xl:grid-cols-3 mt-6">
        {filteredOperators.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center gap-3 p-4 rounded-2xl border border-gray-300 dark:border-gray-600 hover:shadow-lg transition-shadow duration-150 w-full text-left"
            )}
            type="button"
            onClick={() => {
              setActiveItem(item); // Set the selected object
              setOpenOperatorSheet(true);
            }}
          >
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-md",
                item.bg
              )}
            >
              {item.icon}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium leading-tight">
                {item.titleTop}
              </span>
              <span className="text-base font-medium leading-tight">
                {item.titleBottom}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* --- Dynamic Sheet --- */}
      <Sheet open={openOperatorSheet} onOpenChange={setOpenOperatorSheet}>
        {activeItem && (
          <SheetContent
            className={cn(
              "w-full! data-[state=closed]:duration-300 data-[state=open]:duration-300",
              activeItem.sheetClassName
            )}
          >
            <SheetHeader className="border-b">
              <SheetTitle>
                {activeItem.titleTop} {activeItem.titleBottom}
              </SheetTitle>
            </SheetHeader>

            <ScrollArea className="h-full overflow-y-auto">
              <div className="py-0">
                {activeItem.component ? (
                  <activeItem.component {...activeItem.props} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p>Coming Soon: {activeItem.titleBottom}</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <SheetFooter className="border-t pt-4">
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        )}
      </Sheet>
    </>
  );
};

export default Operators;
