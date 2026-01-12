"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOff, Lock } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  use2faAuthentication,
  useChangePassword,
  useChangePin,
  useCurrentUser,
} from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "./ui/switch";

export const formSchema = z
  .object({
    currentPassword: sanitizedString(
      "Current Password contains invalid characters"
    )
      .trim()
      .min(6, "Current Password must be at least 6 characters long."),
    newPassword: sanitizedString("New Password contains invalid characters")
      .trim()
      .min(6, "New Password must be at least 6 characters long."),
    confirmPassword: sanitizedString(
      "Confirm Password contains invalid characters"
    )
      .trim()
      .min(6, "Confirm password must be at least 6 characters long."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // sets the error on the cpassword field
  });

export const formSchemaPin = z
  .object({
    currentPin: sanitizedString("Current Pin contains invalid characters")
      .trim()
      .min(4, "Current Pin must be at least 6 characters long."),
    newPin: sanitizedString("New Password contains invalid characters")
      .trim()
      .min(4, "New Pin must be at least 6 characters long."),
    confirmPin: sanitizedString("Confirm Pin contains invalid characters")
      .trim()
      .min(4, "Confirm pin must be at least 6 characters long."),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "Pins do not match.",
    path: ["confirmPin"], // sets the error on the cpassword field
  });

const SecuritySystem = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const { data: user } = useCurrentUser();

  const { mutate, isPending } = useChangePassword();
  const { mutate: mutatePin, isPending: isChangingPinLoading } = useChangePin();

  const { mutate: twofaAuthMutate, isPending: twofaAuthIsPending } =
    use2faAuthentication();

  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const togglePasswordVisibilityPin = () => {
    setShowPin((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  function onPasswordSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  const pinform = useForm<z.infer<typeof formSchemaPin>>({
    resolver: zodResolver(formSchemaPin),
    defaultValues: {
      currentPin: "",
      newPin: "",
      confirmPin: "",
    },
    mode: "onChange",
  });

  function onPinSubmit(data: z.infer<typeof formSchemaPin>) {
    mutatePin(data);
  }

  // 2fa authentication section

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (user) {
        setChecked(user?.isTwoFactorEnabled);
      }
    }, 0);
  }, [user]);

  // Handle switch change
  const handleSwitchChange = (isChecked: boolean) => {
    setChecked(isChecked);

    setTimeout(() => {
      handleFormSubmit(isChecked);
    }, 600);
  };
  const handleFormSubmit = async (isChecked: boolean) => {
    const userData = {
      isTwoFactorEnabled: isChecked,
    };

    console.log(userData);

    await twofaAuthMutate(userData);
  };

  if (pageLoading || twofaAuthIsPending) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }
  return (
    <div className="space-y-5">
      {/*   2fa Authentication (2FA)*/}
      <Card className="w-full">
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between gap-5 items-start lg:items-center ">
            <div className="flex flex-col gap-1 sm:gap-2">
              <p className=" text-lg sm:text-xl 2xl:text-2xl font-semibold">
                Two-Factor Authentication (2FA)
              </p>
              <p className="text-muted-foreground text-base sm:text-base lg:text-base">
                Kindly set up 2 factor authentication for a stronger account
                security.
              </p>
            </div>

            <div className="flex justify-center items-center gap-2">
              <p>OFF</p>
              <Switch
                className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
                checked={checked}
                onCheckedChange={handleSwitchChange}
                name="switch1"
              />
              <p>ON</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
        {/* CHANGE PASSWORD */}
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onPasswordSubmit)}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                It is best to change your password once every month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-5 ">
                <Controller
                  name="currentPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Current Password
                      </FieldLabel>

                      <InputGroup className="h-12">
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter Current Password"
                          className="text-base!"
                        />
                        <InputGroupAddon>
                          <Lock className="size-5" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Copy"
                            title="Toggle Visibility"
                            size="icon-sm"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="size-6" />
                            ) : (
                              <EyeIcon className="size-6" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="newPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>New Password</FieldLabel>

                      <InputGroup className="h-12">
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter New Password"
                          className="text-base!"
                        />
                        <InputGroupAddon>
                          <Lock className="size-5" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Copy"
                            title="Toggle Visibility"
                            size="icon-sm"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="size-6" />
                            ) : (
                              <EyeIcon className="size-6" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Confirm Password
                      </FieldLabel>

                      <InputGroup className="h-12">
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter Confirm Password"
                          className="text-base!"
                        />
                        <InputGroupAddon>
                          <Lock className="size-5" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Copy"
                            title="Toggle Visibility"
                            size="icon-sm"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="size-6" />
                            ) : (
                              <EyeIcon className="size-6" />
                            )}
                          </InputGroupButton>
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

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    Processing...
                  </div>
                ) : (
                  "Change Password"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/* CHANEG PIN */}
        <form id="form-rhf-demo2" onSubmit={pinform.handleSubmit(onPinSubmit)}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Change Pin</CardTitle>
              <CardDescription>
                It is best to change your password once every month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-5 ">
                <Controller
                  name="currentPin"
                  control={pinform.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Current Pin</FieldLabel>

                      <InputGroup className="h-12">
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type={showPin ? "text" : "password"}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter Current Pin"
                          className="text-base!"
                        />
                        <InputGroupAddon>
                          <Lock className="size-5" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Copy"
                            title="Toggle Visibility"
                            size="icon-sm"
                            onClick={togglePasswordVisibilityPin}
                          >
                            {showPin ? (
                              <EyeOff className="size-6" />
                            ) : (
                              <EyeIcon className="size-6" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="newPin"
                  control={pinform.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>New Pin</FieldLabel>

                      <InputGroup className="h-12">
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type={showPin ? "text" : "password"}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter New Pin"
                          className="text-base!"
                        />
                        <InputGroupAddon>
                          <Lock className="size-5" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Copy"
                            title="Toggle Visibility"
                            size="icon-sm"
                            onClick={togglePasswordVisibilityPin}
                          >
                            {showPin ? (
                              <EyeOff className="size-6" />
                            ) : (
                              <EyeIcon className="size-6" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPin"
                  control={pinform.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Confirm Pin</FieldLabel>

                      <InputGroup className="h-12">
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type={showPin ? "text" : "password"}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter Confirm Pin"
                          className="text-base!"
                        />
                        <InputGroupAddon>
                          <Lock className="size-5" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Copy"
                            title="Toggle Visibility"
                            size="icon-sm"
                            onClick={togglePasswordVisibilityPin}
                          >
                            {showPin ? (
                              <EyeOff className="size-6" />
                            ) : (
                              <EyeIcon className="size-6" />
                            )}
                          </InputGroupButton>
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

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                disabled={isChangingPinLoading}
                className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
              >
                {isChangingPinLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    Processing...
                  </div>
                ) : (
                  "Change Pin"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default SecuritySystem;
