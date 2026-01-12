import TradingBots from "@/screens/dashboard/TradingBots";
import React from "react";

const TradingBotPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Trading Bots</h1>
      </div>
      <TradingBots />
    </div>
  );
};

export default TradingBotPage;
