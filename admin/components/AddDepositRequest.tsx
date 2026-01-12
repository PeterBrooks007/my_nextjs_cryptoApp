"use client";

import { Check, ChevronsUpDown } from "lucide-react";
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
import { InputGroup, InputGroupInput } from "./ui/input-group";
import { Spinner } from "./ui/spinner";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useCoingeckoCoins } from "@/hooks/useCoingeckoCoins";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { toast } from "sonner";

type CoinGeckoCoinType = {
  id: string;
  name: string;
  symbol: string;
  image: string;
};

// formSchema
export const formSchema = z.object({
  type: sanitizedString("type contains invalid characters")
    .trim()
    .min(1, "Type is required.")
    .max(50, "Type cannot exceed 50 characters"),
  amount: z.coerce
    .number({
      error: "Must be a number.",
    })
    .min(1, "Amount Must be minimum 1."),
  status: sanitizedString("Wallet Name contains invalid characters")
    .trim()
    .min(1, "Status is required.")
    .max(50, "Status cannot exceed 50 characters"),
});

type AddDepositRequestProps = {
  addDepositHistory: (formData: {
    status: string;
    userId: string;
    typeOfDeposit: string;
    method: string;
    methodIcon: string;
    type: string;
    amount: number;
  }) => void;
};

const AddDepositRequest = ({ addDepositHistory }: AddDepositRequestProps) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<CoinGeckoCoinType | null>(null);

  const { allCoins } = useCoingeckoCoins();

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      type: "Trade",
      amount: 0,
      status: "APPROVED",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!value) {
      return toast.error("Please select a wallet");
    }
    const formData = {
      ...data,
      status: data?.status,
      userId: singleUser?._id,
      typeOfDeposit: data.type,
      method: value?.name,
      methodIcon: value?.image,
    };

    await addDepositHistory(formData);

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
            <CardTitle>Add Deposit History to this user</CardTitle>
            {/* <CardDescription>Add Deposit History to this user</CardDescription> */}
          </CardHeader>
          <CardContent className="grid gap-6">
            <FieldGroup className="gap-5 ">
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-select-language"
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value={"Trade"}>Trade Deposit</SelectItem>
                        <SelectItem value={"Wallet"}>Wallet Deposit</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <div className="flex-1">
                <Label htmlFor={""} className="mb-1.5">
                  Search Wallet
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
                        {value ? value.name : "Select Wallet..."}
                      </span>
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Wallet Address..."
                        className="h-9"
                      />
                      <CommandList className="max-h-64 overflow-y-auto touch-pan-y">
                        <CommandEmpty>No Wallet found.</CommandEmpty>
                        <CommandGroup>
                          {allCoins.map((coin: CoinGeckoCoinType) => (
                            <CommandItem
                              key={coin.id}
                              value={coin.name}
                              onSelect={() => {
                                setValue(
                                  value?.name === coin.name ? null : coin
                                );
                                setOpen(false);
                              }}
                            >
                              <Image
                                src={coin.image}
                                alt={coin.name}
                                width={30}
                                height={30}
                                className="size-8"
                              />{" "}
                              {coin.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value?.name === coin.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="min-w-[120px]"
                        >
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value={"APPROVED"}>APPROVED</SelectItem>
                          <SelectItem value={"NOT-APPROVED"}>
                            NOT-APPROVED
                          </SelectItem>
                          <SelectItem value={"PENDING"}>PENDING</SelectItem>
                          <SelectItem value={"PROCESSING"}>
                            PROCESSING
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button
              //   disabled={isAddingDepositHistory}
              className="w-full"
              type="submit"
            >
              {/* {isAddingDepositHistory && <Spinner />} */}
              Add History
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddDepositRequest;
