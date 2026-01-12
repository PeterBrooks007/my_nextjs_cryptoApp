import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  CircleAlert,
  Copy,
  X,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import { DrawerClose } from "../ui/drawer";
import { Separator } from "../ui/separator";

import { toast } from "sonner";
import Image from "next/image";
import { shortenText } from "@/lib/utils";
import { Input } from "../ui/input";
import { useCurrentUser } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import DepositProof from "./DepositProof";
import { useDepositHistory } from "@/hooks/useDepositHistory";

type MakeTheDepositNowProps = {
  Wallet: string | null;
  setSelectedView: Dispatch<SetStateAction<number>>;
};

type CountdownTimerProps = {
  setSelectedView: (view: number) => void;
};

export function CountdownTimer({ setSelectedView }: CountdownTimerProps) {
  const { resolvedTheme } = useTheme(); // "light" | "dark"

  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const savedSession = localStorage.getItem("depositSession");

        if (!savedSession) return;

        const { countdownEndTime } = JSON.parse(savedSession);

        const endTime = new Date(countdownEndTime).getTime();
        const currentTime = Date.now();
        const timeDiff = endTime - currentTime;

        if (timeDiff > 0) {
          setTimeLeft({
            minutes: Math.floor(timeDiff / (1000 * 60)),
            seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
          });
        } else {
          // Session expired
          setTimeLeft({ minutes: 0, seconds: 0 });
          localStorage.removeItem("depositSession");

          //   dispatch(SET_COINPRICE_NULL());
          setSelectedView(1);

          toast.info("Deposit session expired.");
        }
      } catch (error) {
        console.error("Failed to read depositSession:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [setSelectedView]);

  const isCritical = timeLeft.minutes <= 5;

  return (
    <div className="flex items-center">
      <div className="flex h-5 w-12.5 items-center justify-center rounded-md">
        <span
          className={`text-base font-semibold ${
            isCritical
              ? "text-red-500"
              : resolvedTheme === "dark"
              ? "text-green-400"
              : "text-green-700"
          }`}
        >
          {timeLeft.minutes}:
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </span>
      </div>
    </div>
  );
}

const MakeTheDepositNow = ({
  Wallet,
  setSelectedView,
}: MakeTheDepositNowProps) => {
  const { data: user } = useCurrentUser();

  const [openDepositProof, setOpenDepositProof] = React.useState(false);

  const savedSession = (() => {
    const raw = localStorage.getItem("depositSession");
    return raw ? JSON.parse(raw) : null;
  })();

  // Function to handle copy amount
  const handleCopyAmount = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.info("Amount Copied", {
      description: `${text}`,
      duration: 3000,
      position: "bottom-center",
    });
  };

  // Function to handle copy wallet
  const handleCopyWallet = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.info("Wallet Address Copied", {
      description: `${text}`,
      duration: 3000,
      position: "bottom-center",
    });
  };

  // end of copy wallet

  // Conclude session
  const handleConcludeSession = () => {
    const raw = localStorage.getItem("depositSession");

    if (!raw) {
      setSelectedView(1);
      toast.info("No active deposit session.");
      return;
    }

    localStorage.removeItem("depositSession");
    setSelectedView(4);
  };

  //   useDepositHistory
  const { depositFunds, isDepositingFunds } = useDepositHistory(
    handleConcludeSession
  );

  // Cancel session function
  const handleCancelSession = async () => {
    try {
      const savedSession = await localStorage.getItem("depositSession");

      if (!savedSession) {
        setSelectedView(1);
        return toast.info("No active deposit session to cancel.");
      }

      // Clear session data
      await localStorage.removeItem("depositSession");

      // Reset your app state
      setSelectedView(1);

      toast.error("Deposit session canceled.");
    } catch (error) {
      console.error("Error cancelling session:", error);
      toast.error("Something went wrong canceling the session.");
    }
  };

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

          <h2 className="font-semibold">{savedSession?.walletName} Deposit </h2>

          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5!" />
            </Button>
          </DrawerClose>
        </div>

        <Separator />
      </div>

      <div className="mt-2 h-full">
        {/* Info Box */}
        <div className="m-2 mx-4 rounded-lg border-[0.5px] border-dashed border-orange-400 p-2 text-center text-xs xs:text-sm">
          Scan the QR code or copy the address to deposit. Notify us with proof
          of deposit for faster processing.
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-2 text-base text-muted-foreground">
          <span>Time Left:</span>
          <CountdownTimer setSelectedView={setSelectedView} />
        </div>

        {/* QR Section */}
        <div className="mt-2 flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center rounded-2xl border-2 border-zinc-500 p-4">
            <Image
              src={savedSession?.walletQRCode || "/qrCode_placeholder.jpg"}
              alt={savedSession?.walletName || "qrcode_image"}
              width={150}
              height={150}
              className="border border-zinc-500"
            />

            {/* Side bars */}
            <div className="absolute -left-1.5 top-1/4 h-20 w-3 rounded bg-background" />
            <div className="absolute -right-1.5 top-1/4 h-20 w-3 rounded bg-background" />

            {/* Bottom badge */}
            <div className="absolute -bottom-4 flex items-center gap-2  bg-background px-3 py-1 text-xs ">
              <Image
                src={
                  Wallet === "Bank" ? "/bank.png" : savedSession?.walletPhoto
                }
                alt=""
                width={20}
                height={20}
              />
              <span>{shortenText(savedSession?.walletName ?? "", 15)}</span>
            </div>
          </div>

          {/* OR divider */}
          <div className="flex w-full items-center gap-3 px-6">
            <Separator className="flex-1" />
            <span className="text-base">Or</span>
            <Separator className="flex-1" />
          </div>

          {/* Amount */}
          <div className="w-[90%] space-y-2 -mt-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Amount</span>
              <CircleAlert className="h-4 w-4 " />
              <span className="text-orange-400 text-xs">
                Amount to deposit
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: user?.currency?.code || "USD",
                  ...(savedSession?.amountFiat > 9999999
                    ? { notation: "compact" }
                    : {}),
                }).format(savedSession?.amountFiat)}
              </span>
            </div>

            <div className="relative">
              <Input
                readOnly
                value={
                  savedSession?.amountCrypto &&
                  savedSession?.amountCrypto !== "NaN" &&
                  savedSession?.amountCrypto !== "Infinity"
                    ? `${Number(savedSession?.amountCrypto).toFixed(
                        8
                      )} ${savedSession?.walletSymbol.toUpperCase()}`
                    : `${savedSession?.amountFiat} ${user?.currency?.code}`
                }
                className="pr-10 py-6!"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                disabled={
                  savedSession?.amountCrypto === "NaN" ||
                  savedSession?.amountCrypto === "Infinity"
                }
                onClick={() =>
                  handleCopyAmount(
                    Number(savedSession?.amountCrypto).toFixed(8)
                  )
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Address */}
          <div className="w-[90%] space-y-2 -mt-1">
            <span className="text-sm font-medium">Address</span>

            <div className="relative">
              <Input
                readOnly
                value={shortenText(savedSession?.walletAddress ?? "", 30)}
                className="pr-10 py-6!"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => handleCopyWallet(savedSession?.walletAddress)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Confirmation note */}
          <p className="text-center text-xs text-orange-400 px-1 -my-1">
            Account will be funded after one{" "}
            {savedSession?.walletSymbol?.toUpperCase()} transaction confirmation
          </p>

          {/* Footer */}
          <div className="flex w-full justify-between items-center bg-secondary px-6 py-2 mb-3">
            <div className="text-center space-y-2">
              <p className="text-xs">Made the Deposit?</p>
              <Button size="sm" onClick={() => setOpenDepositProof(true)}>
                Click to Notify
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleCancelSession}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* ===============  proof of deposit modal   =========== */}
      <Dialog open={openDepositProof} onOpenChange={setOpenDepositProof}>
        <form>
          <DialogContent className="sm:max-w-131.25 max-h-[90%] overflow-auto p-3 sm:p-4 bg-card border border-border z-1002">
            <DialogHeader>
              <DialogTitle asChild>
                <div className="flex gap-2 justify-center items-center">
                  {<ImageIcon />}
                  <p>Proof of Deposit</p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <DepositProof
              savedSession={savedSession}
              setSelectedView={setSelectedView}
              depositFunds={depositFunds}
              isDepositingFunds={isDepositingFunds}
            />
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default MakeTheDepositNow;
