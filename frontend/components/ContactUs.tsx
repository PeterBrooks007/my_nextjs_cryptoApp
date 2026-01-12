"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components//ui/spinner";
import { useContactUs, useCurrentUser } from "@/hooks/useAuth";
import { Card, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

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
  subject: sanitizedString("Phone contains invalid characters")
    .trim()
    .min(1, "subject is required")
    .max(50, "subject cannot exceed 50 characters"),
  message: sanitizedString("Phone contains invalid characters")
    .trim()
    .min(1, "message is required")
    .max(1000, "message cannot exceed 1000 characters"),
});

type FormSchema = z.infer<typeof formSchema>;

const ContactUs = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const { data: user } = useCurrentUser();

  const { mutate, isPending } = useContactUs();

  //   const { mutate, isPending } = useEditProfile(id);

  const [isEditing] = useState(true);

  // prepare default values from user
  const defaultValues: FormSchema = useMemo(() => {
    return {
      firstname: user?.firstname ?? "",
      lastname: user?.lastname ?? "",
      email: user?.email ?? "",
      subject: "",
      message: "",
    };
  }, [user]);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const userData = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };

    // console.log(userData)

    mutate(userData);

    form.reset(); // clear input
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
      <Card className="p-4 gap-5">
        <CardTitle>Use this form to send us a message</CardTitle>
        <Separator />
        <div className="space-y-4">
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Controller
                name="firstname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                    <InputGroup className="h-12">
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
                    <InputGroup className="h-12">
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

            <div className="grid grid-cols-1 gap-3">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <InputGroup className="h-12">
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        placeholder="Email"
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

            <div className="grid grid-cols-1 gap-3">
              <Controller
                name="subject"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Subject</FieldLabel>
                    <InputGroup className="h-12">
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        placeholder="Subject"
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
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Message
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="Enter Message"
                      rows={4}
                      className="min-h-20 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/1000 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? <Spinner /> : " Send Message"}
            </Button>
          </FieldGroup>
        </div>
      </Card>
    </form>
  );
};

export default ContactUs;
