"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { TradeHistoryType } from "@/types";
import { useParams } from "next/navigation";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  symbols: sanitizedString("Symbols contains invalid characters")
    .trim()
    .min(1, "symbols required")
    .max(50, "symbols cannot exceed 50 characters"),

  type: sanitizedString("Type contains invalid characters")
    .trim()
    .min(1, "type required")
    .max(50, "type cannot exceed 50 characters"),

  buyOrSell: sanitizedString("Buy or Sell contains invalid characters")
    .trim()
    .min(1, "buyOrSell required")
    .max(50, "buyOrSell cannot exceed 50 characters"),

  price: z.coerce
    .number({ error: "price must be a number" })
    .min(0, "price is required"),

  ticks: sanitizedString("Ticks contains invalid characters")
    .trim()
    .min(1, "ticks required")
    .max(50, "ticks cannot exceed 50 characters"),

  tradingMode: sanitizedString("Trading mode contains invalid characters")
    .trim()
    .min(1, "tradingMode required")
    .max(50, "tradingMode cannot exceed 50 characters"),

  units: z.coerce
    .number({ error: "units must be a number" })
    .min(0, "units is required"),

  risk: sanitizedString("Risk contains invalid characters")
    .trim()
    .min(1, "risk required"),

  riskPercentage: sanitizedString("Risk percentage contains invalid characters")
    .trim()
    .min(1, "riskPercentage required")
    .max(50, "riskPercentage cannot exceed 50 characters"),

  expireTime: sanitizedString("Expire time contains invalid characters")
    .trim()
    .min(1, "expireTime required"),

  amount: z.coerce
    .number({ error: "amount must be a number" })
    .min(0, "amount is required"),

  open: sanitizedString("Open contains invalid characters")
    .trim()
    .min(1, "open required"),

  close: sanitizedString("Close contains invalid characters")
    .trim()
    .min(1, "close required"),

  longOrShortUnit: sanitizedString(
    "Long/Short Unit contains invalid characters"
  )
    .trim()
    .min(1, "longShortUnit required"),

  roi: sanitizedString("ROI contains invalid characters")
    .trim()
    .min(1, "roi required"),

  createdAt: z.coerce.date({
    message: "Invalid date",
  }),

  profitOrLossAmount: z.coerce
    .number({ error: "profitOrLossAmount must be a number" })
    .min(0, "profitOrLossAmount is required"),

  status: sanitizedString("Status contains invalid characters")
    .trim()
    .min(1, "status required"),
});

type FormSchema = z.infer<typeof formSchema>;

const EditTradeOrder = ({
  selectedTrade,
}: {
  selectedTrade: TradeHistoryType | null;
}) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { updateTradeHistory, isUpdatingingTradeHistory } = useTradeHistory(id);

  const [isEditing] = useState(true);

  // Prepare default values safely
  const defaultValues = useMemo(
    () => ({
      symbols: selectedTrade?.symbols ?? "",
      type: selectedTrade?.type ?? "",
      buyOrSell: selectedTrade?.buyOrSell ?? "",
      price: selectedTrade?.price ?? 0,
      ticks: selectedTrade?.ticks ?? "",
      tradingMode: selectedTrade?.tradingMode ?? "",
      units: selectedTrade?.units ?? 0,
      risk: selectedTrade?.risk ?? "",
      riskPercentage: selectedTrade?.riskPercentage ?? "",
      expireTime: String(selectedTrade?.expireTime) ?? "",
      amount: selectedTrade?.amount ?? 0,
      open: selectedTrade?.open ?? "",
      close: selectedTrade?.close ?? "",
      longOrShortUnit: selectedTrade?.longOrShortUnit ?? "",
      roi: selectedTrade?.roi ?? "",
      createdAt: selectedTrade?.createdAt
        ? new Date(selectedTrade.createdAt)
        : new Date(),
      profitOrLossAmount: selectedTrade?.profitOrLossAmount ?? 0,
      status: selectedTrade?.status ?? "",
    }),
    [selectedTrade]
  );

  // useForm hook
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues,
    mode: "onChange",
  });

  // Submit handler
  async function onSubmit(data: FormSchema) {
    const formData = {
      userId: id,
      tradeData: {
        tradeId: selectedTrade?._id,
        exchangeType: selectedTrade?.exchangeType,
        exchangeTypeIcon: selectedTrade?.exchangeTypeIcon,
        isProcessed: data.status === "PENDING" ? false : true,
        tradeFrom: selectedTrade?.tradeFrom || "",
        ...data,
      },
    };

    console.log(formData);
    await updateTradeHistory(id, formData);
  }

  if (pageLoading || isUpdatingingTradeHistory) {
    return (
      <div className="flex w-full px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="mx-0 sm:mx-0">
        {/* Header Card */}
        <Card className="py-3">
          <CardContent className="grid gap-6">
            <div className="flex items-center gap-1 py-1 px-2 rounded-md border-green-500/70">
              <div className="w-8 h-8 relative">
                <Image
                  src={
                    selectedTrade?.exchangeTypeIcon || "/qrCode_placeholder.jpg"
                  }
                  alt={selectedTrade?.exchangeType || "name"}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <span className="text-md font-semibold">
                {selectedTrade?.exchangeType}: {selectedTrade?.symbols}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="mt-4 gap-2">
          <CardContent>
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="symbols"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Symbols</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Symbols"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

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
                          <SelectItem value={"Market"}>Market</SelectItem>
                          <SelectItem value={"LMT"}>LMT</SelectItem>
                          <SelectItem value={"STP"}>STP</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="buyOrSell"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Buy / Sell</FieldLabel>
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
                          <SelectItem value={"Buy"}>Buy</SelectItem>
                          <SelectItem value={"Sell"}>Sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Price"
                          type="number"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="ticks"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Ticks</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Ticks"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="tradingMode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Trading Mode</FieldLabel>
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
                          <SelectItem value={"Live"}>Live</SelectItem>
                          <SelectItem value={"Demo"}>Demo</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="units"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Units</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Units"
                          type="number"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="risk"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Risk</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Risk"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="riskPercentage"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Risk %</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Risk Percentage"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="expireTime"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Expire Time</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Expire Time"
                          disabled={!isEditing}
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
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        placeholder="Amount"
                        type="number"
                        disabled={!isEditing}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="open"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Open</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Open"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="close"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Close</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Close"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="longOrShortUnit"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Long / Short Unit
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Long or Short Unit"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="roi"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>ROI</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="ROI"
                          disabled={!isEditing}
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
                name="createdAt"
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

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="profitOrLossAmount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Profit / Loss Amount
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Profit / Loss Amount"
                          type="number"
                          disabled={!isEditing}
                        />
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
                          <SelectItem value={"Won"}>Won</SelectItem>
                          <SelectItem value={"Lose"}>Lose</SelectItem>
                          <SelectItem value={"PENDING"}>PENDING</SelectItem>
                          <SelectItem value={"CANCELLED"}>CANCELLED</SelectItem>
                          <SelectItem value={"REJECTED"}>REJECTED</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full mt-2"
              // disabled={!isEditing || isPending}
            >
              {
                // isPending ? <Spinner /> :
                "Update Details"
              }
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default EditTradeOrder;
