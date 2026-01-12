import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, X } from "lucide-react";
import { DrawerClose } from "../ui/drawer";
import { Separator } from "../ui/separator";
import { combinedAssetsTypes } from "@/types";
import Image from "next/image";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { useCurrentUser } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useFundAccountStore } from "@/store/fundAccountStore";
import { useWalletTransaction } from "@/hooks/useWalletTransaction";

type QuickCheckProps = {
  Wallet: string | null;
  walletAddress: combinedAssetsTypes | null;
  setSelectedView: Dispatch<SetStateAction<number>>;
};

export type WithdrawalSession = {
  walletAddress: string;
  bankName: string;
  bankAccount: string;
  routingCode: string;
  amount: string;
  description: string;
  method: string;
  methodIcon: string;
  typeOfWithdrawal: "Trade";
  amountInCryoto: string;
  isCryptoInput: boolean;
};

const QuickCheck = ({
  Wallet,
  walletAddress,
  setSelectedView,
}: QuickCheckProps) => {
  const { data: user } = useCurrentUser();

  const id = user?._id as string;

  const { addTransaction, isAddingTransaction } = useWalletTransaction(
    id,
    setSelectedView
  );

  const { isFundAccount } = useFundAccountStore();

  const [savedSession, setSavedSession] = useState<WithdrawalSession | null>(
    null
  );

  // console.log(savedSession);

  useEffect(() => {
    const getWithdrawalSession = async () => {
      try {
        const session = await localStorage.getItem("withdrawalSession");
        if (session) {
          setSavedSession(JSON.parse(session));
        }
      } catch (error) {
        console.error("Failed to load deposit session:", error);
        setSavedSession(null);
      }
    };

    getWithdrawalSession();
  }, []);

  const { allCoins } = useCoinpaprika(user?.currency?.code);

  const priceData = Array.isArray(allCoins)
    ? allCoins.find(
        (coin) => coin?.symbol === walletAddress?.symbol?.toUpperCase().trim()
      )
    : null; // Use null instead of an empty array

  const CryptoPrice =
    priceData?.quotes?.[user?.currency?.code ?? ""]?.price ?? null;

  const quickCheckAmount = savedSession?.isCryptoInput
    ? Number(
        CryptoPrice ? CryptoPrice * Number(savedSession?.amountInCryoto) : 0
      )
    : Number(savedSession?.amount) || 0;

  const quickCheckAmountInCrypto = savedSession?.isCryptoInput
    ? Number(savedSession?.amountInCryoto) || 0
    : CryptoPrice
    ? Number(Number(savedSession?.amount) / CryptoPrice)
    : 0;

  const handleSubmit = async () => {
    try {
      if (
        user?.isManualAssetMode === false &&
        (walletAddress?.balance ?? 0) < quickCheckAmountInCrypto
      ) {
        return toast.error("Insufficient Balance");
      }

      if (user?.isManualAssetMode === false && !quickCheckAmountInCrypto) {
        return toast.error("Amount is are required");
      }

      // if (user?.balance < quickCheckAmount) {
      //   return Toast.error("Insufficient Balance");
      // }

      if (!savedSession?.amount) {
        return toast.error("Please enter amount to withdraw");
      }

      if (
        user?.isManualAssetMode === true &&
        (walletAddress?.ManualFiatbalance ?? 0) < Number(savedSession?.amount)
      ) {
        return toast.error("Insufficient Balance");
      }

      const formData = {
        userId: user?._id,
        transactionData: {
          typeOfTransaction: "Sent",
          method: walletAddress?.name,
          methodIcon: walletAddress?.image,
          symbol: walletAddress?.symbol,
          amount: quickCheckAmountInCrypto,
          walletAddress: isFundAccount
            ? "Trade Balance"
            : savedSession?.walletAddress,
          description: savedSession?.description,
          status: isFundAccount ? "confirmed" : "Pending",
          amountFiat: Number(savedSession?.amount),
        },
      };

      await addTransaction(formData);
    } catch (error) {
      if (error instanceof Error) {
        // console.log("submit error", error.message);
      }
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

          <h2 className="font-semibold">Quick Check</h2>

          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>

        <Separator />
      </div>

      <div className="overflow-y-auto p-4 overflow-x-hidden space-y-4">
        {/* Alert Box */}
        <div className="flex items-start justify-center gap-2 border border-dashed border-orange-400 px-2 py-2 text-xs  rounded-md">
          {/* <CircleAlert className="size-5" /> */}
          <span>Kindly confirm details before initiating the withdrawal</span>
        </div>

        {/* Section Divider */}
        <div className="flex items-center gap-3 -mx-5">
          <Separator className="flex-1" />
          <span className="font-medium text-sm">Confirm Details</span>
          <Separator className="flex-1" />
        </div>

        {/* Confirm Details Card */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-4">
          {/* Wallet Header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-md border-2 border-muted p-1 bg-white">
              <Image
                src={
                  Wallet === "Bank"
                    ? "/bank.png"
                    : walletAddress?.image ?? "/qrCode_placeholder.jpg"
                }
                width={30}
                height={30}
                alt=""
                className="object-contain"
              />
            </div>

            <h3 className="text-lg font-semibold">
              {Wallet === "Bank" ? "Bank" : walletAddress?.name} wallet
            </h3>
          </div>

          <Separator />

          {/* Crypto To */}
          {Wallet !== "Bank" && (
            <>
              <div className="space-y-1">
                <p className="font-semibold">To:</p>
                <p className="break-all text-sm">
                  {savedSession?.walletAddress}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Bank Fields */}
          {Wallet === "Bank" && (
            <>
              <div className="space-y-1">
                <p className="font-semibold">Bank Name:</p>
                <p>{savedSession?.bankName}</p>
              </div>
              <Separator />

              <div className="space-y-1">
                <p className="font-semibold">Account Number:</p>
                <p>{savedSession?.bankAccount}</p>
              </div>
              <Separator />

              <div className="space-y-1">
                <p className="font-semibold">Routing Number:</p>
                <p>{savedSession?.routingCode}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Withdrawal Amount */}
          <div className="space-y-1">
            <p className="font-semibold">Withdrawal Amount:</p>
            <p>
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: user?.currency?.code,
                ...(quickCheckAmount > 999_999_999
                  ? { notation: "compact" }
                  : {}),
              }).format(quickCheckAmount)}
            </p>
          </div>

          <Separator />

          {/* Crypto Amount */}
          {Wallet !== "Bank" && allCoins.length !== 0 && (
            <>
              <div className="space-y-1">
                <p className="font-semibold">
                  Amount in {walletAddress?.name}:
                </p>
                <p>
                  {quickCheckAmountInCrypto.toFixed(8)}{" "}
                  {walletAddress?.symbol?.toUpperCase()}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Submit Button */}
          <Button
            className="w-full mt-4 text-sm font-bold"
            disabled={isAddingTransaction}
            onClick={handleSubmit}
          >
            {isAddingTransaction && <Spinner />}
            {isAddingTransaction ? "Processing..." : "Initiate Withdrawal"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuickCheck;
