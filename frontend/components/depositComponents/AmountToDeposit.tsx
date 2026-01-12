import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, Delete, X } from "lucide-react";
import { DrawerClose } from "../ui/drawer";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useCurrentUser } from "@/hooks/useAuth";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { WalletAddressType } from "@/types";
import Image from "next/image";
import { toast } from "sonner";
import { useTypeOfDepositStore } from "@/store/typeOfDepositStore";
import WithdrawFormLoaderOverlay from "../withdrawalComponents/WithdrawFormLoaderOverlay";

type AmountToDepositProps = {
  Wallet: string | null;
  walletAddress: WalletAddressType | null;
  setSelectedView: Dispatch<SetStateAction<number>>;
};

const AmountToDeposit = ({
  Wallet,
  walletAddress,
  setSelectedView,
}: AmountToDepositProps) => {
  const [amount, setAmount] = useState("");
  const { data: user } = useCurrentUser();

  const { allCoins, isLoading } = useCoinpaprika(user?.currency?.code);

  const { typeOfDeposit } = useTypeOfDepositStore();

  const handleContinue = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return toast.error("Please enter a valid deposit amount.");
    }

    if (Number(amount) < 1000) {
      return toast.error(
        `Minimum deposit of ${Intl.NumberFormat("en-US", {
          style: "currency",
          currency: user?.currency?.code,
        }).format(1000)}`
      );
    }

    try {
      // Retrieve existing session data from localStorage
      const savedSession = localStorage.getItem("depositSession");

      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        const endTime = new Date(sessionData.countdownEndTime).getTime();
        const currentTime = new Date().getTime();

        if (endTime > currentTime) {
          const remainingMinutes = Math.floor(
            (endTime - currentTime) / (1000 * 60)
          );
          setSelectedView(3);
          return toast.info("Deposit session already active", {
            description: `You have ${remainingMinutes} minute(s) remaining. Cancel if you wish to start another.`,
            duration: 8000,
          });
        }
      }

      if (Wallet !== "Bank") {
        const futureTime = new Date();
        futureTime.setMinutes(futureTime.getMinutes() + 20);

        const depositSession = {
          countdownEndTime: futureTime.toISOString(),
          walletAddress: walletAddress?.walletAddress,
          amountFiat: amount,
          amountCrypto: Number(Number(amount) / CryptoPrice).toFixed(8),
          walletQRCode: walletAddress?.walletQrcode,
          walletName: walletAddress?.walletName,
          walletSymbol: walletAddress?.walletSymbol,
          walletPhoto: walletAddress?.walletPhoto,
          typeOfDeposit: typeOfDeposit,
        };

        // Save session data to localStorage
        localStorage.setItem("depositSession", JSON.stringify(depositSession));

        toast.success("Deposit session activated", {
          description:
            "You have 20 minutes to complete the deposit before the session expires.",
          duration: 10000,
        });

        setSelectedView(3);
      } else {
        const depositSession = {
          amountFiat: amount,
          amountCrypto: Number(Number(amount) / CryptoPrice).toFixed(8),
        };

        await localStorage.setItem(
          "depositSession",
          JSON.stringify(depositSession)
        );
        setSelectedView(5);
      }
    } catch (error) {
      console.error("AsyncStorage error:", error);
      toast.error("An error occurred while accessing storage.");
    }
  };

  const priceData = Array.isArray(allCoins)
    ? allCoins.find(
        (coin) =>
          coin?.symbol === walletAddress?.walletSymbol?.toUpperCase().trim()
      )
    : null; // Use null instead of an empty array

  const CryptoPrice =
    priceData?.quotes?.[user?.currency?.code ?? ""]?.price ?? null;

  return (
    <>
      <div className="sticky top-0 z-10 bg-background rounded-3xl">
        <div className="sticky top-0  bg-background  rounded-3xl flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedView(1)}
          >
            <ChevronLeft className="size-5!" />
          </Button>

          <h2 className="font-semibold">Amount To Deposit </h2>

          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>

        <Separator />
      </div>

      {/* AllCoin loading overlay */}
      {isLoading && <WithdrawFormLoaderOverlay />}

      <div className="flex w-full items-center justify-between px-6 py-3">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center rounded-full border-2 border-lightgray p-0">
            <Image
              src={
                Wallet === "Bank"
                  ? "/bank.png"
                  : walletAddress?.walletPhoto || "/qrCode_placeholder.jpg"
              }
              alt={walletAddress?.walletName ?? "Wallet"}
              width={60}
              height={60}
              className="size-6 object-contain bg-white rounded-full"
            />
          </div>

          <span className="text-sm xs:text-base font-medium">
            {Wallet === "Bank" ? "Request" : walletAddress?.walletName} Method
          </span>
        </div>

        {/* Right */}
        <span className="text-sm xs:text-base font-medium">
          Balance:{" "}
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: user?.currency?.code,
            ...((user?.balance ?? 0) > 99999 ? { notation: "compact" } : {}),
          }).format(user?.balance ?? 0)}
        </span>
      </div>

      <Separator />

      <div className="flex flex-col items-center gap-6 mt-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-muted-foreground">Enter Amount to Deposit</p>
          <Input
            readOnly
            value={amount}
            placeholder="0.00"
            className="bg-transparent! text-center text-4xl! font-bold border-none focus-visible:ring-0 shadow-none"
          />
          <p className="text-muted-foreground">
            {" "}
            {CryptoPrice &&
              Wallet !== "Bank" &&
              Number(Number(amount) / CryptoPrice).toFixed(8)}{" "}
            {Wallet !== "Bank" &&
              CryptoPrice &&
              walletAddress?.walletSymbol.toUpperCase()}
          </p>
        </div>

        {/* keypad */}
        <div className="grid grid-cols-3 gap-4 w-full px-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((v) => (
            <Button
              key={v}
              type="button"
              variant="outline"
              className="py-5.5! text-lg duration-75 active:bg-black/10 dark:active:bg-black/10"
              onClick={() => setAmount((p) => p + v)}
            >
              {v}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            className="py-5.5! text-lg duration-75 active:bg-black/10 dark:active:bg-black/10"
            onClick={() => setAmount((p) => p.slice(0, -1))}
          >
            <Delete className="size-6" />
          </Button>
        </div>

        <Button
          className="w-4/5 mb-5 py-6 text-base!"
          onClick={(e) => handleContinue(e)}
        >
          Continue
        </Button>
      </div>
    </>
  );
};

export default AmountToDeposit;
