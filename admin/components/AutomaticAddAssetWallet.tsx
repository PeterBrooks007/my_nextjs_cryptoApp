"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

import { useCoingeckoCoins } from "@/hooks/useCoingeckoCoins";
import { Spinner } from "./ui/spinner";
import { useAddAssetWalletFromUser } from "@/hooks/useAdminOperators";
import { useParams } from "next/navigation";

type CoinGeckoCoinType = {
  id: string;
  name: string;
  symbol: string;
  image: string;
};

const AutomaticAddAssetWallet = () => {
  const { allCoins, getAllCoingeckoCoins, isLoading } = useCoingeckoCoins();

  const params = useParams();
  const id = params?.userId as string;

  const { mutate, isPending } = useAddAssetWalletFromUser(id);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<CoinGeckoCoinType | null>(null);

  const handleAddAssetsWallet = async () => {
    const userData = {
      walletName: value?.name,
      walletSymbol: value?.symbol,
      walletPhoto: value?.image,
    };

    const formData = new FormData();

    formData.append("userData", JSON.stringify(userData));

    // console.log(userData);

    await mutate({ id, formData });
    setValue(null);
  };

  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Automatic Wallets</CardTitle> */}
        <CardDescription>
          Select from any predefined wallet address.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* SELECT WALLET DROPDOWN */}

        <div className="w-full flex flex-row gap-2">
          <div className="flex-1">
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
                            setValue(value?.name === coin.name ? null : coin);
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

          <div className="">
            <Button type="button" onClick={() => getAllCoingeckoCoins()}>
              {isLoading ? <Spinner /> : "Refresh"}
            </Button>
          </div>
        </div>

        {value && (
          <div className="flex items-center w-full max-w-full overflow-hidden gap-2 border p-2 rounded-lg">
            <div className="bg-white rounded-lg p-1.5">
              <Image
                src={value?.image ?? ""}
                alt={value?.name ?? "wallet"}
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>

            <p className="flex items-center gap-1 text-[18px] font-semibold truncate">
              {value?.name} wallet selected
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          disabled={isPending}
          className="w-full"
          type="submit"
          onClick={handleAddAssetsWallet}
        >
          {isPending && <Spinner />}
          Add Wallet Address
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AutomaticAddAssetWallet;
