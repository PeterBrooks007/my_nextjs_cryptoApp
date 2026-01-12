import { EditIcon, Trash } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CombinedAssetsTransactionType } from "@/types";

type WalletTransactionDetailsProps = {
  selectedTransaction: CombinedAssetsTransactionType | null;
  updateWalletTransaction: (
    id: string | undefined,
    formData: {
      userId: string;
      transactionData: {
        transactionId: string | undefined;
        typeOfTransaction: string;
        method: string | undefined;
        methodIcon: string | undefined;
        symbol: string | undefined;
        amount: number;
        walletAddress: string;
        description: string;
        status: string;
        createdAt: Date;
      };
    }
  ) => void;
  deleteWalletTransaction: (
    id: string | undefined,
    formData: {
      userId: string;
      transactionData: {
        transactionsId: string | undefined;
      };
    }
  ) => void;
};

// formSchema
export const formSchema = z.object({
  type: sanitizedString("Wallet Name contains invalid characters")
    .trim()
    .min(1, "Type is required.")
    .max(50, "Type cannot exceed 50 characters"),
  to: sanitizedString("To contains invalid characters")
    .trim()
    .min(1, "To is required.")
    .max(300, "To cannot exceed 50 characters"),
  amount: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(0, "Amount Must be minimum 1."),
  date: z.coerce.date({
    message: "Invalid date",
  }),
  description: sanitizedString("Description contains invalid characters")
    .trim()
    .min(1, "Description is required.")
    .max(200, "Description cannot exceed 200 characters"),
  status: sanitizedString("Description contains invalid characters")
    .trim()
    .min(1, "Status is required.")
    .max(50, "Status cannot exceed 50 characters"),
});

const WalletTransactionDetails = ({
  selectedTransaction,
  updateWalletTransaction,
  deleteWalletTransaction,
}: WalletTransactionDetailsProps) => {
  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      type: selectedTransaction?.typeOfTransaction ?? "",
      to: selectedTransaction?.walletAddress ?? "",
      amount: selectedTransaction?.amount ?? 0,
      date: selectedTransaction?.createdAt
        ? new Date(selectedTransaction.createdAt)
        : new Date(),
      description: selectedTransaction?.description ?? "",
      status: selectedTransaction?.status ?? "",
    },
    mode: "onChange",
  });
  // updateExpert Trader
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Build payload object
    const formData = {
      userId: id,
      transactionData: {
        transactionId: selectedTransaction?._id,
        typeOfTransaction: data.type,
        method: selectedTransaction?.method,
        methodIcon: selectedTransaction?.methodIcon,
        symbol: selectedTransaction?.symbol,
        amount: data.amount,
        walletAddress: data.to,
        description: data.description,
        status: data.status,
        createdAt: data.date,
      },
    };

    await updateWalletTransaction(id, formData);

    // console.log(id, formData);

    // form.reset(); // clear input
  }

  const deleteWalletTransactionFunc = async () => {
    setOpenDelete(false);

    const formData = {
      userId: singleUser?._id,
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
            <Button variant={"outline"} onClick={() => setOpenEdit(true)}>
              <EditIcon size={18} />
            </Button>
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
            <p>{selectedTransaction?.walletAddress}</p>
          </div>
        </div>

        <Separator />

        {/* AMOUNT */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Amount:</p>
            <p>
              {singleUser?.isManualAssetMode === false
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: singleUser?.currency?.code ?? "USD",
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
                    currency: singleUser?.currency?.code ?? "USD",
                    ...((selectedTransaction?.amount ?? 0) > 9999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(selectedTransaction?.amount ?? 0)}{" "}
              {singleUser?.isManualAssetMode === false &&
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

      {/* EDIT WALLET TRANACTION DIALOG */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[525px] bg-secondary">
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {`Edit ${selectedTransaction?.method} Wallet Transaction`}
              </DialogTitle>
            </DialogHeader>

            <Separator />
            <FieldGroup className="gap-5 ">
              <div className="grid grid-cols-2 gap-2">
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="min-w-[120px]"
                        >
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value={"Sent"}>Sent</SelectItem>
                          <SelectItem value={"Received"}>Received</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                <Controller
                  name="to"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>To</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type="text"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter To"
                          className="text-base!"
                        />
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Controller
                  name="amount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type="text"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter Amount"
                          className="text-base!"
                        />
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="date"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type="date"
                          value={
                            field.value
                              ? field.value.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          } // ✅ convert string back to Date
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter Date"
                          className="text-base!"
                        />
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-description">
                      Description
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-rhf-demo-description"
                        placeholder="Enter Short Bio."
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value.length}/200 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-select-language"
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value={"Pending"}>Pending</SelectItem>
                        <SelectItem value={"Completed"}>Completed</SelectItem>
                        <SelectItem value={"Processing"}>Processing</SelectItem>
                        <SelectItem value={"confirmed"}>confirmed</SelectItem>
                        <SelectItem value={"Unconfirmed"}>
                          Unconfirmed
                        </SelectItem>
                        <SelectItem value={"Rejected"}>Rejected</SelectItem>
                        <SelectItem value={"Stuck"}>Stuck</SelectItem>
                        <SelectItem value={"Cancelled"}>Cancelled</SelectItem>
                        <SelectItem value={"Under Dispute"}>
                          Under Dispute
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEdit(false)}
              >
                Cancel Update
              </Button>

              <Button type="submit" variant="default">
                Update Transaction
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE WALLET TRANACTION DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
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
