import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSheetStore } from "@/store/sheetStore";

export const useWithdrawalRequest = () => {
  const { setOpenEditWithdrawalRequest } = useSheetStore();
  const queryClient = useQueryClient();

  const {
    data: withdrawalRequestsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["withdrawalRequests"],
    queryFn: async () => {
      try {
        const response = await api.get(
          "/withdrawal/getAllPendingWithdrawalRequest"
        );
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch withdrawal requests", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // approve Withdrawal Request Mutation
  const approveWithdrawalRequestMutation = useMutation({
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
      await queryClient.invalidateQueries({ queryKey: ["withdrawalRequests"] });

      toast("Withdrawal Request Updated Successfully");
      setOpenEditWithdrawalRequest(false);
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
  const approveWithdrawalRequest = (
    id: string | undefined,
    userData: {
      status: string | undefined;
      amount: number | undefined;
      userId: string | undefined;
      typeOfWithdrawal: string | undefined;
    }
  ) => {
    approveWithdrawalRequestMutation.mutate({ id, userData });
  };

  // Delete WithdrawalRequest Mutation
  const deleteWithdrawalRequestMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/withdrawal/deleteWithdrawalRequest/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["withdrawalRequests"] });
      toast("Withdrawal Request Deleted successfully");

      setOpenEditWithdrawalRequest(false);
    },
  });

  const deleteWithdrawalRequest = (id: string | undefined) => {
    deleteWithdrawalRequestMutation.mutate(id);
  };

  return {
    allWithdrawalRequests: withdrawalRequestsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,

    approveWithdrawalRequest,
    isApprovingWithdrawalRequest: approveWithdrawalRequestMutation.isPending,

    deleteWithdrawalRequest,
    isDeletingWithdrawalRequest: deleteWithdrawalRequestMutation.isPending,
  };
};
