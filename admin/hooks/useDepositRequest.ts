import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSheetStore } from "@/store/sheetStore";

export const useDepositRequest = () => {
  const { setOpenEditDepositRequest } = useSheetStore();
  const queryClient = useQueryClient();

  const {
    data: depositRequestsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["depositRequests"],
    queryFn: async () => {
      try {
        const response = await api.get("/deposit/getAllPendingDepositRequest");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch deposit requests", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // approve Deposit Request Mutation
  const approveDepositRequestMutation = useMutation({
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
      await queryClient.invalidateQueries({ queryKey: ["depositRequests"] });

      toast("Deposit Request Updated Successfully");
      setOpenEditDepositRequest(false);
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
  const approveDepositRequest = (
    id: string | undefined,
    userData: {
      status: string;
      comment: string;
      amount: number | undefined;
      userId: string | undefined;
      typeOfDeposit: string | undefined;
    }
  ) => {
    approveDepositRequestMutation.mutate({ id, userData });
  };

  // Delete DepositRequest Mutation
  const deleteDepositRequestMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/deposit/deleteDepositRequest/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["depositRequests"] });
      toast("Deposit Request Deleted successfully");

      setOpenEditDepositRequest(false);
    },
  });

  const deleteDepositRequest = (id: string | undefined) => {
    deleteDepositRequestMutation.mutate(id);
  };

  return {
    allDepositRequests: depositRequestsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,

    approveDepositRequest,
    isApprovingDepositRequest: approveDepositRequestMutation.isPending,

    deleteDepositRequest,
    isDeletingDepositRequest: deleteDepositRequestMutation.isPending,
  };
};
