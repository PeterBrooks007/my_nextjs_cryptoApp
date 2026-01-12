import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSheetStore } from "@/store/sheetStore";
import { TradingBotType } from "@/types";

export const useTradingSignals = () => {
  const { setOpenAddSignal, setOpenEditSignal } = useSheetStore();
  const queryClient = useQueryClient();

  const {
    data: tradingSignalsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tradingSignals"],
    queryFn: async () => {
      try {
        const response = await api.get("/tradingSignals/getAllTradingSignals");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch trading Signals", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // ✅ Add Trading Signal Mutation
  const addTradingSignalMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/tradingSignals/addTradingSignal", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSignals"] });

      toast("Trading Signal added successfully");
      setOpenAddSignal(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to add trading Signal";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const addTradingSignal = (formData: FormData) => {
    addTradingSignalMutation.mutate(formData);
  };

  // Update Trading Signal Mutation
  const updateTradingSignalMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string | undefined;
      userData: Omit<
        TradingBotType,
        "_id" | "photo" | "createdAt" | "updatedAt" | "__v"
      >;
    }) => {
      return api.patch(`/tradingSignals/updateTradingSignal/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSignals"] });

      toast("Signal Updated successfully");
      setOpenEditSignal(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Trading Signal";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const updateTradingSignal = (
    id: string | undefined,
    userData: Omit<
      TradingBotType,
      "_id" | "photo" | "createdAt" | "updatedAt" | "__v"
    >
  ) => {
    updateTradingSignalMutation.mutate({ id, userData });
  };

  // Update Trading Signal Photo Mutation
  const updateTradingSignalPhotoMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: FormData;
    }) => {
      return api.post(
        `/tradingSignals/updateTradingSignalPhoto/${id}`,
        formData
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSignals"] });
      setOpenEditSignal(false);
    },
  });

  const updateTradingSignalPhoto = (
    id: string | undefined,
    formData: FormData
  ) => {
    updateTradingSignalPhotoMutation.mutate({ id, formData });
  };

  // Delete Trading Signal Mutation
  const deleteTradingSignalMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/tradingSignals/deleteTradingSignal/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingSignals"] });
      toast("Trading Signal Deleted successfully");
      setOpenEditSignal(false);
    },
  });

  const deleteTradingSignal = (id: string | undefined) => {
    deleteTradingSignalMutation.mutate(id);
  };

  return {
    allTradingSignals: tradingSignalsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    addTradingSignal,
    isAddingTradingSignal: addTradingSignalMutation.isPending,
    updateTradingSignal,
    isUpdatingTradingSignal: updateTradingSignalMutation.isPending,

    updateTradingSignalPhoto,
    isUpdatingTradingSignalPhoto: updateTradingSignalPhotoMutation.isPending,

    deleteTradingSignal,
    isDeletingTradingSignal: deleteTradingSignalMutation.isPending,
  };
};
