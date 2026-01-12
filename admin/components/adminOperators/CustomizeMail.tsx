import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Camera, Send, SendHorizontal, X } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  useAdminSendCustomizedMail,
  useUpdateCustomizeEmailLogo,
} from "@/hooks/useAdminOperators";
import { Controller, Resolver, useForm } from "react-hook-form";
import { Field, FieldError } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "../ui/separator";

// formSchema
export const formSchema = z.object({
  to: sanitizedString("to contains invalid characters")
    .trim()
    .min(1, "to is required.")
    .max(100, "to cannot exceed 10 characters"),
  fullName: sanitizedString("fullName contains invalid characters")
    .trim()
    .min(1, "fullName is required.")
    .max(50, "fullName cannot exceed 50 characters"),
  subject: sanitizedString("subject contains invalid characters")
    .trim()
    .min(1, "subject is required.")
    .max(50, "subject cannot exceed 50 characters"),
  teamName: sanitizedString("teamName contains invalid characters")
    .trim()
    .min(1, "teamName is required.")
    .max(50, "teamName cannot exceed 50 characters"),
  content: sanitizedString("Message contains invalid characters")
    .trim()
    .min(1, "Message is required.")
    .max(1000, "Message cannot exceed 1000 characters"),
  footer: sanitizedString("teamName contains invalid characters")
    .trim()
    .min(1, "footer is required.")
    .max(300, "footer cannot exceed 300 characters"),
});

