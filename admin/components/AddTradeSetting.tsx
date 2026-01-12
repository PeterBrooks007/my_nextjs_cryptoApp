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

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Field,
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
import { useConnectWallets } from "@/hooks/useConnectWallets";
import { useTradeSettings } from "@/hooks/useTradeSettings";

// formSchema
export const formSchema = z.object({
  exchangeType: sanitizedString("Exchange Name contains invalid characters")
    .trim()
    .min(1, "Exchange Name is required.")
    .max(50, "Exchange Name cannot exceed 50 characters"),
});

const AddTradeSetting = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { addTradeSetting, isAddingTradeSetting } = useTradeSettings();

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
      exchangeType: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!profileImage) {
      return toast.error("Please add a Bot photo");
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
    const userData = data;

    // FormData for sending image + data
    const formData = new FormData();
    formData.append("image", profileImage);
    formData.append("userData", JSON.stringify(userData));

    await addTradeSetting(formData); // ✅ triggers mutation + refetch

    // form.reset(); // clear input
  }

  if (pageLoading) {
    return (
      <div className="flex w-full max-w-lg  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col px-4">
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            {/* <CardTitle>Password</CardTitle> */}
            <CardDescription>
              Use this form to add a new exchange
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* MANUAL ADD WALLET QRCODE */}
            <div className="flex items-center gap-3">
              <div className="relative w-32 min-w-32 h-32 rounded-full">
                <Image
                  src={imagePreview ?? "/qrCode_placeholder.jpg"}
                  alt="wallet-qrcode"
                  fill
                  className="size-32 object-cover border-2 border-gray-400 rounded-full"
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
                <h3 className="text-lg font-semibold">Add Exchange Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Click the camera icon to add an Icon image
                </p>
              </div>
            </div>

            <FieldGroup className="gap-5 ">
              <Controller
                name="exchangeType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Exchange Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Exchange Name"
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
              disabled={isAddingTradeSetting}
              className="w-full"
              type="submit"
            >
              {isAddingTradeSetting && <Spinner />}
              ADD EXCHANGE
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddTradeSetting;
