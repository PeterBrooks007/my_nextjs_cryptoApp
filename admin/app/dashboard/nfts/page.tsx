import NftSettings from "@/screens/dashboard/NftSettings";
import React from "react";

const NftsPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Nft settings</h1>
      </div>
      <NftSettings />
    </div>
  );
};

export default NftsPage;