const CustomizeMail = () => {
  const [pageLoading, setPageLoading] = useState(true);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  //   console.log(inputs);

  const { mutate, isPending } = useUpdateCustomizeEmailLogo(id);
  const { mutate: sendEmailMutate, isPending: isSendingEmailPending } =
    useAdminSendCustomizedMail(id);

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

  const savePhoto = async () => {
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

    await mutate({ id, formData });
    setImagePreview(null);
  };

  const initiatialValue = {
    to: "",
    fullName: "John Doe",
    subject: "Sample Subject",
    teamName: "My Team",
    content:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, pariatur aspernatur est itaque quibusdam obcaecati unde impedit id exercitationem? Cupiditate repellat nobis quidem namre cusandae officia sint reprehenderit delectus ",
    footer: "www.example.com",
  };

  const [inputs, setInputs] = useState(initiatialValue);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      to: "",
      fullName: "",
      subject: "",
      teamName: "",
      content: "",
      footer: "",
    },
    mode: "onChange",
  });

  // Subnit trade form
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setInputs(data);
    // form.reset(); // clear input
  }

  const handleSendMessage = async () => {
    const isEmpty = Object.values(inputs).some((value) => value.trim() === "");

    if (isEmpty) {
      toast.error("Please fill in all the email details");
      return false; // Validation failed
    }

    const formData = {
      ...inputs,
      customizedLogo: singleUser?.customizeEmailLogo,
    };

    await sendEmailMutate({ id, formData });
    setInputs(initiatialValue);
    form.reset();
  };

  if (pageLoading || isPending || isSendingEmailPending) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }
  return (
    <div className="mx-3 sm:mx-4 h-full">
      <Card className="py-3">
        <CardContent className="grid gap-6">
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center gap-3">
              <div className="relative w-20 min-w-20 ">
                <Image
                  src={singleUser?.photo || "/qrCode_placeholder.jpg"}
                  alt="wallet-qrcode"
                  width={50}
                  height={50}
                  className="size-20 object-cover border-2 border-gray-400 rounded-full"
                />
              </div>

              <div>
                <h3 className="w-24 xs:w-32 sm:w-52 text-lg font-semibold truncate">
                  {singleUser?.firstname + " " + singleUser?.lastname}
                </h3>
                <h3 className="w-24 xs:w-32 sm:w-52 text-sm font-semibold truncate">
                  {singleUser?.email}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-auto min-w-42 h-28">
                <h4>Click to Change Logo Image</h4>
                <Image
                  src={
                    imagePreview ??
                    (singleUser?.customizeEmailLogo
                      ? singleUser?.customizeEmailLogo
                      : "/qrCode_placeholder.jpg")
                  }
                  alt="wallet-qrcode"
                  fill
                  className="object-contain border-gray-400 "
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
            </div>

            {imagePreview && (
              <div className="w-full space-x-2 mb-3 flex items-center">
                <Button
                  type="button"
                  size="sm"
                  onClick={savePhoto}
                  // disabled={isUpdatingTradingBotPhoto}
                  className="disabled:bg-gray-400 disabled:text-white"
                >
                  {/* {isUpdatingTradingBotPhoto ? (
                    <Spinner />
                  ) : (
                    <UploadCloud className="w-4 h-4 " />
                  )} */}
                  UPLOAD PHOTO
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  //   disabled={isUpdatingTradingBotPhoto}
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
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 mt-4 gap-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PREVIEW MESSAGE */}
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border rounded-2xl">
              <div className="flex-1 flex flex-col">
                <div>
                  <Controller
                    name="to"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroup className=" rounded-none h-12 dark:bg-transparent">
                          <InputGroupAddon>
                            <InputGroupText>To:</InputGroupText>
                          </InputGroupAddon>
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            type="text"
                            aria-invalid={fieldState.invalid}
                            placeholder=""
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
                <div>
                  <Controller
                    name="fullName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroup className=" rounded-none h-12 dark:bg-transparent">
                          <InputGroupAddon>
                            <InputGroupText>Full Name:</InputGroupText>
                          </InputGroupAddon>
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            type="text"
                            aria-invalid={fieldState.invalid}
                            placeholder=""
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
                <div>
                  <Controller
                    name="subject"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroup className=" rounded-none h-12 dark:bg-transparent">
                          <InputGroupAddon>
                            <InputGroupText>Subject:</InputGroupText>
                          </InputGroupAddon>
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            type="text"
                            aria-invalid={fieldState.invalid}
                            placeholder=""
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
                <div>
                  <Controller
                    name="teamName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroup className=" rounded-none h-12 dark:bg-transparent">
                          <InputGroupAddon>
                            <InputGroupText>Team Name:</InputGroupText>
                          </InputGroupAddon>
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            type="text"
                            aria-invalid={fieldState.invalid}
                            placeholder=""
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
                <div>
                  <Controller
                    name="footer"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroup className=" rounded-none h-12 dark:bg-transparent">
                          <InputGroupAddon>
                            <InputGroupText>Footer Text:</InputGroupText>
                          </InputGroupAddon>
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            type="text"
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter Subject"
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
                <div className="flex-1 flex flex-col">
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="flex-1"
                      >
                        <InputGroup className="rounded-none flex-1 dark:bg-transparent">
                          <InputGroupTextarea
                            {...field}
                            id="form-rhf-demo-description"
                            placeholder="Message Content"
                            rows={6}
                            className="min-h-42 resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon
                            align="block-end"
                            className="border-t"
                          >
                            <InputGroupText className="tabular-nums">
                              {field.value.length}/1000 characters
                            </InputGroupText>
                            <InputGroupButton
                              type="submit"
                              size="sm"
                              className="ml-auto"
                              variant="default"
                              disabled={isPending}
                            >
                              {isPending ? <Spinner /> : <Send />}
                              Previev Message
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>

          {/* SEND MESSAGE */}
          <div className="border rounded-2xl h-full">
            <div className="w-full rounded-[15px] border border-gray-400">
              {/* Header */}
              <div className="flex items-center justify-between p-3">
                <p className="text-base font-semibold">Email Preview</p>
              </div>

              <Separator />

              {/* Image Section */}
              <div className="flex items-center justify-center bg-white p-4">
                <Image
                  src={
                    imagePreview === null
                      ? singleUser?.customizeEmailLogo
                      : imagePreview
                  }
                  alt="profile image"
                  width={250}
                  height={150}
                  className="h-auto w-[250px]"
                />
              </div>

              {/* Greeting */}
              <p className="px-4 pt-4 text-lg font-bold">
                Hi {inputs.fullName},
              </p>

              {/* Main Content */}
              <p className="px-4 py-2">{inputs.content}</p>

              {/* Signature */}
              <div className="px-4 py-2">
                <p className="text-sm">
                  Best Regards <br />
                </p>
                <p className="text-lg font-semibold">{inputs.teamName}</p>
              </div>

              {/* Footer */}
              <div className="bg-gray-300 text-gray-700 px-4 py-2 text-sm text-center">
                {inputs.footer}
              </div>

              <Separator className="mt-4" />

              {/* Button */}
              <div className="p-4">
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={isSendingEmailPending}
                >
                  {!isSendingEmailPending && (
                    <SendHorizontal className="mr-2 h-4 w-4" />
                  )}
                  {isSendingEmailPending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomizeMail;
