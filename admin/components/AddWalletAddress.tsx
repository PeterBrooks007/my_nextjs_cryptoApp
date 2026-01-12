"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AutomaticAddWallet from "./AutomaticAddWallet";
import ManuallyAddWallet from "./ManuallyAddWallet";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";

const AddWalletAddress = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  if (pageLoading) {
    return (
      <div className="flex w-full max-w-lg  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col px-4">
      <Tabs defaultValue="automatic">
        <TabsList className="w-full">
          <TabsTrigger value="automatic">Automatic Wallets</TabsTrigger>
          <TabsTrigger value="manual">Manually add wallet</TabsTrigger>
        </TabsList>

        {/* AUTOMATIC WALLET TAB */}
        <TabsContent value="automatic" className="mt-4">
          <AutomaticAddWallet />
        </TabsContent>

        {/* MANUALLY ADD WALLET TAB */}
        <TabsContent value="manual" className="mt-4">
          <ManuallyAddWallet />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddWalletAddress;
