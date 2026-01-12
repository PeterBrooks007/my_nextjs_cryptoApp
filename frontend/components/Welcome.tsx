import React from "react";
import DashboardHeader from "./DashboardHeader";
import { ArrowRight, ArrowUpWideNarrow, Compass, Gift } from "lucide-react";
import GiftSlider from "./GiftSlider";
import TradeBalanceComponent from "./TradeBalanceComponent";
import QuickActions from "./QuickActions";
import TopCryptocurrencies from "./TopCryptocurrencies";

const Welcome = () => {
  return (
    <div className="space-y-4">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Total balance, Profit earned, total deposit section */}
      <TradeBalanceComponent />

      {/* Quick action section*/}
      <div className="flex lg:hidden flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mx-1.25">
          <div className="flex items-center gap-1 mb-1.5">
            <Compass size={22} />
            <p className="text-sm font-semibold whitespace-nowrap">
              Quick Links
            </p>
          </div>
          <ArrowRight size={20} />
        </div>

        <QuickActions />
      </div>

      {/* Top cryptocurrencies section*/}
      <div>
        {/* Header */}
        <div className="flex md:hidden items-center justify-between mx-1.25">
          <div className="flex items-center gap-1 mb-2">
            <ArrowUpWideNarrow size={22} />
            <p className="text-sm font-semibold whitespace-nowrap">
              Top Cryptocurrency
            </p>
          </div>
          <ArrowRight size={20} />
        </div>

        <TopCryptocurrencies />
      </div>

      {/* promos and reminders section */}
      <div className="flex md:hidden flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mx-1">
          <div className="flex items-center gap-1 mb-1">
            <Gift size={22} />
            <p className="text-sm font-semibold whitespace-nowrap">
              Promos and Reminders
            </p>
          </div>
          <ArrowRight size={20} />
        </div>

        <div className="w-full h-full">
          <GiftSlider />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
