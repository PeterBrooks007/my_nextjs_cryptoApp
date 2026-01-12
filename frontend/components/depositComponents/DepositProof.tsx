"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useAuth";
import { DepositSessionType } from "@/types";
import { Spinner } from "../ui/spinner";

type DepositProofProps = {
  savedSession: DepositSessionType | null;
  setSelectedView: Dispatch<SetStateAction<number>>;
  depositFunds: (formData: FormData) => void;
  isDepositingFunds: boolean;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function DepositProof({
  savedSession,
  depositFunds,
  isDepositingFunds,
}: DepositProofProps) {
  const { data: user } = useCurrentUser();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  //   const [uploadLoading, setUploadLoading] = useState(false);

  //   console.log("savedSession", savedSession);

  // Image pick (Web)
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only JPEG or PNG images are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be under 5MB.");
      return;
    }

    setProfileImage(file);
  };

  // Submit
  const handleFormSubmit = async () => {
    if (!profileImage) {
      toast.error("Please add a proof of deposit image.");
      return;
    }

    try {
      const userData = {
        amount: savedSession?.amountFiat,
        method: savedSession?.walletName,
        typeOfDeposit: savedSession?.typeOfDeposit,
        methodIcon: savedSession?.walletPhoto,
      };

      const formData = new FormData();
      formData.append("image", profileImage);
      formData.append("userData", JSON.stringify(userData));

      await depositFunds(formData);
    } catch (err: unknown) {
      let message = "Upload failed.";
      if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message);
    } finally {
      setProfileImage(null);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-orange-400 text-base">
        Upload a proof of your deposit.
      </p>

      {/* Type */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-muted-foreground">
          Type of Deposit
        </label>
        <Input
          disabled
          value={`${savedSession?.typeOfDeposit} Account Deposit`}
          className="h-12"
        />
      </div>

      {/* Method */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Method
        </label>
        <div className="relative">
          <Input disabled value={savedSession?.walletName} className="h-12" />
          {savedSession?.walletPhoto && (
            <Image
              src={savedSession.walletPhoto}
              alt=""
              width={28}
              height={28}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
            />
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">
          Amount
        </label>
        <Input
          disabled
          value={`${savedSession?.amountFiat} ${user?.currency?.code}`}
          className="h-12"
        />
      </div>

      {/* Upload */}
      <label className="flex flex-col items-center gap-2 mt-4 cursor-pointer">
        <div className="relative">
          <Image
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : "/proof_image.jpg"
            }
            alt="Proof"
            width={150}
            height={150}
            className="size-32 rounded-md border object-contain"
          />
          <div className="absolute -bottom-2 -right-2 rounded-full border bg-background p-2">
            <Camera className="h-4 w-4" />
          </div>
        </div>

        <input
          type="file"
          accept="image/png,image/jpeg"
          hidden
          onChange={handleImagePick}
        />

        <span className="text-sm font-medium">Add Proof of Deposit</span>
        <span className="text-xs text-muted-foreground">
          Click image to upload
        </span>
      </label>

      {/* Submit */}
      <Button
        className="mt-4 w-full"
        disabled={isDepositingFunds}
        onClick={handleFormSubmit}
      >
        {isDepositingFunds && <Spinner />}
        {isDepositingFunds ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  );
}
