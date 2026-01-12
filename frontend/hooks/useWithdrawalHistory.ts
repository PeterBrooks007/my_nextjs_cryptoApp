import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useState } from "react";
import { AxiosError } from "axios";

export const useWithdrawalHistory = (
  setSelectedView?: Dispatch<SetStateAction<number>>
) => {
  const [openWithdrawalDetails, setOpenWithdrawalDetails] = useState(false);
  const [openAddWithdrawalRequest, setOpenAddWithdrawalRequest] =
    useState(false);

  const queryClient = useQueryClient();

  const {
    data: withdrawalHistoriesData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["withdrawalHistories"],
    queryFn: async () => {
      try {
        const response = await api.get(`/withdrawal/getUserWithdrawalhistory`);
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch withdrawal Histories", error);
        throw error;
      }
    },
    select: (res) => res?.data,
    staleTime: 5 * 60 * 1000, // fresh for 5 mins
    gcTime: 10 * 60 * 1000, // cache survives longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Withdraw Funds Mutation
  const withdrawFundsMutation = useMutation({
    mutationFn: async ({
      formData,
    }: {
      formData: {
        walletAddress: string;
        bankName: string;
        bankAccount: string;
        routingCode: string;
        amount: string;
        description: string;
        method: string;
        methodIcon: string;
        typeOfWithdrawal: string;
      };
    }) => {
      return api.post(`/withdrawal/withdrawFund`, formData);
    },
    onSuccess: async (response) => {
      // await handleConcludeSession?.();
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["withdrawalHistories"],
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

  // withdrawFund Wrapper function
  const withdrawFund = (formData: {
    walletAddress: string;
    bankName: string;
    bankAccount: string;
    routingCode: string;
    amount: string;
    description: string;
    method: string;
    methodIcon: string;
    typeOfWithdrawal: string;
  }) => {
    withdrawFundsMutation.mutate({ formData });
  };

  // Delete Withdrwal History Mutation
  const deletewithdrawalHistoryMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/withdrawal/deleteWithdrawalRequest/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["withdrawalHistories"],
      });
      setOpenWithdrawalDetails(false);
      toast("Withdrawal Request Deleted Successfully");
    },
  });

  const deleteWithdrawalHistory = (id: string | undefined) => {
    deletewithdrawalHistoryMutation.mutate(id);
  };

  return {
    openWithdrawalDetails,
    setOpenWithdrawalDetails,

    openAddWithdrawalRequest,
    setOpenAddWithdrawalRequest,

    allUserWithdrawalHistories: withdrawalHistoriesData || [],
    isLoading,
    error,
    refetch,
    isRefetching,

    withdrawFund,
    isWithdrawingFund: withdrawFundsMutation.isPending,

    deleteWithdrawalHistory,
    isDeletingwithdrawalHistory: deletewithdrawalHistoryMutation.isPending,
  };
};
