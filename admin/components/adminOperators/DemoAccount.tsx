import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import { Switch } from "../ui/switch";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useDemoAccount } from "@/hooks/useAdminOperators";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupInput, InputGroupText } from "../ui/input-group";

const formSchema = z.object({
  demoBalance: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(1, "Amount must be minimum 1."),
});

type FormSchema = z.infer<typeof formSchema>;

const DemoAccount = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  const { mutate, isPending } = useDemoAccount(id);

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
      demoBalance: singleUser?.demoBalance || 0,
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!data.demoBalance || data.demoBalance < 1) {
      return toast.error(
        "Demo Balance is required and must be greater than zero"
      );
    }

    if (isNaN(data.demoBalance)) {
      return toast.error("Demo Balance must be a valid number");
    }

    const userData = {
      isDemoAccountActivated: checked,
      demoBalance: data.demoBalance,
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
            {singleUser?.isDemoAccountActivated ? (
              <CheckCircle className="text-green-400" />
            ) : (
              <XCircle color="red" />
            )}
            <p className="font-semibold">
              {singleUser?.isDemoAccountActivated
                ? "Demo is Activated"
                : "Activate Demo Account"}
            </p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked}
            onCheckedChange={(checked) => handleSwitchChange(checked)}
            name="switch1"
          />
        </div>

        <p className="mt-1">Click to Activate or deactivate DemoTrade</p>
      </Card>

      {/* SET DEMO BALANCE */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mt-4 gap-2">
          <CardContent>
            <FieldGroup className="gap-4">
              <Controller
                name="demoBalance"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Enter Demo Balance:</FieldLabel>
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

export default DemoAccount;
