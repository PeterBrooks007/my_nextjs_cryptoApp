import { UserAsset } from "@/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { XCircle, ArrowLeftRight, PlusCircle, MinusCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";

import { Spinner } from "./ui/spinner";
import { useUpdateAssetBalance } from "@/hooks/useAdminOperators";
import ManualUpdateAsset from "./ManualUpdateAsset";

const UpdateAsset = ({
  selectedAsset,
  type,
}: {
  selectedAsset: UserAsset | null;
  type: string | undefined;
}) => {
  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  const { allCoins, isLoading: coinPriceLoading } = useCoinpaprika(
    singleUser?.currency?.code,
    id
  );

  const { mutate, isPending } = useUpdateAssetBalance(id, type);

  type ConversionRate = {
    code: string;
    rate: number;
  };

  const [conversionRate] = useState<ConversionRate | null>(null);

  const [amount, setAmount] = useState<string | number>("");
  const [amountInCryoto, setAmountInCryoto] = useState<string | number>("");
  const [isCryptoInput, setIsCryptoInput] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (allCoins.length === 0) {
        setIsCryptoInput(false);
      }
    }, 0);
  }, [allCoins.length]);

  // console.log(combinedAssets);

  const fundwallet = async () => {
    const amountNumber = Number(amount) || 0;
    const cryptoNumber = Number(amountInCryoto) || 0;

    const price = selectedAsset?.price ?? 1; // fallback to 1 if undefined

    const userData = {
      //the transactionData is for adding wallet transaction history
      transactionData: {
        typeOfTransaction: type === "debit" ? "Sent" : "Received",
        method: selectedAsset?.name,
        methodIcon: selectedAsset?.image,
        symbol: selectedAsset?.symbol.toLowerCase(),
        amount: isCryptoInput
          ? amountInCryoto
          : allCoins.length === 0
          ? amountInCryoto
          : Number(Number(amount) / price).toFixed(8),
        walletAddress: "Own Wallet",
        description:
          type === "debit"
            ? "Asset has been Debited"
            : "Asset has been credited",
        status: "confirmed",
        amountFiat: isCryptoInput ? Number(amountInCryoto) * price : amount,
      },
      symbol: selectedAsset?.symbol,
      amount: isCryptoInput
        ? cryptoNumber
        : Number(amountNumber / (selectedAsset?.price ?? 1)),
    };

    // console.log(userData);

    await mutate({ id, userData });
  };

  if (!selectedAsset) {
    return null;
  }

  return (
    <>
      {singleUser?.isManualAssetMode ? (
        <ManualUpdateAsset selectedAsset={selectedAsset} />
      ) : (
        <div className="">
          {/* HEADER */}
          <div className="flex flex-col space-y-2">
            {/* ERROR BOX (NO COIN RATE) */}
            {allCoins.length === 0 && (
              <div className="py-2 mb-2">
                <div className="flex gap-2 border border-red-500 p-2 rounded">
                  <XCircle size={42} className="text-red-500" />
                  <p className="text-sm">
                    Unable to get fiat rate balance for coins at this time,
                    please kindly make calculations manually for now.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ASSET HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={selectedAsset?.image || "/qrCode_placeholder.jpg"}
                alt={selectedAsset?.name || "image"}
                width={40}
                height={40}
                className="rounded-full bg-white"
              />
              <h3 className="text-lg font-semibold">{selectedAsset?.name}</h3>
            </div>

            <div className="text-lg">
              Price:{" "}
              {coinPriceLoading ? (
                <Skeleton className="h-4 w-[120px]" />
              ) : conversionRate?.rate ? (
                Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: conversionRate?.code,
                  ...(selectedAsset?.price * conversionRate?.rate > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format(selectedAsset?.price * conversionRate?.rate)
              ) : (
                Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: singleUser?.currency?.code,
                  ...(selectedAsset?.price > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format(selectedAsset?.price)
              )}
            </div>
          </div>

          {/* BALANCE SECTION */}
          <div className="my-4">
            <p className="text-lg font-bold text-green-400">
              {selectedAsset?.name} Balance
            </p>

            <p className="text-base font-semibold">
              Fiat Balance:{" "}
              <span className="text-green-400">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: singleUser?.currency?.code,
                  ...(selectedAsset?.balance * selectedAsset?.price > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format(selectedAsset?.balance * selectedAsset?.price)}
              </span>
            </p>

            <p className="text-sm font-semibold">
              {selectedAsset?.balance} {selectedAsset?.symbol?.toUpperCase()}
            </p>
          </div>

          {/* FUNDING OR DEBIT METHOD */}
          <div className="my-3 text-orange-400 font-semibold">
            {type === "debit" ? "Debit with" : "Fund with"}{" "}
            {!isCryptoInput ? "Fiat Method" : "Crypto Method"}
          </div>

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
                      ? Number(amountInCryoto) * selectedAsset?.price
                      : amount
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
                  disabled={allCoins.length === 0}
                  className="rounded-lg h-12"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                  {singleUser?.currency?.code}
                </span>
              </div>
            </div>

            {/* SWITCH BUTTON */}
            <div className="pt-6">
              <Button
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
                {selectedAsset?.symbol?.toUpperCase()}
              </label>

              <div className="relative">
                <Input
                  type="text"
                  value={
                    isCryptoInput
                      ? amountInCryoto
                      : allCoins.length === 0
                      ? amountInCryoto
                      : Number(Number(amount) / selectedAsset?.price).toFixed(8)
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
                  className="rounded-lg h-12"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                  {selectedAsset?.symbol?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-4">
            <Button
              size="lg"
              className="w-full rounded-lg py-3"
              disabled={isPending}
              onClick={fundwallet}
            >
              {isPending ? (
                <Spinner />
              ) : type === "debit" ? (
                <MinusCircle />
              ) : (
                <PlusCircle />
              )}
              {type === "debit" ? "Debit Wallet " : "Fund Wallet "}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateAsset;
