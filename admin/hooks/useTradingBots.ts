import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSheetStore } from "@/store/sheetStore";
import { TradingBotType } from "@/types";

export const useTradingBots = () => {
  const { setOpenAddBot, setOpenEditBot } = useSheetStore();
  const queryClient = useQueryClient();

  const {
    data: tradingBotsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tradingBots"],
    queryFn: async () => {
      try {
        const response = await api.get("/tradingBots/getAllTradingBots");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch trading bots", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // ✅ Add Trading Bot Mutation
  const addTradingBotMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/tradingBots/addTradingBot", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingBots"] });

      toast("Trading Bot added successfully");
      setOpenAddBot(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to add trading bot";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const addTradingBot = (formData: FormData) => {
    addTradingBotMutation.mutate(formData);
  };

  // Update Trading Bot Mutation
  const updateTradingBotMutation = useMutation({
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
      return api.patch(`/tradingBots/updateTradingBot/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingBots"] });

      toast("Bot Updated successfully");
      setOpenEditBot(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Trading Bot";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const updateTradingBot = (
    id: string | undefined,
    userData: Omit<
      TradingBotType,
      "_id" | "photo" | "createdAt" | "updatedAt" | "__v"
    >
  ) => {
    updateTradingBotMutation.mutate({ id, userData });
  };

  // Update Trading Bot Photo Mutation
  const updateTradingBotPhotoMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: FormData;
    }) => {
      return api.post(`/tradingBots/updateTradingBotPhoto/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingBots"] });
      setOpenEditBot(false);
    },
  });

  const updateTradingBotPhoto = (
    id: string | undefined,
    formData: FormData
  ) => {
    updateTradingBotPhotoMutation.mutate({ id, formData });
  };

  // Delete Trading Bot Mutation
  const deleteTradingBotMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/tradingBots/deleteTradingBot/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tradingBots"] });
      toast("Trading Bot Deleted successfully");

      setOpenEditBot(false);
    },
  });

  const deleteTradingBot = (id: string | undefined) => {
    deleteTradingBotMutation.mutate(id);
  };

  return {
    allTradingBots: tradingBotsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    addTradingBot,
    isAddingTradingBot: addTradingBotMutation.isPending,
    updateTradingBot,
    isUpdatingTradingBot: updateTradingBotMutation.isPending,

    updateTradingBotPhoto,
    isUpdatingTradingBotPhoto: updateTradingBotPhotoMutation.isPending,

    deleteTradingBot,
    isDeletingTradingBot: deleteTradingBotMutation.isPending,
  };
};
