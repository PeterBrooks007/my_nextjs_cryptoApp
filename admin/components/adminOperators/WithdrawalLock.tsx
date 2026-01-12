import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import { Switch } from "../ui/switch";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useWithdrawalLock } from "@/hooks/useAdminOperators";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { sanitizedString } from "@/lib/zodSanitizeUtil";

const formSchema = z.object({
  lockCode: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(1, "Lock Code must be minimum 1."),
  lockSubject: sanitizedString("Lock Subject contains invalid characters")
    .trim()
    .min(1, "Lock Subject is required.")
    .max(50, "Lock Subject cannot exceed 50 characters"),
  lockComment: sanitizedString("Lock Comment contains invalid characters")
    .trim()
    .min(1, "Lock Comment is required.")
    .max(200, "Lock Comment cannot exceed 50 characters"),
});

type FormSchema = z.infer<typeof formSchema>;

const WithdrawalLock = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  const { mutate, isPending } = useWithdrawalLock(id);

  const [checked, setChecked] = useState(singleUser?.isDemoAccountActivated);

  useEffect(() => {
    setTimeout(() => {
      if (singleUser?.isDemoAccountActivated) {
        setChecked(singleUser?.isDemoAccountActivated);
      }
    }, 0);
  }, [singleUser?.isDemoAccountActivated]);

  // Handle switch change
  const handleSwitchChange = (isChecked: boolean) => {
    setChecked(isChecked);

    // Delay submit
    // setTimeout(async () => {
    //   await handleFormSubmit();
    // }, 500);
  };

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      lockCode: singleUser?.withdrawalLocked?.lockCode || 0,
      lockSubject: singleUser?.withdrawalLocked?.lockSubject || "",
      lockComment: singleUser?.withdrawalLocked?.lockComment || "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const userData = {
      isWithdrawalLocked: checked,
      ...data,
    };

    // console.log(userData);

    await mutate({ id, userData });

    // form.reset(); // clear input
  }

  if (pageLoading || isPending) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-4">
      <Card className="py-3">
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-3 truncate">
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
              <h3 className="text-lg font-semibold">
                {singleUser?.firstname + " " + singleUser?.lastname}
              </h3>
              <h3 className="text-sm font-semibold">{singleUser?.email}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ACTIVATE OR DEACTIVATE DEMO TRADE SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {singleUser?.withdrawalLocked?.isWithdrawalLocked ? (
              <CheckCircle className="text-green-400" />
            ) : (
              <XCircle color="red" />
            )}
            <p className="font-semibold">
              {singleUser?.withdrawalLocked?.isWithdrawalLocked
                ? "Withdrawal Lock is Activated"
                : "Activate Withdrawal Lock"}
            </p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked}
            onCheckedChange={(checked) => handleSwitchChange(checked)}
            name="switch1"
          />
        </div>

        <p className="mt-1">Click to Activate or deactivate Withadrawal Lock</p>
      </Card>

      {/* SET DEMO BALANCE */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mt-4 gap-2">
          <CardContent>
            <FieldGroup className="gap-4">
              <Controller
                name="lockCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Lock Code:</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        placeholder="Amount"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupText className="tabular-nums" />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lockSubject"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Lock Subject:</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        placeholder="Amount"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupText className="tabular-nums" />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lockComment"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-description">
                      Lock Comment
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
            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending && <Spinner />}
              INITIATE CHANGE
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default WithdrawalLock;
