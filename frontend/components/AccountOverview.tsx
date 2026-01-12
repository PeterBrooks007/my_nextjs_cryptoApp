import { useCurrentUser } from "@/hooks/useAuth";
import { DollarSign, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Card } from "./ui/card";
import EditProfile from "./EditProfile";
import { Separator } from "./ui/separator";
import TradingHistorySection from "./TradingHistorySection";
import TradeHistoryChartSection from "./TradeHistoryChartSection";
import { Button } from "./ui/button";
import { useConversionRateStore } from "@/store/conversionRateStore";

const AccountOverview = () => {
  const { data: user } = useCurrentUser();
  const { conversionRate } = useConversionRateStore();

  return (
    <div className="space-y-5">
      {/* ================== Top Card ==================*/}
      <Card className="flex flex-row justify-between items-center rounded-xl bg-card p-5 shadow-sm">
        {/*  Left: Profile  */}
        <div className="flex items-center  gap-4">
          <div className="flex flex-col gap-2">
            <Image
              src={user?.photo ? user.photo : "/qrCode_placeholder.jpg"}
              alt="profile"
              width={300}
              height={300}
              sizes="(max-width: 640px) 250px, 250px"
              className="size-30 rounded-full border-2 border-border bg-background object-cover"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">
              {user?.firstname} {user?.lastname}
            </h2>
            <p className="text-lg text-muted-foreground">{user?.email}</p>
            <p className="text-lg capitalize">{user?.accounttype}</p>
          </div>
        </div>

        {/*  Middle: Package  */}
        <div className="flex flex-col items-start gap-1">
          <span className="text-lg border-b-2 border-green-500 font-semibold">
            100%
          </span>
          <span className="text-lg font-medium uppercase">
            {user?.package} PACKAGE
          </span>

          <div className="flex items-center gap-2">
            <ShieldCheck size={28} />
            <span className="text-lg font-medium">TOP RATED</span>
          </div>
        </div>

        {/*  Right: Trade Balance (XL only)  */}
        <div className="hidden 2xl:flex items-center gap-4">
          <DollarSign size={80} />

          <div className="flex flex-col">
            <span className="text-lg font-medium">Trade Balance</span>
            <span className="text-3xl font-semibold">
              {conversionRate?.rate && user?.balance != null
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: conversionRate.code,
                    ...(user.balance * conversionRate.rate > 9_999_999
                      ? { notation: "compact" }
                      : {}),
                  }).format(user.balance * conversionRate.rate)
                : Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code ?? "USD",
                    ...(user?.balance != null && user.balance > 9_999_999
                      ? { notation: "compact" }
                      : {}),
                  }).format(user?.balance ?? 0)}
            </span>
          </div>
        </div>
      </Card>

      {/* =============== Edit Profile Card =============== */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 ">
          <EditProfile />
        </Card>

        {/* Trading History Card */}
        <Card className="p-6 gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-base sm:text-lg font-semibold">
                Trading History
              </p>
            </div>

            <Button variant={"outline"} size={"sm"}>
              View All
            </Button>
          </div>
          <Separator />
          <TradingHistorySection />
        </Card>

        {/* Trade History Chart Card */}
        <Card className="p-6 min-h-125 h-auto gap-4 col-span-2">
          <div className="space-y-2">
            <p className="text-base sm:text-lg font-semibold">
              Trade History Chart
            </p>
          </div>
          <Separator />
          <TradeHistoryChartSection />
        </Card>
      </div>
    </div>
  );
};

export default AccountOverview;
