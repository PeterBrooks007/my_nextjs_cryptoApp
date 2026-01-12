import TradeSettings from "@/screens/dashboard/TradeSettings";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Trade Settings</h1>
      </div>
      <TradeSettings />
    </div>
  );
};

export default page;
