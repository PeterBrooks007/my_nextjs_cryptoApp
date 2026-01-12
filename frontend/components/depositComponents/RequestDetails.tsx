import Image from "next/image";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useDepositHistory } from "@/hooks/useDepositHistory";
import { Spinner } from "../ui/spinner";

const RequestDetails = () => {
  const { requestDepositDetails, isRequestingDepositDetails } =
    useDepositHistory();

  const savedSession = (() => {
    const raw = localStorage.getItem("depositSession");
    return raw ? JSON.parse(raw) : null;
  })();

  const [modeOfDeposit, setModeOfDeposit] = useState("Bank Transfer");

  const handleMakeRequest = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (savedSession?.amountFiat < 1000) {
      return toast.error("Minimum deposit of $1,000");
    }

    const formData = {
      amount: Number(savedSession?.amountFiat),
      method: modeOfDeposit,
    };

    console.log(formData);

    await requestDepositDetails(formData);
  };
  return (
    <div className="flex flex-col items-center gap-6 mt-4">
      {/* Bank Logo */}
      <div className="relative flex justify-center border-2 border-gray-300 rounded-2xl p-4">
        <Image src={"/bank.png"} alt={"Bank"} width={100} height={100} />

        <div className="absolute -bottom-4 flex items-center gap-1 bg-background px-2">
          <Image src={"/bank.png"} alt="Bank" width={20} height={20} />
          <span className="text-sm">Request</span>
        </div>
      </div>

      <Separator className="w-full" />

      {/* Info Box */}
      <div className="mx-4 border border-dashed border-orange-400 px-2 py-1 text-center text-xs">
        Use the form below to request for any details to make your deposit.
      </div>

      {/* Inputs */}
      <div className="w-[90%] flex flex-col gap-4">
        {/* Deposit Mode */}
        <div className="w-full h-auto flex flex-col gap-1">
          <label className="text-sm font-medium">
            Preferred Mode of Deposit
          </label>

          <Select value={modeOfDeposit} onValueChange={setModeOfDeposit}>
            <SelectTrigger className="w-full h-12!">
              <SelectValue placeholder="Select deposit method" />
            </SelectTrigger>
            <SelectContent className="w-full! z-1002">
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Western Union">Western Union</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium">Amount to Deposit</label>

          <Input
            type="number"
            readOnly
            value={savedSession?.amountFiat}
            placeholder="0"
            className="h-12"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="rounded-lg"
          disabled={isRequestingDepositDetails}
          onClick={(e) => handleMakeRequest(e)}
        >
          {isRequestingDepositDetails && <Spinner className="size-5" />}
          {isRequestingDepositDetails ? " Requesting..." : "Make Request"}
        </Button>
      </div>
    </div>
  );
};

export default RequestDetails;
