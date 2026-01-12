"use client";

import {
  CheckCircle,
  CircleAlert,
  LoaderPinwheel,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Spinner } from "./ui/spinner";
import { WithdrawalRequestType } from "@/types";
import { useWithdrawalRequest } from "@/hooks/useWithdrawalRequest";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

type UpdateWithdrawalRequestProps = {
  selectedWithdrawalRequest: WithdrawalRequestType | null;
};

type SwitchKey = "switch1" | "switch2" | "switch3" | "switch4";

const UpdateWithdrawalRequest = ({
  selectedWithdrawalRequest,
}: UpdateWithdrawalRequestProps) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const { approveWithdrawalRequest, isApprovingWithdrawalRequest } =
    useWithdrawalRequest();

  const [checked, setChecked] = useState({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false,
  });

  // Handle switch change
  const handleSwitchChange = (switchName: SwitchKey, isChecked: boolean) => {
    setChecked((prev) => ({
      ...prev,
      [switchName]: isChecked,
    }));

    setTimeout(() => {
      handleFormSubmit(switchName);
    }, 600);
  };

  const handleFormSubmit = async (switchName: SwitchKey) => {
    let status;

    if (switchName === "switch1") {
      status = "APPROVED";
    }
    if (switchName === "switch2") {
      status = "PROCESSING";
    }
    if (switchName === "switch3") {
      status = "NOT-APPROVED";
    }
    if (switchName === "switch4") {
      status = "PENDING";
    }

    const id = selectedWithdrawalRequest?._id;

    const userData = {
      status,
      amount: selectedWithdrawalRequest?.amount,
      userId: selectedWithdrawalRequest?.userId?._id,
      typeOfWithdrawal: selectedWithdrawalRequest?.typeOfWithdrawal,
    };

    // console.log(userData);

    await approveWithdrawalRequest(id, userData);
  };

  if (pageLoading || isApprovingWithdrawalRequest) {
    return (
      <div className="flex w-full max-w-lg  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="h-full pb-2">
      {/* WITHDRAWAL REQUEST DETAILS */}
      <Card>
        <CardHeader>
          {/* <CardTitle>Password</CardTitle> */}
          <CardDescription>
            Select what to do with this withdrawal request
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-28 min-w-28 h-28">
              <Image
                src={
                  selectedWithdrawalRequest?.userId.photo ||
                  "/qrCode_placeholder.jpg"
                }
                alt="wallet-qrcode"
                width={100}
                height={100}
                className="size-28 object-cover border-2 border-gray-400 rounded-full"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {selectedWithdrawalRequest?.userId.firstname +
                  " " +
                  selectedWithdrawalRequest?.userId.lastname}
              </h3>
              <h3 className="text-lg font-semibold text-green-400">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  ...((selectedWithdrawalRequest?.amount || 0) > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format(selectedWithdrawalRequest?.amount || 0)}{" "}
                <span className="text-muted-foreground">to withdraw</span>
              </h3>
              <h3 className="text-lg font-semibold text-orange-400">
                {selectedWithdrawalRequest?.method} Method
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TYPE OF WITHDRAWAL SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex gap-2 items-center">
          <CircleAlert className="text-green-400" />
          <p className="font-semibold">
            {" "}
            {selectedWithdrawalRequest?.typeOfWithdrawal} Account Withdrawal
          </p>
        </div>
      </Card>

      {/* WITHDRAWAL DETAILS SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex flex-col space-y-4 mx-2 wrap-break-word">
          <div className="flex flex-row items-center space-x-2">
            <p className="font-semibold text-green-400 text-base">
              Withdrawal Details
            </p>
          </div>

          <Separator />

          {/* Crypto Withdrawal */}
          {selectedWithdrawalRequest?.method !== "Bank" && (
            <>
              <div>
                <p className="font-semibold">To:</p>
                <p>{selectedWithdrawalRequest?.walletAddress}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Bank Withdrawal */}
          {selectedWithdrawalRequest?.method === "Bank" && (
            <>
              <div>
                <p className="font-semibold">Bank Name:</p>
                <p>{selectedWithdrawalRequest?.bankName}</p>
              </div>

              <Separator />

              <div>
                <p className="font-semibold">Account Number:</p>
                <p>{selectedWithdrawalRequest?.bankAccount}</p>
              </div>

              <Separator />

              <div>
                <p className="font-semibold">Routing Number:</p>
                <p>{selectedWithdrawalRequest?.routingCode}</p>
              </div>

              <Separator />
            </>
          )}

          <div>
            <p className="font-semibold">Withdrawal Amount:</p>
            <p>{selectedWithdrawalRequest?.amount}</p>
          </div>

          <Separator />

          <div>
            <p className="font-semibold">Description:</p>
            <p>{selectedWithdrawalRequest?.description}</p>
          </div>
        </div>
      </Card>

      {/* APPROVE WITHDRAWAL SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <CheckCircle className="text-green-400" />
            <p className="font-semibold">Approve Withdrawal</p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked.switch1}
            onCheckedChange={(checked) =>
              handleSwitchChange("switch1", checked)
            }
            name="switch1"
          />
        </div>
      </Card>

      {/* SET WITHDRAWAL TO PROCESSING SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <LoaderPinwheel className="text-sky-400" />
            <p className="font-semibold">Set Withdrawal to processing</p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked.switch2}
            onCheckedChange={(checked) =>
              handleSwitchChange("switch2", checked)
            }
            name="switch2"
          />
        </div>
      </Card>

      {/* DISAPPROVE WITHDRAWAL WITHOUT BALANCE WITHDRAWAL SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <XCircle className="text-red-500" />
            <p className="font-semibold">Dissapprove this Request</p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked.switch3}
            onCheckedChange={(checked) =>
              handleSwitchChange("switch3", checked)
            }
            name="switch3"
          />
        </div>
      </Card>

      {/* SET REQUEST TO PENDING*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <CircleAlert className="text-orange-400" />
            <p className="font-semibold">Set Request to Pending</p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked.switch4}
            onCheckedChange={(checked) =>
              handleSwitchChange("switch4", checked)
            }
            name="switch4"
          />
        </div>
      </Card>
    </div>
  );
};

export default UpdateWithdrawalRequest;
