"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopBar from "./TopBar";
import AccountOverview from "./AccountOverview";
import ReferralSystem from "./ReferralSystem";
import SecuritySystem from "./SecuritySystem";
import AccountVerifications from "./AccountVerifications";

const ProfileTabs = () => {
  return (
    <div className="flex w-full max-w-full flex-col">
      <div className="lg:hidden pb-5">
        <TopBar />
      </div>

      <Tabs defaultValue="Account Overview">
        <TabsList className="w-full">
          <TabsTrigger value="Account Overview">Account Overview</TabsTrigger>
          <TabsTrigger value="Referral System">Referral System</TabsTrigger>
          <TabsTrigger value="Account Verifications">
            Account Verifications
          </TabsTrigger>
          <TabsTrigger value="Security System">Security System</TabsTrigger>
        </TabsList>

        {/* Account Overview TAB */}
        <TabsContent value="Account Overview" className="mt-3">
          <AccountOverview />
        </TabsContent>

        {/* Referral System TAB */}
        <TabsContent value="Referral System" className="mt-3">
          <ReferralSystem />
        </TabsContent>

        {/* Account Verifications TAB */}
        <TabsContent value="Account Verifications" className="mt-3">
          <AccountVerifications verificationDrawer={false} />
        </TabsContent>

        {/* Security System TAB */}
        <TabsContent value="Security System" className="mt-3">
          <SecuritySystem />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
