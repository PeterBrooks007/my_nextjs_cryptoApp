import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import Image from "next/image";
import { ArrowDown, ArrowUp, SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import {
  CoinpaprikaCoin,
  CombinedAssetsTransactionType,
  WalletTransactionType,
} from "@/types";
import { useWalletTransaction } from "@/hooks/useWalletTransaction";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { Skeleton } from "./ui/skeleton";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import WalletTransactionDetails from "./WalletTransactionDetails";
import { useCurrentUser } from "@/hooks/useAuth";

const WalletTransactions = ({
  transactionNumber,
}: {
  transactionNumber?: string;
}) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const { data: user } = useCurrentUser();
  const id = user?._id as string;

  const {
    openWalletTransactionDetails,
    setOpenWalletTransactionDetails,

    allUserWalletTransactions,
    isLoading,
    error,
    refetch,
    isRefetching,

    deleteWalletTransaction,
    isDeletingWalletTransactionsHistory,
  } = useWalletTransaction(id);

  const { allCoins, isLoading: coinPriceLoading } = useCoinpaprika(
    user?.currency?.code
  );

  const [selectedTransaction, setSelectedTransaction] =
    useState<CombinedAssetsTransactionType | null>(null);

  let allTransactionsSlice;

  // console.log(allUserWalletTransactions);

  if (transactionNumber === "All") {
    allTransactionsSlice =
      Array.isArray(allUserWalletTransactions) &&
      allUserWalletTransactions[0]?.transactions
        ? allUserWalletTransactions[0].transactions
            .filter(
              (transaction: WalletTransactionType) =>
                transaction && transaction?.createdAt
            ) // Ensure transaction and createdAt exist
            .sort(
              (a: WalletTransactionType, b: WalletTransactionType) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            ) // Sort by createdAt, newest first
            .slice() // Take the first 6 transactions
        : [];
  } else {
    allTransactionsSlice =
      Array.isArray(allUserWalletTransactions) &&
      allUserWalletTransactions[0]?.transactions
        ? allUserWalletTransactions[0].transactions
            .filter(
              (transaction: WalletTransactionType) =>
                transaction && transaction?.createdAt
            ) // Ensure transaction and createdAt exist
            .sort(
              (a: WalletTransactionType, b: WalletTransactionType) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            ) // Sort by createdAt, newest first
            .slice(0, 5) // Take the first 6 transactions
        : [];
  }

  const combinedAssets = allTransactionsSlice?.map(
    (asset: WalletTransactionType) => {
      const priceData = allCoins?.find(
        (price: CoinpaprikaCoin) =>
          price?.symbol === asset?.symbol?.toUpperCase()
      );

      if (priceData) {
        const totalValue =
          asset.amount * priceData?.quotes?.[user?.currency?.code ?? ""]?.price;
        return {
          ...asset,
          price: priceData?.quotes?.[user?.currency?.code ?? ""]?.price,
          totalValue,
        };
      }
      return { ...asset, price: 0, totalValue: 0 };
    }
  );

  //start of search Transaction
  const [allTransactionList, setTransactionList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllMailInbox = Array.isArray(allTransactionList)
    ? combinedAssets.filter(
        (transaction: CombinedAssetsTransactionType) =>
          transaction?.method
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          transaction?.symbol
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(transaction?.amount)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    setTimeout(() => {
      if (allTransactionList.length !== 0) {
        setTransactionList(allTransactionList);
      }
    }, 0);
  }, [allTransactionList]);
  //end of search Transaction

  if (error) {
    return (
      <p>
        Error fetching data, retry{" "}
        <Button disabled={isRefetching} onClick={() => refetch()}>
          {isRefetching && <Spinner />}
          retry
        </Button>
      </p>
    );
  }

  if (pageLoading || isLoading || isDeletingWalletTransactionsHistory) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 ">
      <InputGroup className="rounded-full">
        <InputGroupInput
          placeholder="Search Transaction"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <div className="space-y-5">
        {allTransactionsSlice &&
          allTransactionsSlice.length > 0 &&
          filteredAllMailInbox.map(
            (walletTransaction: CombinedAssetsTransactionType) => (
              <div
                key={walletTransaction?._id}
                className="w-full flex flex-col gap-1  cursor-pointer rounded-xl  transition"
                onClick={() => {
                  setSelectedTransaction(walletTransaction);
                  setOpenWalletTransactionDetails(true);
                }}
              >
                <div className="flex justify-between">
                  <div className="flex flex-row items-center gap-3">
                    <div className="bg-gray-300/50 dark:bg-gray-500/30 relative flex justify-center items-center size-11 border rounded-md">
                      {walletTransaction?.typeOfTransaction.toLowerCase() ===
                      "sent" ? (
                        <ArrowUp className="size-6" />
                      ) : (
                        <ArrowDown className="size-6" />
                      )}

                      <div className="absolute -right-1 -bottom-1 border-0">
                        <Image
                          src={
                            walletTransaction?.method === "Bank"
                              ? "/bank.png"
                              : walletTransaction?.methodIcon
                          }
                          alt={walletTransaction?.method}
                          width={50}
                          height={50}
                          sizes="(max-width: 640px) 32px, (max-width: 1024px) 32px, 32px" 
                          className="rounded-lg bg-white size-4"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-sm font-medium truncate">
                        {walletTransaction?.typeOfTransaction +
                          " " +
                          walletTransaction?.symbol.toUpperCase()}
                      </p>
                      <p className="text-sm truncate">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(walletTransaction?.createdAt))}
                      </p>
                    </div>
                  </div>

                  <div className="ml-auto flex flex-col items-end text-right">
                    <div className="text-base font-semibold">
                      {user?.isManualAssetMode === false ? (
                        coinPriceLoading ? (
                          <Skeleton className="w-26 h-5 bg-gray-500" />
                        ) : (
                          Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(walletTransaction?.amount > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(
                            walletTransaction?.amount * walletTransaction?.price
                          )
                        )
                      ) : (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(walletTransaction?.amount > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(walletTransaction?.amount)
                      )}
                    </div>

                    <p className="text-sm  truncate">
                      {user?.isManualAssetMode === false &&
                        Number(walletTransaction?.amount).toFixed(8) +
                          " " +
                          walletTransaction?.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
      </div>

      {/* VIEW DEPOSIT DETAILS */}
      <Dialog
        open={openWalletTransactionDetails}
        onOpenChange={setOpenWalletTransactionDetails}
      >
        <form>
          <DialogContent className="sm:max-w-131.25 max-h-[90%] overflow-auto p-3 sm:p-4 bg-secondary">
            <DialogHeader>
              <DialogTitle asChild>
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      selectedTransaction?.method === "Bank"
                        ? "/bank.png"
                        : selectedTransaction?.methodIcon ||
                          "/qrCode_placeholder.jpg"
                    }
                    alt={selectedTransaction?.method || "image"}
                    width={40}
                    height={40}
                    className="size-9 rounded-lg bg-white p-0.5"
                  />
                  <p className="font-bold">
                    {selectedTransaction?.method} Withdrawal
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <WalletTransactionDetails
              selectedTransaction={selectedTransaction}
              deleteWalletTransaction={deleteWalletTransaction}
            />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default WalletTransactions;
