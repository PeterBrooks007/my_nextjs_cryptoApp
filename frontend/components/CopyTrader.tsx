"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ClientTraders from "./ClientTraders";
import AllTraders from "./AllTraders";

const CopyTrader = () => {
  // const [pageLoading, setPageLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setPageLoading(false);
  //   }, 300);
  // }, []);

  // if (pageLoading) {
  //   return (
  //     <div className="flex w-full max-w-6xl  px-4 justify-center">
  //       <Spinner className="size-8 mt-6" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex w-full max-w-6xl flex-col px-4">
      <Tabs defaultValue="All">
        <TabsList className="w-full">
          <TabsTrigger value="All">All Traders</TabsTrigger>
          <TabsTrigger value="User">My Trader</TabsTrigger>
        </TabsList>

        {/* AUTOMATIC WALLET TAB */}
        <TabsContent value="All" className="mt-3">
          <AllTraders />
        </TabsContent>

        {/* MANUALLY ADD WALLET TAB */}
        <TabsContent value="User" className="mt-3">
          <ClientTraders />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CopyTrader;
