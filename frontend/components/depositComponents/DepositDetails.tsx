import { Info, Trash } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DepositHistoryType } from "@/types";
import { useCurrentUser } from "@/hooks/useAuth";
import Image from "next/image";
import { useConversionRateStore } from "@/store/conversionRateStore";

type DepositDetailsProps = {
  selectedHistory: DepositHistoryType | null;
  deletedepositHistory: (id: string | undefined) => void;
};

const DepositDetails = ({
  selectedHistory,
  deletedepositHistory,
}: DepositDetailsProps) => {
  const { data: user } = useCurrentUser();

    const { conversionRate } = useConversionRateStore();
  

  const [openProof, setOpenProof] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

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
                currency: user?.currency?.code ?? "USD",
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

      {/* PROOF OF DEPOSIT IMAGES DIALOG */}
      <Dialog open={openProof} onOpenChange={setOpenProof}>
        <DialogContent className="sm:max-w-106.25 max-h-[90%] overflow-scroll z-1002">
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
        <DialogContent className="sm:max-w-106.25 z-1002">
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
