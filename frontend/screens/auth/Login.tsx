"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Chrome, MailIcon, EyeIcon, EyeOff } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useLogin } from "@/hooks/useAuth";

import {
  Field,
  // FieldDescription,
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
import AuthMobileHeader from "./AuthMobileHeader";
import { sanitizedString } from "@/lib/zodSanitizeUtil";

export const formSchema = z.object({
  email: sanitizedString("Email contains invalid characters")
    .trim()
    .min(1, "Email is required."),
  password: sanitizedString("Password contains invalid characters")
    .trim()
    .min(6, "Password must be at least 6 characters long."),
});

const LoginPage = () => {
  const { mutate, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between relative overflow-x-hidden  ">
      {/* Logo background */}
      <div className="absolute -right-15 -top-15 opacity-5">
        <Image
          src="/favicon_logo.png"
          alt="logo"
          width={200}
          height={200}
          className=""
        />
      </div>

      {/* Auth Headers */}
      <div className="w-full p-2 pt-4 z-10 ">
        <AuthMobileHeader
          writeUp={"Don't have an account ?"}
          buttonText={"Register"}
          link={"/auth/register"}
        />
      </div>

      {/* Centered Login Form */}
      <div className="flex flex-1 flex-col items-center mt-5 xs:mt-10 xl:mt-15 2xl:mt-25  w-full max-w-lg space-y-6 p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Login with your Tradexs10 Credentials
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Don’t have an account yet? Go to register.
          </p>
        </div>

        <div className="w-full space-y-4">
          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full rounded-lg flex items-center justify-center gap-2 p-5 text-black dark:text-gray-200"
          >
            <Chrome className="size-6! text-red-500" />
            SIGN UP WITH GOOGLE
          </Button>

          <Separator className="my-4" />

          {/* Login Form */}
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5 ">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <InputGroup className="h-14">
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="Email Address"
                        className="text-base!"
                      />
                      <InputGroupAddon>
                        <MailIcon className="size-5" />
                      </InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                    <InputGroup className="h-14">
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Password"
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

            <div className="flex justify-end my-2">
              <Link href="/auth/forget-password">
                <Button
                  variant="link"
                  className="text-green-600 dark:text-emerald-400 font-medium"
                >
                  Forgot Credentials?
                </Button>
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                "Login Account"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
