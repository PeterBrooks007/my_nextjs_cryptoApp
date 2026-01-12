import WalletAddress from "@/screens/dashboard/WalletAddress";
import React from "react";

const WalletAddressPage = () => {
  return (
    <div className="">
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Wallet Address</h1>
      </div>
      <WalletAddress />
    </div>
  );
};

export default WalletAddressPage;
