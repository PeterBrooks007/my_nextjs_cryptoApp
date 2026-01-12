import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSheetStore } from "@/store/sheetStore";
import { ExpertTraderType } from "@/types";

export const useExpertTraders = () => {
  const { setOpenAddTrader, setOpenEditTrader } = useSheetStore();
  const queryClient = useQueryClient();

  const {
    data: expertTradersData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["expertTraders"],
    queryFn: async () => {
      try {
        const response = await api.get("/expertTraders/getAllExpertTraders");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch expert traders", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // ✅ Add Expert Trader Mutation
  const addExpertTraderMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/expertTraders/addExpertTrader", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expertTraders"] });

      toast("Expert Trader added successfully");
      setOpenAddTrader(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to add expert trader";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const addExpertTrader = (formData: FormData) => {
    addExpertTraderMutation.mutate(formData);
  };

  // Update Expert Trader Mutation
  const updateExpertTraderMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string | undefined;
      userData: Omit<
        ExpertTraderType,
        "_id" | "photo" | "createdAt" | "updatedAt" | "__v"
      >;
    }) => {
      return api.patch(`/expertTraders/updateExpertTrader/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expertTraders"] });

      toast("Wallet added successfully");
      setOpenEditTrader(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to Updateallet address";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const updateExpertTrader = (
    id: string | undefined,
    userData: Omit<
      ExpertTraderType,
      "_id" | "photo" | "createdAt" | "updatedAt" | "__v"
    >
  ) => {
    updateExpertTraderMutation.mutate({ id, userData });
  };

  // Update Expert Trader Photo Mutation
  const updateExpertTraderPhotoMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: FormData;
    }) => {
      return api.post(`/expertTraders/updateExpertTraderPhoto/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expertTraders"] });
      setOpenEditTrader(false);
    },
  });

  const updateExpertTraderPhoto = (
    id: string | undefined,
    formData: FormData
  ) => {
    updateExpertTraderPhotoMutation.mutate({ id, formData });
  };

  // Delete wallet Address Mutation
  const deleteExpertTraderMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/expertTraders/deleteExpertTrader/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expertTraders"] });
      toast("Expert Trader Deleted successfully");

      setOpenEditTrader(false);
    },
  });

  const deleteExpertTrader = (id: string | undefined) => {
    deleteExpertTraderMutation.mutate(id);
  };

  return {
    allExpertTraders: expertTradersData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    addExpertTrader,
    isAddingExpertTrader: addExpertTraderMutation.isPending,
    updateExpertTrader,
    isUpdatingExpertTrader: updateExpertTraderMutation.isPending,

    updateExpertTraderPhoto,
    isUpdatingExpertTraderPhoto: updateExpertTraderPhotoMutation.isPending,

    deleteExpertTrader,
    isDeletingExpertTrader: deleteExpertTraderMutation.isPending,
  };
};
