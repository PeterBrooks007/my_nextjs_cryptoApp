import {
  CheckCircle,
  CircleAlert,
  LoaderPinwheel,
  Trash,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { WithdrawalHistoryType } from "@/types";

type withdrawalDetailsProps = {
  selectedHistory: WithdrawalHistoryType | null;
  approveWithdrawalHistory: (
    id: string | undefined,
    userData: {
      status: string | undefined;
      amount: number | undefined;
      userId: string | undefined;
      typeOfWithdrawal: string | undefined;
    }
  ) => void;
  deleteWithdrawalHistory: (id: string | undefined) => void;
};

type SwitchKey = "switch1" | "switch2" | "switch3" | "switch4";

const WithdrawalDetails = ({
  selectedHistory,
  approveWithdrawalHistory,
  deleteWithdrawalHistory,
}: withdrawalDetailsProps) => {
  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  type ConversionRate = {
    code: string;
    rate: number;
  };

  const [conversionRate] = useState<ConversionRate | null>(null);

  const [openDelete, setOpenDelete] = useState(false);

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

    const id = selectedHistory?._id;

    const userData = {
      status,
      amount: selectedHistory?.amount,
      userId: selectedHistory?.userId,
      typeOfWithdrawal: selectedHistory?.typeOfWithdrawal,
    };

    // console.log(userData);

    await approveWithdrawalHistory(id, userData);
  };

  const deleteWithdrawalRequestFunc = async () => {
    setOpenDelete(false);
    await deleteWithdrawalHistory(selectedHistory?._id);
  };

  return (
    <div className="space-y-2.5">
      <>
        {/* TRANSACTION ID */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Transaction Id:</p>
            <p>ID-{selectedHistory?._id}</p>
          </div>
          <Button variant={"outline"} onClick={() => setOpenDelete(true)}>
            <Trash size={18} />
          </Button>
        </div>

        <Separator />

        {/* DATE */}
        <div>
          <p className="font-semibold">Date:</p>
          <p>
            {selectedHistory?.createdAt
              ? new Date(selectedHistory?.createdAt).toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
              : ""}
          </p>
        </div>

        <Separator />

        {/* BITCOIN WALLET – SHOW ONLY IF NOT BANK */}
        {selectedHistory?.method !== "Bank" && (
          <>
            <div>
              <p className="font-semibold">Bitcoin Wallet:</p>
              <p>{selectedHistory?.walletAddress}</p>
            </div>
            <Separator />
          </>
        )}

        {/* BANK DETAILS – ONLY IF BANK */}
        {selectedHistory?.method === "Bank" && (
          <>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">Bank Name:</p>
                <p>{selectedHistory?.bankName}</p>
              </div>
              <Separator />

              <div>
                <p className="font-semibold">Account Number:</p>
                <p>{selectedHistory?.bankAccount}</p>
              </div>
              <Separator />

              <div>
                <p className="font-semibold">Routing Number:</p>
                <p>{selectedHistory?.routingCode}</p>
              </div>
              <Separator />
            </div>
          </>
        )}

        {/* AMOUNT */}
        <div>
          <p className="font-semibold">Withdrawal Amount:</p>

          <p>
            -
            {conversionRate?.rate
              ? Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: conversionRate.code,
                  ...((selectedHistory?.amount ?? 0) *
                    (conversionRate?.rate ?? 1) >
                  9_999_999
                    ? { notation: "compact" }
                    : {}),
                }).format(
                  (selectedHistory?.amount ?? 0) * (conversionRate?.rate ?? 1)
                )
              : Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: singleUser?.currency?.code ?? "USD",
                  ...(selectedHistory?.amount ?? 0 > 9_999_999
                    ? { notation: "compact" }
                    : {}),
                }).format(selectedHistory?.amount ?? 0)}
          </p>
        </div>

        <Separator />

        {/* STATUS */}
        <div>
          <p className="font-semibold">Status:</p>
          <p>{selectedHistory?.status}</p>
        </div>

        <Separator />
      </>

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

      {/* DELETE DEPOSIT REQUEST DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {`Delete this ${selectedHistory?.method} withdrawal Request ?`}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete this request
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                deleteWithdrawalRequestFunc();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawalDetails;
