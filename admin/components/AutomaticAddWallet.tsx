"use client";

import { Camera, Check, ChevronsUpDown } from "lucide-react";
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
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputGroup, InputGroupInput } from "./ui/input-group";
import { toast } from "sonner";
import { useCoingeckoCoins } from "@/hooks/useCoingeckoCoins";
import { Spinner } from "./ui/spinner";
import { useWalletAddress } from "@/hooks/useWalletAddress";

type CoinGeckoCoinType = {
  id: string;
  name: string;
  symbol: string;
  image: string;
};

export const formSchema = z.object({
  walletAddress: z.string().trim().min(1, "Wallet address is required."),
});

const AutomaticAddWallet = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { addWalletAddress, isAddingWalletAddress } = useWalletAddress();

  const { allCoins, getAllCoingeckoCoins, isLoading } = useCoingeckoCoins();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<CoinGeckoCoinType | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // ✅ safe access
    if (!file) return;

    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!value) {
      return toast.error("Please select a wallet");
    }

    if (!profileImage) {
      return toast.error("Please add a Wallet Qr code image");
    }

    // ✅ File type validation
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(profileImage.type)) {
      toast.error("Invalid file type. Only JPEG and PNG are allowed.");
      return;
    }

    // ✅ File size validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (profileImage.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    // Build payload object
    const userData = {
      walletAddress: data.walletAddress,
      walletName: value.name,
      walletSymbol: value.symbol,
      walletPhoto: value.image,
    };

    // FormData for sending image + data
    const formData = new FormData();
    formData.append("image", profileImage);
    formData.append("userData", JSON.stringify(userData));

    await addWalletAddress(formData); // ✅ triggers mutation + refetch

    // form.reset(); // clear input
    // setProfileImage(null);
    // setImagePreview(null);
    // setValue(null);
  }

  return (
    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
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

          <div className="flex items-center gap-3 pt-2">
            <div className="relative w-36 min-w-36 h-36">
              <Image
                src={imagePreview ?? "/qrCode_placeholder.jpg"}
                alt="wallet-qrcode"
                fill
                className="size-36 object-cover border-2 border-gray-400 rounded-md"
                onClick={handleButtonClick}
              />

              {/* Badge Camera Button */}
              <div
                className="absolute bottom-1 right-1 p-1"
                onClick={handleButtonClick}
              >
                <Camera className="size-7" color="gray" />
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Add Wallet QR Code Image
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to upload a QR code image.
              </p>
            </div>
          </div>

          <FieldGroup className="gap-5 ">
            <Controller
              name="walletAddress"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Wallet Address</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Wallet Address"
                      className="text-base!"
                    />
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
            disabled={isAddingWalletAddress}
            className="w-full"
            type="submit"
          >
            {isAddingWalletAddress && <Spinner />}
            Add Wallet Address
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default AutomaticAddWallet;
