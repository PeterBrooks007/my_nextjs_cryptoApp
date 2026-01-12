import React from "react";
import TradingSignals from "@/screens/dashboard/TradingSignals";

const TradingSignalsPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Trading Signals</h1>
      </div>
      <TradingSignals />{" "}
    </div>
  );
};

export default TradingSignalsPage;
