import { UserAsset } from "@/types";
import React, { useState } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SquarePen } from "lucide-react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";

import { Spinner } from "./ui/spinner";
import { useManualUpdateAssetBalance } from "@/hooks/useAdminOperators";

const ManualUpdateAsset = ({
  selectedAsset,
}: {
  selectedAsset: UserAsset | null;
}) => {
  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  const { mutate, isPending } = useManualUpdateAssetBalance(id);

  const [amount, setAmount] = useState<string | number>("");
  const [amountInCryoto, setAmountInCryoto] = useState<string | number>("");

  // console.log(combinedAssets);

  const fundwallet = async () => {
    const userData = {
      symbol: selectedAsset?.symbol,
      amount: Number(amount),
      amountInCryoto: Number(amountInCryoto),
    };

    await mutate({ id, userData });
  };

  if (!selectedAsset) {
    return null;
  }

  return (
    <div className="">
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
              ...(selectedAsset?.ManualFiatbalance > 999999
                ? { notation: "compact" }
                : {}),
            }).format(selectedAsset?.ManualFiatbalance)}
          </span>
        </p>

        <p className="text-sm font-semibold">
          {selectedAsset?.Manualbalance} {selectedAsset?.symbol.toUpperCase()}{" "}
        </p>
      </div>

      {/* FUNDING OR DEBIT METHOD */}
      <div className="my-3 text-orange-400 font-semibold">
        Manual Mode Update
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
              value={amount}
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
              className="rounded-lg h-12"
              placeholder="Fiat Amount"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
              {singleUser?.currency?.code}
            </span>
          </div>
        </div>

        {/* CRYPTO INPUT */}
        <div className="w-full space-y-1">
          <label className="text-sm font-medium">
            {selectedAsset?.symbol?.toUpperCase()}
          </label>

          <div className="relative">
            <Input
              type="text"
              value={amountInCryoto}
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
              placeholder={`Enter Amount in ${selectedAsset.symbol}`}
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
          {isPending ? <Spinner /> : <SquarePen />}
          Update Asset Balance
        </Button>
      </div>
    </div>
  );
};

export default ManualUpdateAsset;
