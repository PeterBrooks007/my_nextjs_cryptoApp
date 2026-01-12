"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { Spinner } from "./ui/spinner";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";

// formSchema
export const formSchema = z.object({
  amount: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(1, "Amount Must be minimum 1."),
  subject: sanitizedString("subject contains invalid characters")
    .trim()
    .min(1, "subject is required.")
    .max(50, "subject cannot exceed 50 characters"),
  message: sanitizedString("message contains invalid characters")
    .trim()
    .min(1, "message is required.")
    .max(200, "message cannot exceed 200 characters"),
});

type AddGiftRewardProps = {
  adminAddRewardToUser: (
    id: string,
    formData: {
      amount: number;
      subject: string;
      message: string;
    }
  ) => void;
};

const AddGiftReward = ({ adminAddRewardToUser }: AddGiftRewardProps) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      amount: 0,
      subject: "",
      message: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = {
      ...data,
    };
    await adminAddRewardToUser(id, formData);
    // console.log(formData);
  }

  if (pageLoading) {
    return (
      <div className="flex w-full max-w-lg  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className=" mx-3 sm:mx-4 ">
      <Card className="py-3 ">
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-2 truncate">
            <div className="relative w-16 min-w-16">
              <Image
                src={singleUser?.photo || "/qrCode_placeholder.jpg"}
                alt="wallet-qrcode"
                width={100}
                height={100}
                className="size-16 object-cover border-2 border-gray-400 rounded-full"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {singleUser?.firstname + " " + singleUser?.lastname}
              </h3>
              <h3 className="text-sm font-semibold">{singleUser?.email}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mt-3">
          <CardHeader>
            <CardTitle>Add Gift Reward to this User</CardTitle>
            {/* <CardDescription>Add Deposit History to this user</CardDescription> */}
          </CardHeader>
          <CardContent className="grid gap-6">
            <FieldGroup className="gap-5 ">
              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Amount"
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
                name="subject"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Subject</FieldLabel>
                    <InputGroup>
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
              <Controller
                name="message"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-description">
                      Short message about the reward
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-rhf-demo-description"
                        placeholder="Enter Short Message."
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
              //   disabled={isAddingDepositHistory}
              className="w-full"
              type="submit"
            >
              {/* {isAddingDepositHistory && <Spinner />} */}
              Add Reward
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddGiftReward;
