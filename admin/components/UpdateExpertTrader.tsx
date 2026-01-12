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
import { ExpertTraderType } from "@/types";
import { useExpertTraders } from "@/hooks/useExpertTraders";

type UpdateExpertTraderProps = {
  selectedTrader: ExpertTraderType | null;
};

// formSchema
export const formSchema = z.object({
  firstname: sanitizedString("Wallet Name contains invalid characters")
    .trim()
    .min(1, "First Name is required.")
    .max(50, "First Name cannot exceed 50 characters"),
  lastname: sanitizedString("Last Name contains invalid characters")
    .trim()
    .min(1, "Last Name is required.")
    .max(50, "Last Name cannot exceed 50 characters"),
  email: z.string().trim().min(1, "Email is required."),
  winRate: sanitizedString("Win Rate contains invalid characters")
    .trim()
    .min(1, "Win Rate is required.")
    .max(10, "Win Rate cannot exceed 10 characters"),
  profitShare: sanitizedString("Profit Share contains invalid characters")
    .trim()
    .min(1, "Profit Share is required.")
    .max(10, "Profit Share cannot exceed 10 characters"),
  comment: sanitizedString("comment contains invalid characters")
    .trim()
    .min(1, "Comment is required.")
    .max(200, "Comment cannot exceed 200 characters"),
});

const UpdateExpertTrader = ({ selectedTrader }: UpdateExpertTraderProps) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const {
    updateExpertTrader,
    isUpdatingExpertTrader,
    updateExpertTraderPhoto,
    isUpdatingExpertTraderPhoto,
  } = useExpertTraders();

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
      firstname: selectedTrader?.firstname ?? "",
      lastname: selectedTrader?.lastname ?? "",
      email: selectedTrader?.email ?? "",
      winRate: selectedTrader?.winRate ?? "",
      profitShare: selectedTrader?.profitShare ?? "",
      comment: selectedTrader?.comment ?? "",
    },
    mode: "onChange",
  });
  // updateExpert Trader
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Build payload object
    const userData = data;

    const id = selectedTrader?._id;

    await updateExpertTrader(id, userData);

    // form.reset(); // clear input
  }

  // updateTrader Photo
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

    const id = selectedTrader?._id;

    updateExpertTraderPhoto(id, formData);
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
            Use this form to update this expert trader details
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* WALLET ICON */}
          <div className="flex items-center gap-3">
            <div className="relative w-28 min-w-28 h-28">
              <Image
                src={
                  imagePreview ??
                  (selectedTrader?.photo && selectedTrader.photo !== "No Photo"
                    ? selectedTrader.photo
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
                {selectedTrader?.firstname + " " + selectedTrader?.lastname}
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
                disabled={isUpdatingExpertTraderPhoto}
                className="disabled:bg-gray-400 disabled:text-white"
              >
                {isUpdatingExpertTraderPhoto ? (
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
                disabled={isUpdatingExpertTraderPhoto}
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
                name="firstname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter First Name"
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
                name="lastname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Last Name"
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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Email"
                      className="text-base!"
                    />
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <Controller
                name="winRate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Win Rate</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Win Rate"
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
                name="profitShare"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Profit Share</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Profit Share"
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
              name="comment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Short Bio about the Trader
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
          <Button
            disabled={isUpdatingExpertTrader}
            className="w-full"
            type="submit"
          >
            {isUpdatingExpertTrader && <Spinner />}
            Update Expert Trader
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UpdateExpertTrader;
