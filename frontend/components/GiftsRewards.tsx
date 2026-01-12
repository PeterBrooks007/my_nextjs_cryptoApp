import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import Image from "next/image";
import { GiftIcon, RefreshCcw, XCircle } from "lucide-react";
import { useGiftRewards } from "@/hooks/useGiftRewards";
import { useCurrentUser } from "@/hooks/useAuth";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

const GiftsRewards = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const { data: user, refetch, isRefetching } = useCurrentUser();

  const { userClaimReward, isUserClaimingReward } = useGiftRewards();

  const GiftRewardsArray = [...(user?.giftRewards ?? [])].reverse();

  // console.log(GiftRewardsArray);

  const UserClaimRewardNow = async (giftId: string) => {
    const formData = {
      rewardId: giftId,
    };
    const id = user?._id;

    await userClaimReward(id, formData);
  };

  if (!user) {
    return (
      <p>
        Error fetching User, retry{" "}
        {/* <Button disabled={isRefetching} onClick={() => refetch()}>
          {isRefetching && <Spinner />}
          retry
        </Button> */}
      </p>
    );
  }

  if (pageLoading || isUserClaimingReward) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="">
      <Image
        src={"/rewards.jpg"}
        alt="image"
        width={600}
        height={600}
        className="w-full h-30 object-cover border-2 border-gray-400 rounded-xl"
      />

      <Card className="py-3 mt-4">
        <CardHeader>
          <CardTitle>Gift Rewards</CardTitle>
          <CardDescription>
            Here are you gifts rewards, click claim to add to your balance
          </CardDescription>
          <CardAction>
            <Button variant="outline" onClick={() => refetch()}>
              {isRefetching ? <Spinner /> : <RefreshCcw />}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-6 px-3 min-h-50">
          <div className="space-y-3">
            {GiftRewardsArray && GiftRewardsArray.length > 0 ? (
              GiftRewardsArray.map((reward) => (
                <div
                  key={reward._id}
                  className="w-full bg-secondary flex items-start gap-3  rounded-xl border p-3 transition"
                >
                  <GiftIcon className="size-8 sm:size-10" />
                  <div className="flex-1 flex flex-col gap-2 items-start ">
                    <p className="text-base sm:text-xl font-semibold ">
                      {reward.subject}
                    </p>
                    <p className="text-sm sm:text-base ">{reward.message}</p>
                    <p className="text-base sm:text-base text-green-400 font-semibold">
                      Gift Amount:{" "}
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(reward.amount > 9999
                          ? { notation: "compact" }
                          : {}),
                      }).format(reward.amount)}
                    </p>
                  </div>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => UserClaimRewardNow(reward._id)}
                  >
                    Claim
                  </Button>
                </div>
              ))
            ) : (
              <>
                <Separator />
                <div className="h-full flex flex-col justify-center items-center gap-2 -mt-5">
                  <XCircle className="size-14" />
                  <p className="text-xl">No Gift Reward</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftsRewards;
