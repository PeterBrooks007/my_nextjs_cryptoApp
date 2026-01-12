import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useState } from "react";

export const useWalletTransaction = (
  id: string,
  setSelectedView?: Dispatch<SetStateAction<number>>
) => {
  const [openWalletTransactionDetails, setOpenWalletTransactionDetails] =
    useState(false);

  const queryClient = useQueryClient();

  const {
    data: walletTransactionsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["walletTransactions", id],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/walletTransactions/getUserWalletTransactions`
        );
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch Wallet Transactions Histories", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // addTransaction Mutation
  const addTransactionMutation = useMutation({
    mutationFn: async ({
      formData,
    }: {
      formData: {
        userId: string | undefined;
        transactionData: {
          typeOfTransaction: string;
          method: string | undefined;
          methodIcon: string | undefined;
          symbol: string | undefined;
          amount: number;
          walletAddress: string;
          description: string;
          status: string;
          amountFiat: number;
        };
      };
    }) => {
      return api.post(`/walletTransactions/addTransaction`, formData);
    },
    onSuccess: async (response) => {
      // await handleConcludeSession?.();
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["walletTransactions", id],
      });
      setSelectedView?.(4);
      toast(response.data.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to Update deposit fund";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // addTransaction Wrapper function
  const addTransaction = (formData: {
    userId: string | undefined;
    transactionData: {
      typeOfTransaction: string;
      method: string | undefined;
      methodIcon: string | undefined;
      symbol: string | undefined;
      amount: number;
      walletAddress: string;
      description: string;
      status: string;
      amountFiat: number;
    };
  }) => {
    addTransactionMutation.mutate({ formData });
  };

  // deleteWalletTransactionsHistoryMutation
  const deleteWalletTransactionsHistoryMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        userId: string | undefined;
        transactionData: {
          transactionsId: string | undefined;
        };
      };
    }) => {
      return api.delete(`/walletTransactions/deleteTransaction/${id}`, {
        data: formData, // Pass in the request body
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["walletTransactions", id],
      });
      setOpenWalletTransactionDetails(false);
      toast("Transaction Deleted Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Deleted Transaction";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const deleteWalletTransaction = (
    id: string | undefined,
    formData: {
      userId: string | undefined;
      transactionData: {
        transactionsId: string | undefined;
      };
    }
  ) => {
    deleteWalletTransactionsHistoryMutation.mutate({ id, formData });
  };

  return {
    openWalletTransactionDetails,
    setOpenWalletTransactionDetails,

    allUserWalletTransactions: walletTransactionsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,

    addTransaction,
    isAddingTransaction: addTransactionMutation.isPending,

    deleteWalletTransaction,
    isDeletingWalletTransactionsHistory:
      deleteWalletTransactionsHistoryMutation.isPending,
  };
};
