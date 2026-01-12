"use client";

import { Button } from "@/components/ui/button";

import {
  Field,
  // FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { useState } from "react";
import { ExchangeItemType } from "@/types";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Calculator } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { useSheetStore } from "@/store/sheetStore";
import { useCurrentUser } from "@/hooks/useAuth";
import TradeHistory from "./TradeHistory";
import { useAddTrade } from "@/hooks/useTrade";

const formSchema = z.object({
  price: z.coerce
    .number({
      error: "price must be a number",
    })
    .min(1, "price is required"),

  ticks: sanitizedString("ticks contains invalid characters")
    .trim()
    .min(1, "ticks required")
    .max(50, "ticks cannot exceed 50 characters"),

  units: z.coerce
    .number({
      error: "units must be a number",
    })
    .min(1, "units is required"),

  risk: sanitizedString("risk contains invalid characters")
    .trim()
    .min(1, "risk required"),

  riskPercentage: sanitizedString("riskPercentage contains invalid characters")
    .trim()
    .min(1, "riskPercentage required")
    .max(50, "riskPercentage cannot exceed 50 characters"),

  expireTime: sanitizedString("expireTime contains invalid characters")
    .trim()
    .min(1, "expireTime required"),

  amount: z.coerce
    .number({
      error: "amount must be a number",
    })
    .min(1, "amount is required"),

  open: sanitizedString("open contains invalid characters")
    .trim()
    .min(1, "open required"),

  close: sanitizedString("close contains invalid characters")
    .trim()
    .min(1, "close required"),

  longOrShortUnit: sanitizedString(
    "longOrShortUnit contains invalid characters"
  )
    .trim()
    .min(1, "longShortUnit required"),

  roi: sanitizedString("roi contains invalid characters")
    .trim()
    .min(1, "roi required"),

  profitOrLossAmount: z.coerce
    .number({
      error: "profitOrLossAmount must be a number",
    })
    .min(0, "profitOrLossAmount is required"),

  status: sanitizedString("status contains invalid characters")
    .trim()
    .min(1, "status required"),
});

type TradeFormProps = {
  type: string | undefined;
  tradeType: string;
  isQuickTrade: boolean;
  selectedExchange: ExchangeItemType | null;
  selectedSymbol: string | null;
};

