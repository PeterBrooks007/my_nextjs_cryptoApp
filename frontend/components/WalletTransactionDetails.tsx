import { Trash } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import { CombinedAssetsTransactionType } from "@/types";
import { useCurrentUser } from "@/hooks/useAuth";

type WalletTransactionDetailsProps = {
  selectedTransaction: CombinedAssetsTransactionType | null;
  deleteWalletTransaction: (
    id: string | undefined,
    formData: {
      userId: string | undefined;
      transactionData: {
        transactionsId: string | undefined;
      };
    }
  ) => void;
};

const WalletTransactionDetails = ({
  selectedTransaction,
  deleteWalletTransaction,
}: WalletTransactionDetailsProps) => {
  const { data: user } = useCurrentUser();

  const [openDelete, setOpenDelete] = useState(false);

  const deleteWalletTransactionFunc = async () => {
    setOpenDelete(false);

    const formData = {
      userId: user?._id,
      transactionData: {
        transactionsId: selectedTransaction?._id,
      },
    };

    // console.log(id, formData);

    await deleteWalletTransaction(selectedTransaction?._id, formData);
  };

  return (
    <div className="space-y-2.5">
      <>
        {/* TRANSACTION ID */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Transaction Id:</p>
            <p>ID-{selectedTransaction?._id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant={"outline"} onClick={() => setOpenDelete(true)}>
              <Trash size={18} />
            </Button>
          </div>
        </div>

        <Separator />

        {/* TYPE*/}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Type:</p>
            <p>{selectedTransaction?.typeOfTransaction}</p>
          </div>
        </div>

        <Separator />

        {/* TO*/}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">To:</p>
            <p className="break-all">{selectedTransaction?.walletAddress}</p>
          </div>
        </div>

        <Separator />

        {/* AMOUNT */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Amount:</p>
            <p>
              {user?.isManualAssetMode === false
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code ?? "USD",
                    ...((selectedTransaction?.amount ?? 0) *
                      (selectedTransaction?.price ?? 0) >
                    9999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(
                    (selectedTransaction?.amount ?? 0) *
                      (selectedTransaction?.price ?? 0)
                  )
                : Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code ?? "USD",
                    ...((selectedTransaction?.amount ?? 0) > 9999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(selectedTransaction?.amount ?? 0)}{" "}
              {user?.isManualAssetMode === false &&
                `( ${(selectedTransaction?.amount ?? 0).toFixed(8)} ${
                  selectedTransaction?.symbol?.toUpperCase() ?? ""
                } ) `}
            </p>
          </div>
        </div>

        <Separator />

        {/* DATE */}
        <div>
          <p className="font-semibold">Date:</p>
          <p>
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(selectedTransaction?.createdAt || 0))}
          </p>
        </div>

        <Separator />

        {/* AMOUNT */}
        <div>
          <p className="font-semibold">Description:</p>

          <p>{selectedTransaction?.description}</p>
        </div>

        <Separator />

        {/* STATUS */}
        <div>
          <p className="font-semibold">Status:</p>
          <p>{selectedTransaction?.status}</p>
        </div>
      </>

      {/* DELETE WALLET TRANACTION DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              {`Delete this ${selectedTransaction?.method} Wallet Transaction ?`}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete this transaction ?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                deleteWalletTransactionFunc();
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

export default WalletTransactionDetails;
