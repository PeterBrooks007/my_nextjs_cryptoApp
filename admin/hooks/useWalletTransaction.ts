import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";

export const useWalletTransaction = (id: string) => {
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
          `/walletTransactions/adminGetAllUserWalletTransactions/${id}`
        );
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch Wallet Transactions Histories", error);
        throw error;
      }
    },
    select: (res) => res?.data?.data,
  });

  // updateWalletTransactionMutation
  const updateWalletTransactionMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        userId: string;
        transactionData: {
          transactionId: string | undefined;
          typeOfTransaction: string;
          method: string | undefined;
          methodIcon: string | undefined;
          symbol: string | undefined;
          amount: number;
          walletAddress: string;
          description: string;
          status: string;
          createdAt: Date;
        };
      };
    }) => {
      return api.patch(
        `/walletTransactions/adminUpdateUserWalletTransaction/${id}`,
        formData
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["walletTransactions", id],
      });
      setOpenWalletTransactionDetails(false);

      toast("User Transaction Updated Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Transaction";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const updateWalletTransaction = (
    id: string | undefined,
    formData: {
      userId: string;
      transactionData: {
        transactionId: string | undefined;
        typeOfTransaction: string;
        method: string | undefined;
        methodIcon: string | undefined;
        symbol: string | undefined;
        amount: number;
        walletAddress: string;
        description: string;
        status: string;
        createdAt: Date;
      };
    }
  ) => {
    updateWalletTransactionMutation.mutate({ id, formData });
  };

  // deleteWalletTransactionsHistoryMutation
  const deleteWalletTransactionsHistoryMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        userId: string;
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
      userId: string;
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

    updateWalletTransaction,
    isUpdatingingWalletTransaction: updateWalletTransactionMutation.isPending,

    deleteWalletTransaction,
    isDeletingWalletTransactionsHistory:
      deleteWalletTransactionsHistoryMutation.isPending,
  };
};
