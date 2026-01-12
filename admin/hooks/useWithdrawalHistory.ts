import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";

export const useWithdrawalHistory = (id: string) => {
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
    queryKey: ["withdrawalHistories", id],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/withdrawal/adminGetUserWithdrawalhistory/${id}`
        );
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch withdrawal Histories", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // approve Withdrawal Request Mutation
  const approveWithdrawalHistoryMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string | undefined;
      userData: {
        status: string | undefined;
        amount: number | undefined;
        userId: string | undefined;
        typeOfWithdrawal: string | undefined;
      };
    }) => {
      return api.patch(`/withdrawal/approveWithdrawalRequest/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["withdrawalHistories", id],
      });
      setOpenWithdrawalDetails(false);

      toast("Withdrawal Request Updated Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Withdrawal Request";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const approveWithdrawalHistory = (
    id: string | undefined,
    userData: {
      status: string | undefined;
      amount: number | undefined;
      userId: string | undefined;
      typeOfWithdrawal: string | undefined;
    }
  ) => {
    approveWithdrawalHistoryMutation.mutate({ id, userData });
  };

  // Delete Withdrwal History Mutation
  const deletewithdrawalHistoryMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/withdrawal/deleteWithdrawalRequest/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["withdrawalHistories", id],
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

    approveWithdrawalHistory,
    isApprovingWithdrawalHistory: approveWithdrawalHistoryMutation.isPending,

    deleteWithdrawalHistory,
    isDeletingwithdrawalHistory: deletewithdrawalHistoryMutation.isPending,
  };
};
