"use client";

import { Camera, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Field,
  // FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputGroup, InputGroupInput } from "./ui/input-group";
import { toast } from "sonner";
import { useWalletAddress } from "@/hooks/useWalletAddress";
import { Spinner } from "./ui/spinner";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { WalletAddressType } from "@/types";

type UpdateWalletAddressProps = {
  selectedWallet: WalletAddressType | null;
};

// formSchema
export const formSchema = z.object({
  walletName: sanitizedString("Wallet Name contains invalid characters")
    .trim()
    .min(1, "Wallet Name is required.")
    .max(100, "Wallet Name cannot exceed 100 characters"),
  walletSymbol: sanitizedString("Wallet Symbol contains invalid characters")
    .trim()
    .min(1, "Wallet Symbol is required.")
    .max(50, "Wallet Symbol cannot exceed 50 characters"),
  walletAddress: sanitizedString("Wallet Address contains invalid characters")
    .trim()
    .min(1, "Wallet Address is required.")
    .max(100, "Wallet Address cannot exceed 100 characters"),
});

const UpdateWalletAddress = ({ selectedWallet }: UpdateWalletAddressProps) => {
  const [pageLoading, setPageLoading] = useState(true);

  // console.log(selectedWallet)

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const {
    updateWalletAddress,
    isUpdatingWalletAddress,
    updateWalletAddresIcon,
    isUpdatingWalletAddresIcon,
    updateWalletAddresQrcode,
    isUpdatingWalletAddresQrcode,
  } = useWalletAddress();

  const [profileImageQrcode, setProfileImageQrcode] = useState<File | null>(
    null
  );
  const [imagePreviewQrcode, setImagePreviewQrcode] = useState<string | null>(
    null
  );
  const fileInputRefQrcode = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRefQrcode.current) {
      fileInputRefQrcode.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // ✅ safe access
    if (!file) return;

    if (file) {
      setProfileImageQrcode(file);
      setImagePreviewQrcode(URL.createObjectURL(file));
    }
  };

  const [profileImageIcon, setProfileImageIcon] = useState<File | null>(null);
  const [imagePreviewIcon, setImagePreviewIcon] = useState<string | null>(null);
  const fileInputRefIcon = useRef<HTMLInputElement | null>(null);

  const handleButtonClickIcon = () => {
    if (fileInputRefIcon.current) {
      fileInputRefIcon.current.click();
    }
  };

  const handleImageChangeIcon = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // ✅ safe access
    if (!file) return;

    if (file) {
      setProfileImageIcon(file);
      setImagePreviewIcon(URL.createObjectURL(file));
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletName: selectedWallet?.walletName,
      walletSymbol: selectedWallet?.walletSymbol,
      walletAddress: selectedWallet?.walletAddress,
    },
    mode: "onChange",
  });

  // updateWalletAddress
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Build payload object
    const userData = {
      walletName: data.walletName,
      walletSymbol: data.walletSymbol,
      walletAddress: data.walletAddress,
    };

    const id = selectedWallet?._id;

    await updateWalletAddress(id, userData); // ✅ triggers mutation + refetch

    // form.reset(); // clear input
  }

  // updateWalletAddressIcon
  const savePhotoIcon = () => {
    if (!profileImageIcon) {
      return toast.error("Please add a Wallet Qr code image");
    }

    // ✅ File type validation
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(profileImageIcon.type)) {
      toast.error("Invalid file type. Only JPEG and PNG are allowed.");
      return;
    }

    // ✅ File size validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (profileImageIcon.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    // FormData for sending image + data
    const formData = new FormData();
    formData.append("image", profileImageIcon);

    const id = selectedWallet?._id;

    updateWalletAddresIcon(id, formData);
  };

  if (pageLoading) {
    return (
      <div className="flex w-full max-w-lg  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  // updateWalletAddressQrCode
  const savePhotoQrcode = () => {
    if (!profileImageQrcode) {
      return toast.error("Please add a Wallet Qr code image");
    }

    // ✅ File type validation
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(profileImageQrcode.type)) {
      toast.error("Invalid file type. Only JPEG and PNG are allowed.");
      return;
    }

    // ✅ File size validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (profileImageQrcode.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    // FormData for sending image + data
    const formData = new FormData();
    formData.append("image", profileImageQrcode);

    const id = selectedWallet?._id;

    updateWalletAddresQrcode(id, formData);
  };

  return (
    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          {/* <CardTitle>Password</CardTitle> */}
          <CardDescription>
            Use this form to update this wallet address details
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* WALLET ICON */}
          <div className="flex items-center gap-3">
            <div className="relative w-28 min-w-28 h-28">
              <Image
                src={
                  imagePreviewIcon ??
                  (selectedWallet?.walletPhoto &&
                  selectedWallet.walletPhoto !== "No Photo"
                    ? selectedWallet.walletPhoto
                    : "/qrCode_placeholder.jpg")
                }
                alt="wallet-qrcode"
                fill
                className="size-28 object-cover border-2 border-gray-400 rounded-full"
                onClick={handleButtonClickIcon}
              />

              {/* Badge Camera Button */}
              <div
                className="absolute bottom-1 right-1 p-1"
                onClick={handleButtonClickIcon}
              >
                <Camera className="size-7" color="gray" />
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRefIcon}
                className="hidden"
                onChange={handleImageChangeIcon}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {selectedWallet?.walletName} Wallet
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to change the wallet Icon
              </p>
            </div>
          </div>

          {imagePreviewIcon && (
            <div className="w-full space-x-2 mb-3 flex items-center">
              <Button
                type="button"
                size="sm"
                onClick={savePhotoIcon}
                disabled={isUpdatingWalletAddresIcon}
                className="disabled:bg-gray-400 disabled:text-white"
              >
                {isUpdatingWalletAddresIcon ? (
                  <Spinner />
                ) : (
                  <UploadCloud className="w-4 h-4 " />
                )}
                UPLOAD PHOTO
              </Button>

              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={isUpdatingWalletAddresIcon}
                onClick={() => {
                  setProfileImageIcon(null);
                  setImagePreviewIcon(null);
                  if (fileInputRefIcon.current)
                    fileInputRefIcon.current.value = "";
                }}
              >
                <X className="w-4 h-4 " /> CANCEL UPLOAD
              </Button>
            </div>
          )}

          {/* WALLET QR CODE */}
          <div className="flex items-center gap-3">
            <div className="relative w-36 min-w-36 h-36">
              <Image
                src={
                  imagePreviewQrcode ??
                  (selectedWallet?.walletQrcode
                    ? selectedWallet?.walletQrcode
                    : "/qrCode_placeholder.jpg")
                }
                alt="wallet-qrcode"
                fill
                className="size-36 object-cover border-2 border-gray-400 rounded-md"
                onClick={handleButtonClick}
              />

              {/* Badge Camera Button */}
              <div
                className="absolute bottom-1 right-1 p-1"
                onClick={handleButtonClick}
              >
                <Camera className="size-7" color="gray" />
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRefQrcode}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Add Wallet QR Code Image
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to upload a QR code image.
              </p>
            </div>
          </div>

          {imagePreviewQrcode && (
            <div className="w-full space-x-2 mb-3 flex items-center">
              <Button
                type="button"
                size="sm"
                onClick={savePhotoQrcode}
                disabled={isUpdatingWalletAddresQrcode}
                className="disabled:bg-gray-400 disabled:text-white"
              >
                {isUpdatingWalletAddresQrcode ? (
                  <Spinner />
                ) : (
                  <UploadCloud className="w-4 h-4 " />
                )}
                UPLOAD PHOTO
              </Button>

              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={isUpdatingWalletAddresQrcode}
                onClick={() => {
                  setProfileImageQrcode(null);
                  setImagePreviewQrcode(null);
                  if (fileInputRefQrcode.current)
                    fileInputRefQrcode.current.value = "";
                }}
              >
                <X className="w-4 h-4 " /> CANCEL UPLOAD
              </Button>
            </div>
          )}

          <FieldGroup className="gap-5 ">
            <div className="grid grid-cols-2 gap-2">
              <Controller
                name="walletName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Wallet Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Wallet Name"
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
                name="walletSymbol"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Wallet Symbol</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Wallet Symbol"
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
              name="walletAddress"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Wallet Address</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Wallet Address"
                      className="text-base!"
                    />
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button
            disabled={isUpdatingWalletAddress}
            className="w-full"
            type="submit"
          >
            {isUpdatingWalletAddress && <Spinner />}
            Edit Wallet Address
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UpdateWalletAddress;
