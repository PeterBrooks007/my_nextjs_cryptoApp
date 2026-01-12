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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components//ui/spinner";
import { useCurrentUser, useEditProfile } from "@/hooks/useAuth";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { countries } from "@/lib/dummyData";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

const formSchema = z.object({
  firstname: sanitizedString("First name contains invalid characters")
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),
  lastname: sanitizedString("Last name contains invalid characters")
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

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
});

type FormSchema = z.infer<typeof formSchema>;

const EditProfile = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const { data: user } = useCurrentUser();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<{
    code: string;
    label: string;
    phone: string;
  } | null>(null);

  const { mutate, isPending } = useEditProfile();

  //   const { mutate, isPending } = useEditProfile(id);

  const [isEditing] = useState(true);

  // prepare default values from user
  const defaultValues: FormSchema = useMemo(() => {
    return {
      firstname: user?.firstname ?? "",
      lastname: user?.lastname ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: {
        address: user?.address?.address ?? "",
        state: user?.address?.state ?? "",
        country: user?.address?.country ?? "",
      },
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
      firstname: data?.firstname ?? "",
      lastname: data?.lastname ?? "",
      email: user?.email ?? "",
      phone: data?.phone ?? "",
      address: {
        address: data?.address?.address ?? "",
        state: data?.address?.state ?? "",
        country:
          value?.label.toLowerCase() ?? user?.address.country.toLowerCase(),
        countryFlag:
          value?.code.toLowerCase() ?? user?.address.countryFlag.toLowerCase(),
      },
    };

    // console.log(userData);

    await mutate(userData);

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg">Edit Profile</p>
          <div className="flex gap-2">
            <Image
              src={
                `https://flagcdn.com/w80/${user?.address.countryFlag}.png` ||
                "qrCode_placeholder.jpg"
              }
              alt={user?.address.countryFlag ?? ""}
              width={50}
              height={50}
              sizes="24px"
              priority={false} // lazy-load
              className="size-6 rounded-full"
            />
            <p>{user?.address.country}</p>
          </div>
        </div>
        <Separator />

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

          <div className="grid grid-cols-1 gap-3">
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

            <div className="flex-1 flex flex-col gap-4 ">
              <Label htmlFor={""} className="">
                Change Country
              </Label>
              <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    <span className="truncate overflow-hidden text-ellipsis max-w-[80%] text-left">
                      {value ? value.label : user?.address.country}
                    </span>
                    <ChevronsUpDownIcon className="opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Wallet Address..."
                      className="h-9"
                    />
                    <CommandList className="max-h-64 overflow-y-auto touch-pan-y">
                      <CommandEmpty>No Currency found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map(
                          (country: {
                            code: string;
                            label: string;
                            phone: string;
                          }) => (
                            <CommandItem
                              key={country.code}
                              value={country.label}
                              onSelect={() => {
                                setValue(
                                  value?.label === country.label
                                    ? null
                                    : country
                                );
                                setOpen(false);
                              }}
                            >
                              <Image
                                src={`https://flagcdn.com/w80/${country?.code.toLowerCase()}.png`}
                                alt={country.code || ""}
                                width={30}
                                height={30}
                                sizes="30px"
                                priority={false}
                                className="size-7 rounded-full"
                              />
                              {country.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value?.code === country.code
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={!isEditing || isPending}
          >
            {isPending ? <Spinner /> : "Update Details"}
          </Button>
        </FieldGroup>
      </div>
    </form>
  );
};

export default EditProfile;
