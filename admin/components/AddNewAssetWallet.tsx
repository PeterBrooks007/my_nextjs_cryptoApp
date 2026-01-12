"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import AutomaticAddAssetWallet from "./AutomaticAddAssetWallet";
import ManuallyAddAssetWallet from "./ManuallyAddAssetWallet";

const AddNewAssetWallet = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  if (pageLoading) {
    return (
      <div className="flex w-full max-w-lg  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col px-0">
      <Tabs defaultValue="automatic">
        <TabsList className="w-full">
          <TabsTrigger value="automatic">Automatic Wallets</TabsTrigger>
          <TabsTrigger value="manual">Manually add wallet</TabsTrigger>
        </TabsList>

        {/* AUTOMATIC WALLET TAB */}
        <TabsContent value="automatic" className="mt-4">
          <AutomaticAddAssetWallet />
        </TabsContent>

        {/* MANUALLY ADD WALLET TAB */}
        <TabsContent value="manual" className="mt-4">
          <ManuallyAddAssetWallet />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddNewAssetWallet;
