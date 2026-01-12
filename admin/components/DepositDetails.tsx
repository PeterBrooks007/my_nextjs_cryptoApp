import { CheckCircle, CircleAlert, Info, Trash, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { DepositHistoryType } from "@/types";

type DepositDetailsProps = {
  selectedHistory: DepositHistoryType | null;
  approveDepositHistory: (
    id: string | undefined,
    userData: {
      status: string;
      comment: string;
      amount: number | undefined;
      userId: string | undefined;
      typeOfDeposit: string | undefined;
    }
  ) => void;
  deletedepositHistory: (id: string | undefined) => void;
};

type SwitchKey = "switch1" | "switch2" | "switch3" | "switch4";

const DepositDetails = ({
  selectedHistory,
  approveDepositHistory,
  deletedepositHistory,
}: DepositDetailsProps) => {
  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  type ConversionRate = {
    code: string;
    rate: number;
  };

  const [conversionRate] = useState<ConversionRate | null>(null);

  const [openProof, setOpenProof] = useState(false);
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

    const id = selectedHistory?._id;

    const userData = {
      status,
      comment,
      amount: selectedHistory?.amount,
      userId: selectedHistory?.userId,
      typeOfDeposit: selectedHistory?.typeOfDeposit,
    };

    console.log(userData);

    await approveDepositHistory(id, userData);
  };

  const deleteDepositRequestFunc = async () => {
    setOpenDelete(false);
    await deletedepositHistory(selectedHistory?._id);
  };

  return (
    <div className="space-y-2.5">
      {/* Transaction ID */}
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

      {/* Type of Deposit */}
      <div>
        <p className="font-semibold">Type of Deposit:</p>
        <p>{selectedHistory?.typeOfDeposit} account Deposit</p>
      </div>
      <Separator />

      {/* Date */}
      <div>
        <p className="font-semibold">Date:</p>
        <p>
          {new Date(selectedHistory?.createdAt || 0).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </p>
      </div>

      <Separator />

      {/* Amount */}
      <div>
        <p className="font-semibold">Deposited Amount:</p>

        <p>
          {conversionRate?.rate
            ? Intl.NumberFormat("en-US", {
                style: "currency",
                currency: conversionRate?.code ?? "USD",
                ...((selectedHistory?.amount ?? 0) *
                  (conversionRate?.rate ?? 1) >=
                9_999_999
                  ? { notation: "compact" }
                  : {}),
              }).format(
                (selectedHistory?.amount ?? 0) * (conversionRate?.rate ?? 1)
              )
            : Intl.NumberFormat("en-US", {
                style: "currency",
                currency: singleUser?.currency?.code ?? "USD",
                ...((selectedHistory?.amount ?? 0) >= 9_999_999
                  ? { notation: "compact" }
                  : {}),
              }).format(selectedHistory?.amount ?? 0)}
        </p>
      </div>

      <Separator />

      {/* Status */}
      <div>
        <p className="font-semibold">Status:</p>
        <p>{selectedHistory?.status}</p>
      </div>

      <Separator />

      {/* VIEW PROOF BUTTON */}
      <div className="bg-card mt-3 rounded-xl p-4">
        <div className="space-y-2">
          {/* Info Row */}
          <div className="flex items-center gap-1 text-violet-400">
            <Info size={26} />
            <p className="text-base font-bold">
              {selectedHistory?.typeOfDeposit} account Deposit
            </p>
          </div>

          {/* Proof Row */}
          <div className="flex items-center justify-between">
            <p>View Proof of Deposit</p>

            <Button size="sm" onClick={() => setOpenProof(true)}>
              View Proof
            </Button>
          </div>
        </div>
      </div>

      {/* APPROVAL CARDS */}
      {selectedHistory?.status === "PENDING" && (
        <>
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
              Please note this approval will add the amount to the user&apos;s
              Trade balance and total deposit only.{" "}
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
              Please note this approval will NOT add the amount to the
              user&apos;s Trade balance
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

            <p className="mt-1">
              Please note this will Dissapprove the request
            </p>
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

            <p className="mt-1">
              Please note this request will be set to pending
            </p>
          </Card>
        </>
      )}

      {/* PROOF OF DEPOSIT IMAGES DIALOG */}
      <Dialog open={openProof} onOpenChange={setOpenProof}>
        <DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-scroll">
          <DialogHeader>
            <DialogTitle>PROOF OF DEPOSIT</DialogTitle>
          </DialogHeader>

          <div className="h-auto w-full">
            <Image
              src={selectedHistory?.depositProof || "/qrCode_placeholder.jpg"}
              alt=""
              width={500}
              height={500}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE DEPOSIT REQUEST DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {`Delete this ${selectedHistory?.method} Deposit Request ?`}
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
                deleteDepositRequestFunc();
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

export default DepositDetails;
