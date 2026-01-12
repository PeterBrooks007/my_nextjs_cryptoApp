import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useChangeCurrency } from "@/hooks/useAdminOperators";
import { Button } from "../ui/button";

import { Label } from "../ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { currencies } from "@/lib/dummyData";

const ChangeCurrency = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);
  const { mutate, isPending } = useChangeCurrency(id);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<{ code: string; flag: string } | null>(
    null
  );

  // handleFormSubmit
  const handleFormSubmit = async () => {
    const userData = {
      code: value?.code,
      flag: value?.flag,
    };

    // console.log(userData);

    await mutate({ id, userData });
  };

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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
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
                <h3 className="w-24 xs:w-32 sm:w-52 text-lg font-semibold truncate">
                  {singleUser?.firstname + " " + singleUser?.lastname}
                </h3>
                <h3 className="w-24 xs:w-32 sm:w-52 text-sm font-semibold truncate">
                  {singleUser?.email}
                </h3>
              </div>
            </div>

            <div className="space-y-1">
              <p>CURRENCY</p>
              <div className="flex gap-2 items-center">
                <Image
                  width={"30"}
                  height={"30"}
                  style={{ borderRadius: "50%" }}
                  src={`https://flagcdn.com/w80/${singleUser?.currency?.flag}.png`}
                  alt={singleUser?.currency?.code}
                  className="size-6"
                />
                <p>{singleUser?.currency?.code}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SET THE RATE YOU WANT USER TO WIN OR LOSE */}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex-1">
          <Label htmlFor={""} className="mb-1.5">
            Select Currency
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
                  {value ? value.code : "Select Currency..."}
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
                    {currencies.map(
                      (currency: { code: string; flag: string }) => (
                        <CommandItem
                          key={currency.code}
                          value={currency.code}
                          onSelect={() => {
                            setValue(
                              value?.code === currency.code ? null : currency
                            );
                            setOpen(false);
                          }}
                        >
                          <Image
                            src={`https://flagcdn.com/w80/${currency?.flag}.png`}
                            alt={currency.code || ""}
                            width={30}
                            height={30}
                            className="size-7 rounded-full"
                          />
                          {currency.code}
                          <Check
                            className={cn(
                              "ml-auto",
                              value?.code === currency.code
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

        <Button className="mt-2 w-full" onClick={handleFormSubmit}>
          INITITATE CHANGES
        </Button>
      </Card>
    </div>
  );
};

export default ChangeCurrency;
