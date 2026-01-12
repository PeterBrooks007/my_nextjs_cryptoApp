import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSheetStore } from "@/store/sheetStore";
import { TradeSettingsType } from "@/types";

export const useTradeSettings = () => {
  const { setOpenAddTradeSetting, setOpenEditTradeSetting } = useSheetStore();
  const queryClient = useQueryClient();

  const {
    data: tradingSettingsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tradingSettings"],
    queryFn: async () => {
      try {
        const response = await api.get("/tradingSettings/getAllTradingSetting");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch trading settings", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // ✅ Add Trading Settings Mutation
  const addTradeSettingMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/tradingSettings/addExchangeType", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSettings"] });

      toast("Trading Exchange added successfully");
      setOpenAddTradeSetting(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to add Trading Settings";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const addTradeSetting = (formData: FormData) => {
    addTradeSettingMutation.mutate(formData);
  };

  // Update Trading Settings Mutation
  const updateTradeSettingMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string | undefined;
      userData: Omit<
        TradeSettingsType,
        "_id" | "photo" | "createdAt" | "tradingPairs" | "updatedAt" | "__v"
      >;
    }) => {
      return api.patch(`/tradingSettings/updateTradingSetting/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSettings"] });

      toast("Trading Exchange Updated successfully");
      setOpenEditTradeSetting(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Trading Settings";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const updateTradeSetting = (
    id: string | undefined,
    userData: Omit<
      TradeSettingsType,
      "_id" | "photo" | "createdAt" | "tradingPairs" | "updatedAt" | "__v"
    >
  ) => {
    updateTradeSettingMutation.mutate({ id, userData });
  };

  // Update Trading Settings Photo Mutation
  const updateTradeSettingPhotoMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: FormData;
    }) => {
      return api.post(
        `/tradingSettings/updateTradingSettingPhoto/${id}`,
        formData
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSettings"] });
      setOpenEditTradeSetting(false);
    },
  });

  const updateTradeSettingPhoto = (
    id: string | undefined,
    formData: FormData
  ) => {
    updateTradeSettingPhotoMutation.mutate({ id, formData });
  };

  // Delete Trading Settings Mutation
  const deleteTradeSettingMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/tradingSettings/deleteTradingSettingExchange/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSettings"] });
      toast("Trading Exchange Deleted successfully");
      setOpenEditTradeSetting(false);
    },
  });

  const deleteTradeSetting = (id: string | undefined) => {
    deleteTradeSettingMutation.mutate(id);
  };

  // Delete Arrays of Exchange Mutation
  const deleteArraysOfExchangesMutation = useMutation({
    mutationFn: async (TradesExchangeIds: string[]) => {
      return api.delete(`/tradingSettings/deleteArrayOfTradingExchange`, {
        data: { TradesExchangeIds },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSettings"] });
      toast("Trading Exchanges Deleted successfully");
      setOpenEditTradeSetting(false);
    },
  });

  const deleteArrayOfExchanges = (TradesExchangeIds: string[]) => {
    deleteArraysOfExchangesMutation.mutate(TradesExchangeIds);
  };

  // Delete Arrays of Trading Pairs Mutation
  const deleteArraysOfTradingPairsMutation = useMutation({
    mutationFn: async ({
      id,
      tradingPairsArray,
    }: {
      id: string;
      tradingPairsArray: string[];
    }) => {
      return api.patch(`/tradingSettings/DeleteArrayTradingPairs/${id}`, {
        tradingPairsArray,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSettings"] });
      toast("Trading Exchanges Pairs(s) Deleted successfully");
      setOpenEditTradeSetting(false);
    },
  });

  const deleteArrayTradingPairs = (payload: {
    id: string;
    tradingPairsArray: string[];
  }) => {
    deleteArraysOfTradingPairsMutation.mutate(payload);
  };

  // Add Arrays of Trading Pairs Mutation
  const addArraysOfTradingPairsMutation = useMutation({
    mutationFn: async ({
      id,
      tradingPairsArray,
    }: {
      id: string | undefined;
      tradingPairsArray: string[];
    }) => {
      return api.patch(`/tradingSettings/addTradingPairs/${id}`, {
        tradingPairsArray,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSettings"] });
      toast("Trading Exchanges Pairs(s) Added successfully");
      setOpenEditTradeSetting(false);
    },
  });

  const addArrayOfTradingPairs = (payload: {
    id: string | undefined;
    tradingPairsArray: string[];
  }) => {
    addArraysOfTradingPairsMutation.mutate(payload);
  };

  return {
    allTradeSettings: tradingSettingsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    addTradeSetting,
    isAddingTradeSetting: addTradeSettingMutation.isPending,
    updateTradeSetting,
    isUpdatingTradeSetting: updateTradeSettingMutation.isPending,

    updateTradeSettingPhoto,
    isUpdatingTradeSettingPhoto: updateTradeSettingPhotoMutation.isPending,

    deleteTradeSetting,
    isDeletingTradeSetting: deleteTradeSettingMutation.isPending,

    deleteArrayOfExchanges,
    isDeletingArrayOfExchanges: deleteArraysOfExchangesMutation.isPending,

    deleteArrayTradingPairs,
    isDeletingArrayTradingPairs: deleteArraysOfTradingPairsMutation.isPending,

    addArrayOfTradingPairs,
    isAddingArrayTradingPairs: addArraysOfTradingPairsMutation.isPending,
  };
};
