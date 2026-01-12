import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { CirclePlus, GiftIcon, RefreshCw, Trash } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { useGiftRewards } from "@/hooks/useGiftRewards";
import AddGiftReward from "../AddGiftReward";

const GiftsRewards = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser, refetch, isRefetching } = useUser(id);

  const {
    openAddReward,
    setOpenAddReward,
    adminAddRewardToUser,
    isAdminAddingRewardToUser,

    adminDeleteGiftReward,
    isAdminDeleteGiftReward,
  } = useGiftRewards(id);

  const GiftRewardsArray = [...(singleUser?.giftRewards ?? [])].reverse();

  console.log(GiftRewardsArray);

  const deleteGiftReward = async (giftId: string) => {
    const formData = {
      rewardId: giftId,
    };

    // console.log(id, formData)

    await adminDeleteGiftReward({ id, formData });
  };

  if (!singleUser) {
    return (
      <p>
        Error fetching User, retry{" "}
        <Button disabled={isRefetching} onClick={() => refetch()}>
          {isRefetching && <Spinner />}
          retry
        </Button>
      </p>
    );
  }

  if (pageLoading || isAdminAddingRewardToUser || isAdminDeleteGiftReward) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-4">
      <Card className="p-3 gap-2">
        <div className="flex justify-between  gap-3">
          <Button
            className="flex-1"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? <Spinner /> : <RefreshCw />} Refresh
          </Button>
          <Button
            className="flex-1 bg-orange-500"
            onClick={() => setOpenAddReward(true)}
          >
            <CirclePlus /> Add Rewards
          </Button>
        </div>
      </Card>

      <Card className="py-3 mt-3">
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-2 truncate">
            <div className="relative w-16 min-w-16">
              <Image
                src={singleUser?.photo || "/qrCode_placeholder.jpg"}
                alt="wallet-qrcode"
                width={100}
                height={100}
                className="size-16 object-cover border-2 border-gray-400 rounded-full"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {singleUser?.firstname + " " + singleUser?.lastname}
              </h3>
              <h3 className="text-sm font-semibold">{singleUser?.email}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-3 mt-3">
        <CardContent className="grid gap-6 px-3">
          <div className="space-y-3">
            {GiftRewardsArray.map((reward) => (
              <div
                key={reward._id}
                className="w-full bg-secondary flex items-start gap-2  rounded-xl border p-3 transition"
              >
                <GiftIcon className="size-8 sm:size-10" />
                <div className="flex-1 flex flex-col gap-2 items-center ">
                  <p className="text-base sm:text-xl font-semibold text-center">
                    {reward.subject}
                  </p>
                  <p className="text-sm sm:text-base text-center">
                    {reward.message}
                  </p>
                  <p className="text-base sm:text-base text-green-400 font-semibold">
                    Gift Amount:{" "}
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: singleUser?.currency?.code,
                      ...(reward.amount > 9999 ? { notation: "compact" } : {}),
                    }).format(reward.amount)}
                  </p>
                </div>
                <Button
                  variant={"outline"}
                  onClick={() => deleteGiftReward(reward._id)}
                >
                  <Trash />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ADD REWARD  */}
      <Sheet open={openAddReward} onOpenChange={setOpenAddReward}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Add Gift Reward</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-0">
              <AddGiftReward adminAddRewardToUser={adminAddRewardToUser} />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default GiftsRewards;
