import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { Button } from "./ui/button";

const ReferralSystem = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const handleCopyReferralLinkMobile = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Referral Link copied successfully");
  };

  if (pageLoading) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {/* Referral Card + Info */}
      <Card className="flex flex-col sm:flex-row items-center sm:items-center gap-2 p-5 rounded-xl shadow">
        {/* Card Image */}
        <div className="p-3 bg-secondary max-w-86.25 sm:max-w-86.25 w-full justify-center rounded-md">
          <div className="cursor-pointer overflow-hidden ">
            <Image
              src={"/refer.jpg"}
              alt="refer-image"
              className="w-full h-36 object-cover"
              width={180}
              height={180}
            />
          </div>
          <div className="py-4 px-2">
            <h2 className="text-lg font-semibold">Refer and Earn</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Refer People to our platform and Earn up to $10,000 from all your
              refer
            </p>

            {/* Mobile Copy Link */}
            <div className="flex flex-row gap-2 mt-2 sm:hidden">
              <input
                readOnly
                value="http://tradexs10.com/auth/register"
                className="border rounded px-2 py-1  w-38  xs:w-42.5 sm:w-60"
              />
              <Button
                variant={"default"}
                className="px-3 py-1 font-bold rounded break-all"
                onClick={() =>
                  handleCopyReferralLinkMobile(
                    "http://tradexs10.com/auth/register"
                  )
                }
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Referral Info */}
        <div className="hidden sm:flex flex-col gap-2 px-2">
          <h2 className={"text-2xl"}>
            Refer People to our platform and Earn up to $10,000
          </h2>
          <p className={"text-base text-orange-500"}>
            Click on Copy Referral Link below to copy Your Referral Link
          </p>

          <div className="flex flex-row gap-2">
            <input
              readOnly
              value="http://tradexs10.com/auth/register"
              className="border bg-muted rounded px-2 py-3 w-50 sm:w-62.5"
            />
            <button
              className="bg-primary text-white  dark:text-black px-3 py-1 font-bold rounded"
              onClick={() =>
                handleCopyReferralLinkMobile(
                  "http://tradexs10.com/auth/register"
                )
              }
            >
              Copy Link
            </button>
          </div>
        </div>
      </Card>

      {/* Referrals Table */}
      <Card className="flex flex-col p-6 gap-2">
        <h2 className="text-lg font-semibold pl-1">Your Referrals</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-200 dark:bg-green-500">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-right"> </th>
                <th className="px-4 py-2 text-right">Country</th>
                <th className="px-4 py-2 text-right">Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-4 text-gray-500 dark:text-gray-400"
                >
                  No Data Available
                </td>
              </tr>
              {/* Map your referral rows here */}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReferralSystem;
