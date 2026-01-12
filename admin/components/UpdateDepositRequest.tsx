"use client";

import { CheckCircle, CircleAlert, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Spinner } from "./ui/spinner";
import { DepositRequestType } from "@/types";
import { useDepositRequest } from "@/hooks/useDepositRequest";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Switch } from "./ui/switch";

type UpdateDepositRequestProps = {
  selectedDepositRequest: DepositRequestType | null;
};

type SwitchKey = "switch1" | "switch2" | "switch3" | "switch4";

const UpdateDepositRequest = ({
  selectedDepositRequest,
}: UpdateDepositRequestProps) => {
  const [pageLoading, setPageLoading] = useState(true);
  const [openProof, setOpenProof] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const { approveDepositRequest, isApprovingDepositRequest } =
    useDepositRequest();

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
    let status = "";
    let comment = "";

    if (switchName === "switch1") {
      status = "APPROVED";
      comment = "ApproveWithBalance";
    }
    if (switchName === "switch2") {
      status = "APPROVED";
      comment = "ApproveWithoutBalance";
    }
    if (switchName === "switch3") {
      status = "NOT-APPROVED";
      comment = "Disapprove";
    }
    if (switchName === "switch4") {
      status = "PENDING";
      comment = "Pending";
    }

    const id = selectedDepositRequest?._id;

    const userData = {
      status,
      comment,
      amount: selectedDepositRequest?.amount,
      userId: selectedDepositRequest?.userId?._id,
      typeOfDeposit: selectedDepositRequest?.typeOfDeposit,
    };

    console.log(userData);

    await approveDepositRequest(id, userData);
  };

  if (pageLoading || isApprovingDepositRequest) {
    return (
      <div className="flex w-full max-w-lg  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="h-full pb-2">
      {/* DEPOSIT REQUEST DETAILS */}
      <Card>
        <CardHeader>
          {/* <CardTitle>Password</CardTitle> */}
          <CardDescription>
            Select what to do with this deposit request
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-28 min-w-28 h-28">
              <Image
                src={
                  selectedDepositRequest?.userId.photo ||
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
                {selectedDepositRequest?.userId.firstname +
                  " " +
                  selectedDepositRequest?.userId.lastname}
              </h3>
              <h3 className="text-lg font-semibold text-green-400">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  ...((selectedDepositRequest?.amount || 0) > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format(selectedDepositRequest?.amount || 0)}{" "}
                <span className="text-muted-foreground">deposited</span>
              </h3>
              <h3 className="text-lg font-semibold text-orange-400">
                {selectedDepositRequest?.method} Method
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIEW PROOF OF DEPOSIT SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <p className="font-semibold">
            {" "}
            {selectedDepositRequest?.typeOfDeposit} Account Deposit
          </p>
          <Button onClick={() => setOpenProof(true)}>View Proof</Button>
        </div>
      </Card>

      {/* APPROVE DEPOSIT WITH BALANCE DEPOSIT SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <CheckCircle className="text-green-400" />
            <p className="font-semibold">Approve With Balance</p>
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

        <p className="mt-1">
          Please note this approval will add the amount to the user&apos;s Trade
          balance and total deposit only.{" "}
          <span className="text-orange-400 font-semibold">
            NOT FOR WALLET DEPOSIT AND BALANCE
          </span>
        </p>
      </Card>

      {/* APPROVE DEPOSIT WITHOUT BALANCE DEPOSIT SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <CheckCircle className="text-green-400" />
            <p className="font-semibold">Approve Without Balance</p>
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

        <p className="mt-1">
          Please note this approval will NOT add the amount to the user&apos;s
          Trade balance
        </p>
      </Card>

      {/* DISAPPROVE DEPOSIT WITHOUT BALANCE DEPOSIT SESSION*/}
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

        <p className="mt-1">Please note this will Dissapprove the request</p>
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

        <p className="mt-1">Please note this request will be set to pending</p>
      </Card>

      {/* PROOF OF DEPOSIT IMAGES DIALOG */}
      <Dialog open={openProof} onOpenChange={setOpenProof}>
        <DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-scroll">
          <DialogHeader>
            <DialogTitle>PROOF OF DEPOSIT</DialogTitle>
          </DialogHeader>

          <div className="h-auto w-full">
            <Image
              src={
                selectedDepositRequest?.depositProof ||
                "/qrCode_placeholder.jpg"
              }
              alt=""
              width={500}
              height={500}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateDepositRequest;
