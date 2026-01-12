"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllNfts from "./AllNfts";
import UserNfts from "./UserNfts";
import TopBar from "./TopBar";

const NftsComp = () => {
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
    <div className="flex w-full max-w-full flex-col">
      <div className="lg:hidden pb-5">
        <TopBar />
      </div>

      <Tabs defaultValue="All">
        <TabsList className="w-full">
          <TabsTrigger value="All">All Nfts</TabsTrigger>
          <TabsTrigger value="User">User Nfts</TabsTrigger>
        </TabsList>

        {/* AUTOMATIC WALLET TAB */}
        <TabsContent value="All" className="mt-3">
          <AllNfts />
        </TabsContent>

        {/* MANUALLY ADD WALLET TAB */}
        <TabsContent value="User" className="mt-3">
          <UserNfts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NftsComp;