const TradeForm = ({
  type,
  tradeType,
  isQuickTrade,
  selectedExchange,
  selectedSymbol,
}: TradeFormProps) => {

  const { data: user } = useCurrentUser();
  const id = user?._id as string;

  const { mutate, isPending } = useAddTrade(id);

  const { openTradeHistory, setOpenTradeHistory } = useSheetStore();

  // console.log(type)

  // Take Profit checkbox
  const [checkedTakeProfit, setCheckedTakeProfit] = useState(false);

  const handleChangeTakeProfit = (value: boolean) => {
    setCheckedTakeProfit(value === true);

    if (checkedStopLoss === true) {
      setCheckedStopLoss(false);
    }
  };

  // end of take profit checkbox

  // stop loss checkbox
  const [checkedStopLoss, setCheckedStopLoss] = useState(false);

  // console.log(checkedStopLoss)

  const handleChangeStopLoss = (value: boolean) => {
    setCheckedStopLoss(value === true);

    if (checkedTakeProfit === true) {
      setCheckedTakeProfit(false);
    }
  };

  // end of stop loss checkbox

  const defaultValues = {
    price: 0,
    ticks: tradeType !== "LMT" && tradeType !== "STP" ? "none" : "",
    units: 0,
    risk: "0",
    riskPercentage: "0",
    expireTime: "",
    amount: 0,
    open: "0",
    close: "0",
    longOrShortUnit: "0",
    roi: "0",
    profitOrLossAmount: 0,
    status: "PENDING",
  };

  const [buyOrSell, setBuyOrSell] = useState("");

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: defaultValues,
    mode: "onChange",
  });

  // Subnit trade form
  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!selectedExchange?.exchangeType) {
      return toast.error("Please Select an exchange");
    }

    if (!selectedSymbol) {
      return toast.error("Please Select a symbol");
    }

    const tradeBalance = user?.balance;

    if (type === "Live" && data?.amount > (tradeBalance || 0)) {
      return toast.error("Insufficient trade balance to trade with");
    }

    const demoBalance = user?.demoBalance;

    if (type === "Demo" && data?.amount > (demoBalance || 0)) {
      return toast.error("Insufficient demo balance to trade with");
    }

    const formData = {
      userId: id,
      tradeData: {
        tradingMode: type,
        tradeFrom: "user",
        exchangeType: selectedExchange?.exchangeType,
        exchangeTypeIcon: selectedExchange?.photo,
        symbols: selectedSymbol,
        type: checkedTakeProfit ? "Take Profit" : tradeType,
        buyOrSell,
        ...data,
      },
    };

    // console.log(formData);

    await mutate(formData);

    // form.reset(); // clear input
  }

  return (
    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-3 ">
        <div className="flex items-start gap-2">
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
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Price"
                    className="text-base!"
                  />
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {tradeType !== "Market" && (
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
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Ticks"
                      className="text-base!"
                    />
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="units"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Unit</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Unit"
                    className="text-base!"
                  />
                  <InputGroupAddon align="inline-end">
                    <Calculator className="size-5" />
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {checkedStopLoss && (
            <>
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
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Risk"
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
                name="riskPercentage"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>%Risk</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter RiskPercentage"
                        className="text-base!"
                      />
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </>
          )}
        </div>

        <Separator />

        <div
          className="flex justify-between items-center mx-2"
          style={{ display: isQuickTrade ? "none" : "flex" }}
        >
          <div className="flex items-center gap-3">
            <Checkbox
              id="takeprofit"
              checked={checkedTakeProfit}
              onCheckedChange={handleChangeTakeProfit}
            />
            <Label htmlFor="takeprofit">Take Profit</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="stoploss"
              checked={checkedStopLoss}
              onCheckedChange={handleChangeStopLoss}
            />
            <Label htmlFor="stoploss">Stop Loss</Label>
          </div>
        </div>

        <div
          className="w-full flex flex-row gap-4"
          style={{ display: isQuickTrade ? "none" : "flex" }}
        >
          {/* LEFT INPUT BOX */}
          <div className="flex-1 border border-border rounded-md flex flex-col">
            <Input
              readOnly
              placeholder="75"
              className="px-3 border-b border-border rounded-none"
            />

            <Input
              value={form.watch("price") || ""}
              readOnly
              placeholder="220.01"
              className="px-3 border-b border-border rounded-none"
            />

            <Input
              readOnly
              placeholder="2000"
              className="px-3 border-b border-border rounded-none"
            />

            <Input
              readOnly
              placeholder="0.00"
              className="px-3 border-none rounded-none"
            />
          </div>

          {/* CENTER LABELS */}
          <div className=" flex flex-col justify-around text-center">
            <span className="text-sm">Ticks</span>
            <span className="text-sm">Price</span>
            <span className="text-sm">Money</span>
            <span className="text-sm">%</span>
          </div>

          {/* RIGHT INPUT BOX */}
          <div className="border border-border rounded-md flex-1 flex flex-col">
            <Input
              value={
                checkedStopLoss && tradeType !== "Market"
                  ? form.watch("ticks") || ""
                  : ""
              }
              readOnly
              placeholder="25"
              className="px-3 border-b border-border rounded-none"
            />

            <Input
              value={form.watch("price") || ""}
              readOnly
              placeholder="220.01"
              className="px-3 border-b border-border rounded-none"
            />

            <Input
              value={checkedStopLoss ? form.watch("risk") || "" : ""}
              readOnly
              placeholder="2000"
              className="px-3 border-b border-border rounded-none"
            />

            <Input
              value={checkedStopLoss ? form.watch("riskPercentage") || "" : ""}
              readOnly
              placeholder="0.00"
              className="px-3 border-none rounded-none"
            />
          </div>
        </div>

        <Separator style={{ display: isQuickTrade ? "none" : "flex" }} />

        <Controller
          name="expireTime"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Expire Time</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-rhf-select-language"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select expire time" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value={"0.5"}>30 seconds</SelectItem>
                  <SelectItem value={"1"}>1 minute</SelectItem>
                  <SelectItem value={"5"}>5 minutes</SelectItem>
                  <SelectItem value={"10"}>10 minutes</SelectItem>
                  <SelectItem value={"30"}>30 minutes</SelectItem>
                  <SelectItem value={"60"}>1 hour</SelectItem>
                  <SelectItem value={"180"}>3 hours</SelectItem>
                  <SelectItem value={"360"}>6 hours</SelectItem>
                  <SelectItem value={"600"}>10 hours</SelectItem>
                  <SelectItem value={"1440"}>1 day</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

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

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <p
          className={`font-semibold -mt-2 ${
            type?.toLowerCase() === "live" ? "text-green-400" : "text-red-500"
          }`}
        >
          Trade Balance:{" "}
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: user?.currency?.code ?? "USD",
            ...((type ?? "").toLowerCase() === "live"
              ? {}
              : (user?.demoBalance ?? 0) > 999_999
              ? { notation: "compact" }
              : {}),
          }).format(
            (type ?? "").toLowerCase() === "live"
              ? user?.balance ?? 0
              : user?.demoBalance ?? 0
          )}
        </p>
        {user?.role === "admin" && !true && (
          <>
            <div className="grid grid-cols-2 gap-2">
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
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Open"
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
                name="close"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Close</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Close"
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
                name="longOrShortUnit"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Long or Short Unit
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Long or Short Unit"
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
                name="roi"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>ROI</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter ROI"
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
              name="profitOrLossAmount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Amount Win or Lose
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Amount Win or Lose"
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
                      className="min-w-30"
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
          </>
        )}
      </FieldGroup>

      <div className="grid grid-cols-2 gap-5">
        <Button
          className="mt-4 w-full bg-[#009e4a] text-white text-xl p-6"
          disabled={isPending}
          onClick={() => setBuyOrSell("Buy")}
        >
          {isPending && <Spinner />}
          BUY
        </Button>
        <Button
          className="mt-4 w-full bg-[#d01724] text-white text-xl p-6"
          disabled={isPending}
          onClick={() => setBuyOrSell("Sell")}
        >
          {isPending && <Spinner />}
          SELL
        </Button>
      </div>

      {/* Trade History */}
      <Sheet open={openTradeHistory} onOpenChange={setOpenTradeHistory}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Trade History</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-0">
              <TradeHistory type={type} />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </form>
  );
};

export default TradeForm;
