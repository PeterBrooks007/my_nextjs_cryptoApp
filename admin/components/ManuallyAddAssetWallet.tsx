"use client";

import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ChangeEvent, useRef, useState } from "react";
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
import { Spinner } from "./ui/spinner";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { useParams } from "next/navigation";
import { useAddAssetWalletFromUser } from "@/hooks/useAdminOperators";

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
});

const ManuallyAddAssetWallet = () => {
  const params = useParams();
  const id = params?.userId as string;

  const { mutate, isPending } = useAddAssetWalletFromUser(id);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletName: "",
      walletSymbol: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!profileImage) {
      return toast.error("Please add an asset Icon image");
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

    // Build payload object
    const userData = {
      walletName: data.walletName,
      walletSymbol: data.walletSymbol,
    };

    // FormData for sending image + data
    const formData = new FormData();
    formData.append("image", profileImage);
    formData.append("userData", JSON.stringify(userData));

    await mutate({ id, formData });

    // form.reset(); // clear input
  }

  return (
    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          {/* <CardTitle>Password</CardTitle> */}
          <CardDescription className="text-xs sm:text-base font-semibold">
            Note: You must use a real wallet name and symbol and it must match
            deposit wallet name and symbol
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* MANUAL ADD WALLET QRCODE */}
          <div className="flex items-center gap-3">
            <div className="relative w-36 min-w-36 h-36">
              <Image
                src={imagePreview ?? "/qrCode_placeholder.jpg"}
                alt="wallet-qrcode"
                fill
                className="size-36 object-cover border-2 border-gray-400 rounded-full"
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
              <h3 className="text-lg font-semibold">Add Asset Icon</h3>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to add an icon
              </p>
            </div>
          </div>

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
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button disabled={isPending} className="w-full" type="submit">
            {isPending && <Spinner />}
            Add Wallet Address
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ManuallyAddAssetWallet;
