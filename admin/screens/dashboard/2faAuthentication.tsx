"use client";

import { Card, CardContent } from "@/components/ui/card";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { use2faAuthentication, useCurrentUser } from "@/hooks/useAuth";

const TwofaAuthentication = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const { data: user } = useCurrentUser();

  const { mutate, isPending } = use2faAuthentication();

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (user?.isTwoFactorEnabled) {
        setChecked(user?.isTwoFactorEnabled);
      }
    }, 0);
  }, [user?.isTwoFactorEnabled]);

  // Handle switch change
  const handleSwitchChange = (isChecked: boolean) => {
    setChecked(isChecked);

    setTimeout(() => {
      handleFormSubmit(isChecked);
    }, 600);
  };
  const handleFormSubmit = async (isChecked: boolean) => {
    const userData = {
      isTwoFactorEnabled: isChecked,
    };

    console.log(userData);

    await mutate(userData);
  };

  if (pageLoading || isPending) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Set States */}
          <div className="flex flex-row gap-2 my-2 ml-0 mt-0">
            <Skeleton className="w-38 h-9" />
            <Skeleton className="w-24 h-9" />
          </div>

          {/* Search input */}
          <div className="w-full lg:w-[300px]  h-9">
            <Skeleton className="w-full lg:w-[300px] h-9" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* CHANGE PASSWORD */}

      <Card className="w-full">
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between gap-5 items-start lg:items-center ">
            <div className="flex flex-col gap-1 sm:gap-2">
              <p className=" text-lg sm:text-2xl font-semibold">
                Two-Factor Authentication (2FA)
              </p>
              <p className="text-muted-foreground text-base lg:text-lg">
                Kindly set up 2 factor authentication for a stronger account security.
              </p>
            </div>

            <div className="flex justify-center items-center gap-2">
              <p>OFF</p>
              <Switch
                className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
                checked={checked}
                onCheckedChange={handleSwitchChange}
                name="switch1"
              />
              <p>ON</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwofaAuthentication;
