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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { NftSettingsType } from "@/types";
import { useNftSettings } from "@/hooks/useNftSettings";

type UpdateNftProps = {
  selectedNft: NftSettingsType | null;
};

// formSchema
export const formSchema = z.object({
  nftName: sanitizedString("Wallet Name contains invalid characters")
    .trim()
    .min(1, "Nft Name is required.")
    .max(50, "Nft Name cannot exceed 50 characters"),
  nftPrice: z.coerce.number({
    error: "Must be a number.",
  }),
  nftCode: sanitizedString("Nft Code contains invalid characters")
    .trim()
    .min(1, "Nft Code is required.")
    .max(50, "Nft Code cannot exceed 50 characters"),
  comment: sanitizedString("comment contains invalid characters")
    .trim()
    .min(1, "Comment is required.")
    .max(200, "Comment cannot exceed 200 characters"),
});

const UpdateNft = ({ selectedNft }: UpdateNftProps) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const { updateNft, isUpdatingNft, updateNftPhoto, isUpdatingNftPhoto } =
    useNftSettings();

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
      nftName: selectedNft?.nftName ?? "",
      nftPrice: selectedNft?.nftPrice ?? 0,
      nftCode: selectedNft?.nftCode ?? "",
      comment: selectedNft?.comment ?? "",
    },
    mode: "onChange",
  });
  // updateExpert Trader
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Build payload object
    const userData = data;

    const id = selectedNft?._id;

    await updateNft(id, userData);

    // form.reset(); // clear input
  }

  // update Nft Photo
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

    const id = selectedNft?._id;

    updateNftPhoto(id, formData);
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
            Use this form to update this trading bot details
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* WALLET ICON */}
          <div className="flex items-center gap-3">
            <div className="relative w-28 min-w-28 h-28">
              <Image
                src={
                  imagePreview ??
                  (selectedNft?.photo && selectedNft.photo !== "No Photo"
                    ? selectedNft.photo
                    : "/qrCode_placeholder.jpg")
                }
                alt="wallet-qrcode"
                fill
                className="size-28 object-cover border-2 border-gray-400 rounded-xl"
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
              <h3 className="text-lg font-semibold">{selectedNft?.nftName}</h3>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to change the Nft Icon
              </p>
            </div>
          </div>

          {imagePreview && (
            <div className="w-full space-x-2 mb-3 flex items-center">
              <Button
                type="button"
                size="sm"
                onClick={savePhoto}
                disabled={isUpdatingNftPhoto}
                className="disabled:bg-gray-400 disabled:text-white"
              >
                {isUpdatingNftPhoto ? (
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
                disabled={isUpdatingNftPhoto}
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
            <div className="grid grid-cols-2 gap-2">
              <Controller
                name="nftName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nft Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Nft Name"
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
                name="nftPrice"
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
            </div>

            <Controller
              name="nftCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>NFT Code</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Nft Code"
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
              name="comment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Short Bio about the Nft
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="Enter Short Bio."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
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
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button disabled={isUpdatingNft} className="w-full" type="submit">
            {isUpdatingNft && <Spinner />}
            Update Nft
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UpdateNft;
