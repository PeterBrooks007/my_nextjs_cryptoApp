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
import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputGroup, InputGroupInput } from "./ui/input-group";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { ConnectWalletsType } from "@/types";
import { useConnectWallets } from "@/hooks/useConnectWallets";

type UpdateConnectWalletProps = {
  selectedConnectWallet: ConnectWalletsType | null;
};

// formSchema
export const formSchema = z.object({
  name: sanitizedString("Wallet Name contains invalid characters")
    .trim()
    .min(1, "Bot Name is required.")
    .max(50, "Bot Name cannot exceed 50 characters"),
});

const UpdateConnectWallet = ({
  selectedConnectWallet,
}: UpdateConnectWalletProps) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const {
    updateConnectWallet,
    isUpdatingConnectWallet,
    updateConnectWalletPhoto,
    isUpdatingConnectWalletPhoto,
  } = useConnectWallets();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // ✅ safe access
    if (!file) return;

    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      name: selectedConnectWallet?.name ?? "",
    },
    mode: "onChange",
  });
  // updateExpert Trader
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Build payload object
    const userData = data;

    const id = selectedConnectWallet?._id;

    await updateConnectWallet(id, userData);

    // form.reset(); // clear input
  }

  // update ConnectWallet Photo
  const savePhoto = () => {
    if (!profileImage) {
      return toast.error("Please add a Profile image");
    }

    // ✅ File type validation
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(profileImage.type)) {
      toast.error("Invalid file type. Only JPEG and PNG are allowed.");
      return;
    }

    // ✅ File size validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (profileImage.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    // FormData for sending image + data
    const formData = new FormData();
    formData.append("image", profileImage);

    const id = selectedConnectWallet?._id;

    updateConnectWalletPhoto(id, formData);
  };

  if (pageLoading) {
    return (
      <div className="flex w-full max-w-lg  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          {/* <CardTitle>Password</CardTitle> */}
          <CardDescription>
            Use this form to update this connect wallet details
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* WALLET ICON */}
          <div className="flex items-center gap-3">
            <div className="relative w-28 min-w-28 h-28">
              <Image
                src={
                  imagePreview ??
                  (selectedConnectWallet?.photo &&
                  selectedConnectWallet.photo !== "No Photo"
                    ? selectedConnectWallet.photo
                    : "/qrCode_placeholder.jpg")
                }
                alt="wallet-qrcode"
                fill
                className="size-28 object-cover border-2 border-gray-400 rounded-full"
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
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {selectedConnectWallet?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to change the wallet Icon
              </p>
            </div>
          </div>

          {imagePreview && (
            <div className="w-full space-x-2 mb-3 flex items-center">
              <Button
                type="button"
                size="sm"
                onClick={savePhoto}
                disabled={isUpdatingConnectWalletPhoto}
                className="disabled:bg-gray-400 disabled:text-white"
              >
                {isUpdatingConnectWalletPhoto ? (
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
                disabled={isUpdatingConnectWalletPhoto}
                onClick={() => {
                  setProfileImage(null);
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <X className="w-4 h-4 " /> CANCEL UPLOAD
              </Button>
            </div>
          )}

          <FieldGroup className="gap-5 ">
            <Controller
              name="name"
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
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button
            disabled={isUpdatingConnectWallet}
            className="w-full"
            type="submit"
          >
            {isUpdatingConnectWallet && <Spinner />}
            Update Wallet
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UpdateConnectWallet;
