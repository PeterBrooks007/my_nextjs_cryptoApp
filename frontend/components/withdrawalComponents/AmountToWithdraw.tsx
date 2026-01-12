import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "../ui/button";
import { ArrowLeftRight, ChevronLeft, KeyRound, X } from "lucide-react";
import { DrawerClose } from "../ui/drawer";
import { Separator } from "../ui/separator";
import { useCurrentUser } from "@/hooks/useAuth";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { WalletAddressType } from "@/types";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import WithdrawFormLoaderOverlay from "./WithdrawFormLoaderOverlay";
import { Controller, Resolver, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type AmountToWithdrawProps = {
  Wallet: string | null;
  walletAddress: WalletAddressType | null;
  setSelectedView: Dispatch<SetStateAction<number>>;
};

const formSchema = z.object({
  to: sanitizedString("Wallet Address contains invalid characters")
    .trim()
    .min(0, "Wallet Address is required")
    .max(250, "Wallet Address cannot exceed 50 characters"),
  comment: sanitizedString("Last name contains invalid characters")
    .trim()
    .min(0, "Description must be at least 0 characters")
    .max(200, "Description cannot exceed 200 characters"),
  bankName: sanitizedString("Bank Name contains invalid characters")
    .trim()
    .min(0, "Bank Name must be at least 0 characters")
    .max(50, "Bank Name cannot exceed 50 characters"),
  accountNumber: sanitizedString("Account Number contains invalid characters")
    .trim()
    .min(0, "Account Number must be at least 0 characters")
    .max(50, "Account Number cannot exceed 50 characters"),
  routingNumber: sanitizedString("Routing Number contains invalid characters")
    .trim()
    .min(0, "Routing Number must be at least 0 characters")
    .max(50, "Routing Number cannot exceed 50 characters"),
});

type FormSchema = z.infer<typeof formSchema>;

const AmountToWithdraw = ({
  Wallet,
  walletAddress,
  setSelectedView,
}: AmountToWithdrawProps) => {
  const { data: user } = useCurrentUser();

  const { allCoins, isLoading } = useCoinpaprika(user?.currency?.code);
  const [openWithdrawalLockModal, setOpenWithdrawalLockModal] = useState(false);

  const [amount, setAmount] = useState<string | number>("");
  const [amountInCryoto, setAmountInCryoto] = useState<string | number>("");
  const [isCryptoInput, setIsCryptoInput] = useState(false);

  // console.log(isCryptoInput, isCryptoInput);

  useEffect(() => {
    setTimeout(() => {
      if (allCoins && allCoins.length === 0) {
        setIsCryptoInput(false);
      }
    }, 0);
  }, [allCoins]);

  const priceData = Array.isArray(allCoins)
    ? allCoins.find(
        (coin) =>
          coin?.symbol === walletAddress?.walletSymbol?.toUpperCase().trim()
      )
    : null; // Use null instead of an empty array

  const CryptoPrice =
    priceData?.quotes?.[user?.currency?.code ?? ""]?.price ?? null;

  const quickCheckAmount = isCryptoInput
    ? (Number(amountInCryoto) * CryptoPrice).toString()
    : amount.toString();

  const quickCheckAmountInCrypto = isCryptoInput
    ? amountInCryoto.toString()
    : allCoins && allCoins.length === 0
    ? amountInCryoto.toString()
    : Number(Number(amount) / CryptoPrice).toFixed(8);

  // prepare default values from user
  const defaultValues: FormSchema = useMemo(() => {
    return {
      to: "",
      comment: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
    };
  }, []);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: FormSchema) {
    const withdrawalSession = {
      walletAddress: data.to,
      bankName: data.bankName,
      bankAccount: data.accountNumber,
      routingCode: data.routingNumber,
      amount: quickCheckAmount,
      description: data.comment,
      method: Wallet,
      methodIcon: walletAddress?.walletPhoto ?? "",
      typeOfWithdrawal: "Trade",
      amountInCryoto: quickCheckAmountInCrypto,
      isCryptoInput,
    };

    // console.log("withdrawalSession", withdrawalSession);

    await localStorage.setItem(
      "withdrawalSession",
      JSON.stringify(withdrawalSession)
    );

    if (!quickCheckAmount || Number(quickCheckAmount) === 0)
      return toast.error("Please enter amount");

    if (user && user?.balance < Number(quickCheckAmount))
      return toast.error("Insufficient balance");

    if (user && user?.withdrawalLocked?.isWithdrawalLocked) {
      return setOpenWithdrawalLockModal(true);
    }

    setSelectedView(3);
  }

  // withdrawal code state
  const [withdrawalCode, setWithdrawalCode] = useState("");

  const withdrawalCodeSubmit = () => {
    if (!withdrawalCode) {
      return toast.error("Please enter withdrawal code");
    }

    if (withdrawalCode === String(user?.withdrawalLocked?.lockCode ?? "")) {
      setSelectedView(3);
      setOpenWithdrawalLockModal(false);
    } else {
      toast.error("Wrong Code");
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-background rounded-3xl">
        <div className="sticky top-0  bg-background  rounded-3xl flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedView(1)}
          >
            <ChevronLeft className="size-5!" />
          </Button>

          <h2 className="font-semibold">Amount To Withdraw </h2>

          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>

        <Separator />
      </div>

      {/* AllCoin loading overlay */}
      {isLoading && <WithdrawFormLoaderOverlay />}

      <div className="flex w-full items-center justify-between px-6 py-3">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center rounded-full border-2 border-lightgray p-0">
            <Image
              src={
                Wallet === "Bank"
                  ? "/bank.png"
                  : walletAddress?.walletPhoto || "/qrCode_placeholder.jpg"
              }
              alt={walletAddress?.walletName ?? "Wallet"}
              width={60}
              height={60}
              className="size-6 object-contain bg-white rounded-full"
            />
          </div>

          <span className="text-sm xs:text-base font-medium">
            {Wallet === "Bank" ? "Request" : walletAddress?.walletName} Method
          </span>
        </div>

        {/* Right */}
        <span className="text-sm xs:text-base font-medium">
          Balance:{" "}
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: user?.currency?.code,
            ...((user?.balance ?? 0) > 99999 ? { notation: "compact" } : {}),
          }).format(user?.balance ?? 0)}
        </span>
      </div>

      <Separator />

      <div className="p-5">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FieldGroup className="gap-5">
              {/* Wallet Address Input */}
              {Wallet !== "Bank" && (
                <Controller
                  name="to"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel htmlFor={field.name}>To</FieldLabel>
                      <InputGroup className="h-13!">
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Enter Wallet Address"
                          // disabled={!isEditing}
                          required={Wallet !== "Bank"}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

              {/* Bank Details Inputs */}
              {Wallet === "Bank" && (
                <>
                  <Controller
                    name="bankName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="gap-1"
                      >
                        <FieldLabel htmlFor={field.name}>Bank Name</FieldLabel>
                        <InputGroup className="h-13!">
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            placeholder="Enter Bank Name"
                            // disabled={!isEditing}
                            required={Wallet === "Bank"}
                          />
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="accountNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="gap-1"
                      >
                        <FieldLabel htmlFor={field.name}>
                          Account Number
                        </FieldLabel>
                        <InputGroup className="h-13!">
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            placeholder="Enter Account Number"
                            // disabled={!isEditing}
                            required={Wallet === "Bank"}
                          />
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="routingNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="gap-1"
                      >
                        <FieldLabel htmlFor={field.name}>
                          Routing Number
                        </FieldLabel>
                        <InputGroup className="h-13!">
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            placeholder="Enter Routing Number"
                            // disabled={!isEditing}
                            required={Wallet === "Bank"}
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

              {/* INPUTS SECTION */}
              <div className="flex items-center gap-2">
                {/* FIAT INPUT */}
                <div className="w-full space-y-1">
                  <label className="text-sm font-medium">Amount</label>
                  <div className="relative">
                    <Input
                      required
                      type="text"
                      value={
                        isCryptoInput
                          ? (Number(amountInCryoto) * CryptoPrice).toString()
                          : amount.toString()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        // allow empty input
                        if (value === "") {
                          setAmount("");
                          return;
                        }

                        // allow only numbers
                        if (!isNaN(Number(value))) {
                          setAmount(value);
                        }
                      }}
                      readOnly={isCryptoInput}
                      placeholder="0"
                      className="rounded-lg h-13 pr-15"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">
                      {user?.currency?.code}
                    </span>
                  </div>
                </div>

                {CryptoPrice && walletAddress?.walletName === Wallet && (
                  <>
                    {/* SWITCH BUTTON */}
                    <div className="pt-6">
                      <Button
                        type="button"
                        variant={"outline"}
                        onClick={() => {
                          setAmount(0);
                          setAmountInCryoto(0);
                          setIsCryptoInput(!isCryptoInput);
                        }}
                        className="size-12 p-2 border border-green-500! rounded-lg hover:bg-accent"
                      >
                        <ArrowLeftRight className="size-5! text-green-400 " />
                      </Button>
                    </div>

                    {/* CRYPTO INPUT */}
                    <div className="w-full space-y-1">
                      <label className="text-sm font-medium">
                        {walletAddress?.walletSymbol?.toUpperCase()}
                      </label>

                      <div className="relative">
                        <Input
                          type="text"
                          value={
                            isCryptoInput
                              ? amountInCryoto.toString()
                              : allCoins && allCoins.length === 0
                              ? amountInCryoto.toString()
                              : Number(Number(amount) / CryptoPrice).toFixed(8)
                          }
                          onChange={(e) => {
                            const value = e.target.value;

                            if (value === "") {
                              setAmountInCryoto("");
                              return;
                            }

                            if (!isNaN(Number(value))) {
                              setAmountInCryoto(value);
                            }
                          }}
                          readOnly={!isCryptoInput}
                          placeholder="Enter Amount"
                          className="rounded-lg h-13 pr-15"
                        />

                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">
                          {walletAddress?.walletSymbol?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Controller
                name="comment"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="form-rhf-demo-description">
                      Description !
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-rhf-demo-description"
                        placeholder="Enter description"
                        rows={3}
                        className="min-h-20 resize-none"
                        aria-invalid={fieldState.invalid}
                        required
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
              <div>
                <FieldLabel htmlFor="form-rhf-demo-description">
                  Estimated confirmation time 1+ hour
                </FieldLabel>

                <Button
                  type="submit"
                  className="w-full mt-1 py-5 text-sm"
                  //   disabled={!isEditing || isPending}
                >
                  {/* {isPending ? <Spinner /> : "Update Details"} */} Continue
                </Button>
              </div>
            </FieldGroup>
          </div>
        </form>
      </div>

      {/* withdraw lock modal */}

      <Dialog
        open={openWithdrawalLockModal}
        onOpenChange={setOpenWithdrawalLockModal}
      >
        <DialogContent className="sm:max-w-lg border">
          <DialogHeader>
            <DialogTitle className=" xs:text-xl">
              {user?.withdrawalLocked?.lockSubject}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm xs:text-base text-muted-foreground">
            {user?.withdrawalLocked?.lockComment}
          </p>

          {/* Code Input */}
          <div className="relative mt-3">
            <Input
              value={withdrawalCode}
              onChange={(e) => setWithdrawalCode(e.target.value)}
              placeholder="Enter Code"
              className="pr-12"
            />

            {/* Affix */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
              <KeyRound className="h-4 w-4" />
              CODE
            </span>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenWithdrawalLockModal(false)}
            >
              Close
            </Button>
            <Button onClick={withdrawalCodeSubmit}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AmountToWithdraw;
