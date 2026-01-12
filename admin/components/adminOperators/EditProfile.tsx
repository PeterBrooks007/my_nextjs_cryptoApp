"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import Image from "next/image";
import { Spinner } from "@/components//ui/spinner";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { useEditProfile } from "@/hooks/useAdminOperators";

const formSchema = z.object({
  firstname: sanitizedString("First name contains invalid characters")
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),
  lastname: sanitizedString("Last name contains invalid characters")
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),
  email: sanitizedString("Email contains invalid characters")
    .trim()
    .min(1, "Email is required"),
  phone: sanitizedString("Phone contains invalid characters")
    .trim()
    .min(1, "Phone is required")
    .max(50, "Phone cannot exceed 50 characters"),
  address: z.object({
    address: sanitizedString("Address contains invalid characters")
      .trim()
      .min(1, "Address required")
      .max(500, "Address cannot exceed 500 characters"),
    state: sanitizedString("State contains invalid characters")
      .trim()
      .min(1, "State required")
      .max(50, "State cannot exceed 50 characters"),
    country: sanitizedString("Country contains invalid characters")
      .trim()
      .min(1, "Country required")
      .max(50, "Country cannot exceed 50 characters"),
  }),
  balance: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(0, "balance Must be minimum 0."),
  demoBalance: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(0, "demoBalance Must be minimum 0."),
  earnedTotal: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(0, "earnedTotal Must be minimum 0."),
  totalDeposit: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(0, "totalDeposit Must be minimum 0."),
  referralBonus: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(0, "referralBonus Must be minimum 0."),
  totalWithdrew: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(0, "totalWithdrew Must be minimum 0."),
  package: sanitizedString("Package contains invalid characters")
    .trim()
    .min(1, "package required")
    .max(50, "package cannot exceed 50 characters"),
  pin: sanitizedString("pin contains invalid characters")
    .trim()
    .min(1, "pin required"),
  role: sanitizedString("Role contains invalid characters")
    .trim()
    .min(1, "role required")
    .max(50, "role cannot exceed 50 characters"),
  accounttype: sanitizedString("Account type contains invalid characters")
    .trim()
    .min(1, "account type required")
    .max(50, "account type cannot exceed 50 characters"),
  pinRequired: sanitizedString("Account type contains invalid characters")
    .trim()
    .refine((val) => val === "true" || val === "false", {
      message: "pinRequired must be either 'true' or 'false'.",
    }),
  password: sanitizedString("Password contains invalid characters")
    .trim()
    .min(1, "Password required"),
  isTwoFactorEnabled: sanitizedString(
    "Account type contains invalid characters"
  )
    .trim()
    .refine((val) => val === "true" || val === "false", {
      message: "isTwoFactorEnabled must be either 'true' or 'false'.",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const EditProfile = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);
  const { mutate, isPending } = useEditProfile(id);

  const [isEditing] = useState(true);

  // prepare default values from singleUser
  const defaultValues: FormSchema = useMemo(() => {
    return {
      firstname: singleUser?.firstname ?? "",
      lastname: singleUser?.lastname ?? "",
      email: singleUser?.email ?? "",
      phone: singleUser?.phone ?? "",
      address: {
        address: singleUser?.address?.address ?? "",
        state: singleUser?.address?.state ?? "",
        country: singleUser?.address?.country ?? "",
      },
      balance: singleUser?.balance ?? 0,
      demoBalance: singleUser?.demoBalance ?? 0,
      earnedTotal: singleUser?.earnedTotal ?? 0,
      totalDeposit: singleUser?.totalDeposit ?? 0,
      referralBonus: singleUser?.referralBonus ?? 0,
      totalWithdrew: singleUser?.totalWithdrew ?? 0,
      package: singleUser?.package ?? "",
      pin: singleUser?.pin ?? "",
      role: singleUser?.role ?? "",
      accounttype: singleUser?.accounttype ?? "",
      pinRequired: String(singleUser?.pinRequired) ?? "",
      password: singleUser?.password ?? "",
      isTwoFactorEnabled: String(singleUser?.isTwoFactorEnabled) ?? "",
    };
  }, [singleUser]);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const userData = data;

    // console.log(userData);

    await mutate({ id, userData });

    // form.reset(); // clear input
  }

  if (pageLoading) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <Card className="mt-4 gap-2">
          <CardContent>
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="firstname"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="First name"
                          disabled={!isEditing}
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
                      <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Last name"
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                          placeholder="Email"
                          type="email"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Phone"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
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
                name="address.address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        placeholder="Address"
                        aria-invalid={fieldState.invalid}
                        disabled={!isEditing}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="address.state"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>State</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="State"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="address.country"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Country"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
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
                name="balance"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Trade Balance</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        placeholder="Trade Balance"
                        aria-invalid={fieldState.invalid}
                        disabled={!isEditing}
                      />
                      <InputGroupText className="tabular-nums" />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="demoBalance"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Demo Balance</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Demo Balance"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="earnedTotal"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Total Earned</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Total Earned"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="totalDeposit"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Total Deposit
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Total Deposit"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="referralBonus"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Referral Bonus
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Referral Bonus"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="totalWithdrew"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Total Withdrew
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Total Withdrew"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="package"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Package</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Package"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="pin"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Pin</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Pin"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Role"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="accounttype"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Account Type</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Account Type"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="pinRequired"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Login Pin Required
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="true or false"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="Password"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="isTwoFactorEnabled"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Enable 2FA</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          placeholder="true or false"
                          aria-invalid={fieldState.invalid}
                          disabled={!isEditing}
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
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={!isEditing || isPending}
            >
              {isPending ? <Spinner /> : "Update Details"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default EditProfile;
