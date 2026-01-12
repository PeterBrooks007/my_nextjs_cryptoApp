import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";
// import { depositHistoryType } from "@/types";

export const useDepositHistory = (id: string) => {
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
    queryKey: ["depositHistories", id],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/deposit/adminGetUserDeposithistory/${id}`
        );
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch deposit Histories", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // addDepositHistoryMutation
  const addDepositHistoryMutation = useMutation({
    mutationFn: async (formData: {
      status: string;
      userId: string;
      typeOfDeposit: string;
      method: string;
      methodIcon: string;
      type: string;
      amount: number;
    }) => {
      return api.post("/deposit/adminAddTradeHistoryToUser", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["depositHistories", id],
      });
      setOpenAddDepositRequest(false);

      toast("Deposit Request added successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to add Deposit Request";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const addDepositHistory = (formData: {
    status: string;
    userId: string;
    typeOfDeposit: string;
    method: string;
    methodIcon: string;
    type: string;
    amount: number;
  }) => {
    addDepositHistoryMutation.mutate(formData);
  };

  // approve Deposit Request Mutation
  const approveDepositHistoryMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string | undefined;
      userData: {
        status: string;
        comment: string;
        amount: number | undefined;
        userId: string | undefined;
        typeOfDeposit: string | undefined;
      };
    }) => {
      return api.patch(`/deposit/approveDepositRequest/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["depositHistories", id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["users", id],
      });
      setOpenDepositDetails(false);

      toast("Deposit Request Updated Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Deposit Request";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const approveDepositHistory = (
    id: string | undefined,
    userData: {
      status: string;
      comment: string;
      amount: number | undefined;
      userId: string | undefined;
      typeOfDeposit: string | undefined;
    }
  ) => {
    approveDepositHistoryMutation.mutate({ id, userData });
  };

  // Delete Trading Bot Mutation
  const deletedepositHistoryMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/deposit/deleteDepositRequest/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["depositHistories", id],
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
    addDepositHistory,
    isAddingDepositHistory: addDepositHistoryMutation.isPending,

    approveDepositHistory,
    isApprovingDepositHistory: approveDepositHistoryMutation.isPending,

    deletedepositHistory,
    isDeletingdepositHistory: deletedepositHistoryMutation.isPending,
  };
};
