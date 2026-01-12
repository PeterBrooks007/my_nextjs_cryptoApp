import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { AxiosError } from "axios";
// import { depositHistoryType } from "@/types";

export const useDepositHistory = (handleConcludeSession?: () => void) => {
  const [openDepositDetails, setOpenDepositDetails] = useState(false);
  const [openAddDepositRequest, setOpenAddDepositRequest] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: depositHistoriesData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["depositHistories"],
    queryFn: async () => {
      try {
        const response = await api.get(`/deposit/getUserDeposithistory`);
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch deposit Histories", error);
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

  // Deposit Funds Mutation
  const depositFundsMutation = useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      return api.post(`/deposit/depositFund`, formData);
    },
    onSuccess: async (response) => {
      await handleConcludeSession?.();
      await queryClient.invalidateQueries({ queryKey: ["depositHistories"] });
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

  // depositFunds Wrapper function
  const depositFunds = (formData: FormData) => {
    depositFundsMutation.mutate({ formData });
  };

  // requestDepositDetails Mutation
  const requestDepositDetailsMutation = useMutation({
    mutationFn: async ({
      formData,
    }: {
      formData: {
        amount: number;
        method: string;
      };
    }) => {
      return api.post(`/deposit/requestDepositDetails`, formData);
    },
    onSuccess: async (response) => {
      console.log(response);
      toast(response.data.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to update request deposit details";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // requestDepositDetails Wrapper function
  const requestDepositDetails = (formData: {
    amount: number;
    method: string;
  }) => {
    requestDepositDetailsMutation.mutate({ formData });
  };

  // Delete Trading Bot Mutation
  const deletedepositHistoryMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/deposit/deleteDepositRequest/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["depositHistories"],
      });
      setOpenDepositDetails(false);
      toast("Deposit Request Deleted Successfully");
    },
  });

  const deletedepositHistory = (id: string | undefined) => {
    deletedepositHistoryMutation.mutate(id);
  };

  return {
    openDepositDetails,
    setOpenDepositDetails,

    openAddDepositRequest,
    setOpenAddDepositRequest,

    allUserDepositHistories: depositHistoriesData || [],
    isLoading,
    error,
    refetch,
    isRefetching,

    depositFunds,
    isDepositingFunds: depositFundsMutation.isPending,

    requestDepositDetails,
    isRequestingDepositDetails: requestDepositDetailsMutation.isPending,

    deletedepositHistory,
    isDeletingdepositHistory: deletedepositHistoryMutation.isPending,
  };
};
