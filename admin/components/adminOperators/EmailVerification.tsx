import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import { Switch } from "../ui/switch";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useEmailVerification } from "@/hooks/useAdminOperators";

const EmailVerification = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  const { mutate, isPending } = useEmailVerification(id);

  const [checked, setChecked] = useState(singleUser?.isEmailVerified);

  useEffect(() => {
    setTimeout(() => {
      if (singleUser?.isEmailVerified) {
        setChecked(singleUser?.isEmailVerified);
      }
    }, 0);
  }, [singleUser?.isEmailVerified]);

  // Handle switch change
  const handleSwitchChange = (isChecked: boolean) => {
    setChecked(isChecked);

    // Delay submit
    setTimeout(async () => {
      await mutate(id);
    }, 500);
  };

  if (pageLoading || isPending) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-4">
      <Card className="py-3">
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-3 truncate">
            <div className="relative w-20 min-w-20 ">
              <Image
                src={singleUser?.photo || "/qrCode_placeholder.jpg"}
                alt="wallet-qrcode"
                width={50}
                height={50}
                className="size-20 object-cover border-2 border-gray-400 rounded-full"
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

      {/* Verify Email Address*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {singleUser?.isEmailVerified ? (
              <CheckCircle className="text-green-400" />
            ) : (
              <XCircle color="red" />
            )}
            <p className="font-semibold">
              {singleUser?.isEmailVerified
                ? "User Email is Verified"
                : "Verify User Email"}
            </p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked}
            onCheckedChange={(checked) => handleSwitchChange(checked)}
            name="switch1"
          />
        </div>

        <p className="mt-1"> click to verify or not verify this user</p>
      </Card>
    </div>
  );
};

export default EmailVerification;
