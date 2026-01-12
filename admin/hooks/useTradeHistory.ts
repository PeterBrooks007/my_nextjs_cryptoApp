import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  AutoTradeUpdateInAdminPayloadType,
  UpdateTradeHistoryPayload,
} from "@/types";

export const useTradeHistory = (id: string) => {
  // const [openTradeHistoryDetails, setOpenTradeHistoryDetails] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: tradeHistoryData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tradeHistories", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/trades/adminGetAllUserTrades/${id}`);
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch Trade Histories", error);
        throw error;
      }
    },
    select: (res) => res?.data?.data,
  });

  // updateTradeHistoryMutation
  const updateTradeHistoryMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: UpdateTradeHistoryPayload;
    }) => {
      return api.patch(`/trades/adminUpdateUserTrade/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tradeHistories", id],
      });
      // setOpenTradeHistoryDetails(false);

      toast("User Trade Updated Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Trade";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const updateTradeHistory = (
    id: string | undefined,
    formData: UpdateTradeHistoryPayload
  ) => {
    updateTradeHistoryMutation.mutate({ id, formData });
  };

  // adminApproveUserTradeMutation
  const adminApproveUserTradeMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: UpdateTradeHistoryPayload;
    }) => {
      return api.patch(`/trades/adminApproveUserTrade/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tradeHistories", id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["users", id],
      });
      // setOpenTradeHistoryDetails(false);

      toast("User Trade Approved Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Approve Trade";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const adminApproveUserTrade = (
    id: string | undefined,
    formData: UpdateTradeHistoryPayload
  ) => {
    adminApproveUserTradeMutation.mutate({ id, formData });
  };

  // autoTradeUpdateInAdminMutation
  const autoTradeUpdateInAdminMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: AutoTradeUpdateInAdminPayloadType;
    }) => {
      return api.patch(`/trades/adminApproveUserTrade/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tradeHistories", id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["users", id],
      });
      // setOpenTradeHistoryDetails(false);

      // toast("User Transaction Updated Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Trade";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const autoTradeUpdateInAdmin = (
    id: string | undefined,
    formData: AutoTradeUpdateInAdminPayloadType
  ) => {
    autoTradeUpdateInAdminMutation.mutate({ id, formData });
  };

  // cancelTradeHistorysHistoryMutation
  const cancelTradeHistorysHistoryMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        userId: string;
        tradeData: {
          tradeId: string | undefined;
          tradeAmount: number | undefined;
          tradingMode: string | undefined;
        };
      };
    }) => {
      return api.delete(`/trades/cancelTrade/${id}`, {
        data: formData, // Pass in the request body
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tradeHistories", id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["users", id],
      });
      toast("Trade history Canceled Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Canceled Trade history";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const cancelTradeHistory = (
    id: string | undefined,
    formData: {
      userId: string;
      tradeData: {
        tradeId: string | undefined;
        tradeAmount: number | undefined;
        tradingMode: string | undefined;
      };
    }
  ) => {
    cancelTradeHistorysHistoryMutation.mutate({ id, formData });
  };

  // deleteTradeHistorysHistoryMutation
  const deleteTradeHistorysHistoryMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        userId: string;
        tradeData: {
          tradeId: string | undefined;
        };
      };
    }) => {
      return api.delete(`/trades/deleteTrade/${id}`, {
        data: formData, // Pass in the request body
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tradeHistories", id],
      });
      toast("Trade history Deleted Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Deleted Trade history";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const deleteTradeHistory = (
    id: string | undefined,
    formData: {
      userId: string;
      tradeData: {
        tradeId: string | undefined;
      };
    }
  ) => {
    deleteTradeHistorysHistoryMutation.mutate({ id, formData });
  };

  return {
    // openTradeHistoryDetails,
    // setOpenTradeHistoryDetails,

    allUserTradeHistories: tradeHistoryData || [],
    isLoading,
    error,
    refetch,
    isRefetching,

    updateTradeHistory,
    isUpdatingingTradeHistory: updateTradeHistoryMutation.isPending,

    adminApproveUserTrade,
    isAdminApprovingUserTrade: adminApproveUserTradeMutation.isPending,

    autoTradeUpdateInAdmin,
    isAutoTradeUpdateInAdminLoading: autoTradeUpdateInAdminMutation.isPending,

    cancelTradeHistory,
    isCancelingTradeHistory: cancelTradeHistorysHistoryMutation.isPending,

    deleteTradeHistory,
    isDeletingTradeHistorysHistory:
      deleteTradeHistorysHistoryMutation.isPending,
  };
};
