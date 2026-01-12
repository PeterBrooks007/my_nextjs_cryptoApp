import ExpertTrader from "@/screens/dashboard/ExpertTrader";
import React from "react";

const ExpertTraderPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Expert Traders</h1>
      </div>
      <ExpertTrader />
    </div>
  );
};

export default ExpertTraderPage;
