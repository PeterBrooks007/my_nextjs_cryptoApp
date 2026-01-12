import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { ArrowDown, ArrowUp, RefreshCw, SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
  CoinpaprikaCoin,
  CombinedAssetsTransactionType,
  WalletTransactionType,
} from "@/types";
import { useWalletTransaction } from "@/hooks/useWalletTransaction";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { Skeleton } from "../ui/skeleton";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import WalletTransactionDetails from "../WalletTransactionDetails";

const WalletTransactions = () => {
  // this transactionNumber to be use in client folder for view 5result and view all
  const transactionNumber = "All";

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);

  const {
    openWalletTransactionDetails,
    setOpenWalletTransactionDetails,

    allUserWalletTransactions,
    isLoading,
    error,
    refetch,
    isRefetching,

    updateWalletTransaction,
    isUpdatingingWalletTransaction,

    deleteWalletTransaction,
    isDeletingWalletTransactionsHistory,
  } = useWalletTransaction(id);

  const { allCoins, isLoading: coinPriceLoading } = useCoinpaprika(
    singleUser?.currency?.code,
    id
  );

  const [selectedTransaction, setSelectedTransaction] =
    useState<CombinedAssetsTransactionType | null>(null);

  let allTransactionsSlice;

  // console.log(allUserWalletTransactions[0]?.transactions);

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
          asset.amount * priceData?.quotes?.[singleUser?.currency?.code]?.price;
        return {
          ...asset,
          price: priceData?.quotes?.[singleUser?.currency?.code]?.price,
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

  if (
    pageLoading ||
    isLoading ||
    isUpdatingingWalletTransaction ||
    isDeletingWalletTransactionsHistory
  ) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-4">
      <Card className="p-3 gap-2">
        <div className="flex justify-between  gap-3">
          <Button
            className="flex-1"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? <Spinner /> : <RefreshCw />} Refresh Transaction
          </Button>
          {/* <Button
            className="flex-1 bg-orange-500"
            onClick={() => setOpenAddWalletTransaction(true)}
          >
            <CirclePlus /> Add History
          </Button> */}
        </div>
      </Card>

      <Card className="py-3 mt-3">
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

      <Card className="py-3 mt-3">
        <CardContent className="grid gap-5 px-3">
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

          <div className="space-y-3">
            {allTransactionsSlice &&
              allTransactionsSlice.length > 0 &&
              filteredAllMailInbox.map(
                (walletTransaction: CombinedAssetsTransactionType) => (
                  <div
                    key={walletTransaction?._id}
                    className="w-full bg-secondary flex flex-col gap-1  cursor-pointer rounded-xl border p-2.5 transition"
                    onClick={() => {
                      setSelectedTransaction(walletTransaction);
                      setOpenWalletTransactionDetails(true);
                    }}
                  >
                    <div className="flex justify-between">
                      <div className="flex flex-row items-center gap-3">
                        <div className="bg-gray-300/50 dark:bg-gray-500/30 relative flex justify-center items-center size-12 border rounded-md">
                          {walletTransaction?.typeOfTransaction.toLowerCase() ===
                          "sent" ? (
                            <ArrowUp className="size-7" />
                          ) : (
                            <ArrowDown className="size-7" />
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
                          <p className="text-sm xs:text-base truncate">
                            {new Intl.DateTimeFormat("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(walletTransaction?.createdAt))}
                          </p>
                        </div>
                      </div>

                      <div className="ml-auto flex flex-col items-end text-right">
                        <div className="text-base sm:text-xl font-semibold">
                          {singleUser?.isManualAssetMode === false ? (
                            coinPriceLoading ? (
                              <Skeleton className="w-26 h-5 bg-gray-500" />
                            ) : (
                              Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: singleUser?.currency?.code,
                                ...(walletTransaction?.amount > 999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(
                                walletTransaction?.amount *
                                  walletTransaction?.price
                              )
                            )
                          ) : (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: singleUser?.currency?.code,
                              ...(walletTransaction?.amount > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(walletTransaction?.amount)
                          )}
                        </div>

                        <p className="text-sm xs:text-base truncate">
                          {singleUser?.isManualAssetMode === false &&
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
        </CardContent>
      </Card>

      {/* VIEW DEPOSIT DETAILS */}
      <Dialog
        open={openWalletTransactionDetails}
        onOpenChange={setOpenWalletTransactionDetails}
      >
        <form>
          <DialogContent className="sm:max-w-[525px] max-h-[90%] overflow-auto p-3 sm:p-4 bg-secondary">
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
              updateWalletTransaction={updateWalletTransaction}
              deleteWalletTransaction={deleteWalletTransaction}
            />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default WalletTransactions;
