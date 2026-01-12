"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import Image from "next/image";
import { Spinner } from "@/components//ui/spinner";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { useBalanceUpdate } from "@/hooks/useAdminOperators";

const formSchema = z.object({
  amount: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(1, "Amount must be minimum 1."),
});

type FormSchema = z.infer<typeof formSchema>;

const BalanceUpdate = ({ type }: { type?: string | undefined }) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);
  const { mutate, isPending } = useBalanceUpdate(id, type);

  const [isEditing] = useState(true);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      amount: 0,
    },
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
              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <p>
                      Current Trade Balance:{" "}
                      <span className="text-green-400 font-bold">
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: singleUser?.currency?.code,
                          ...(singleUser?.balance > 9999999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(singleUser?.balance)}
                      </span>
                    </p>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        placeholder="Amount"
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
            </FieldGroup>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={!isEditing || isPending}
            >
              {isPending ? (
                <Spinner />
              ) : type === "debit" ? (
                "Debit Balance"
              ) : (
                "Fund Balance"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default BalanceUpdate;
