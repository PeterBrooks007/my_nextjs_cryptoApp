import { Trash } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { WithdrawalHistoryType } from "@/types";
import { useCurrentUser } from "@/hooks/useAuth";
import { useConversionRateStore } from "@/store/conversionRateStore";

type withdrawalDetailsProps = {
  selectedHistory: WithdrawalHistoryType | null;
  deleteWithdrawalHistory: (id: string | undefined) => void;
};

const WithdrawalDetails = ({
  selectedHistory,
  deleteWithdrawalHistory,
}: withdrawalDetailsProps) => {
  const { data: user } = useCurrentUser();

    const { conversionRate } = useConversionRateStore();
  

  const [openDelete, setOpenDelete] = useState(false);

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
              <p className="break-all">{selectedHistory?.walletAddress}</p>
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
                  currency: user?.currency?.code ?? "USD",
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

      {/* DELETE DEPOSIT REQUEST DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-106.25">
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
