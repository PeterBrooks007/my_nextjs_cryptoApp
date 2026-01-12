import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

// useAllExpertTraders hook
export const useAllExpertTraders = () => {
  const {
    data: allExpertTradersData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["allExpertTraders"],
    queryFn: async () => {
      try {
        const response = await api.get("/expertTraders/getAllExpertTraders");
        // console.log("response",response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch all Expert trader", error);
        throw error;
      }
    },
    select: (res) => res?.data,
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes (prevents refetch)
    gcTime: 1000 * 60 * 10, // keep alive for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    allExpertTraders: allExpertTradersData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};

// useUserExpertTraders hook
export const useUserExpertTraders = (email: string) => {
  const {
    data: allExperTraderData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["allExpertTraders", email],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/expertTraders/admingetUserExpertTrader/${email}`
        );
        // console.log("response",response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch all user Expert traders", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  return {
    allUserExpertTraders: allExperTraderData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};

// useAdminAddTraderToUser
export const useAdminAddTraderToUser = (email: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: {
      expertTraderID: string | undefined;
      UserId: string;
    }) => {
      return api.patch("/expertTraders/adminAddExpertTraderToUser", formData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["allExpertTraders", email],
      });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to Add Trader ";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

// useAdminRemoveUserExpertTrader
export const useAdminRemoveUserExpertTrader = (email: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        email: string;
      };
    }) => {
      return api.patch(
        `/expertTraders/adminRemoveUserExpertTraderCopied/${id}`,
        formData
      );
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["allExpertTraders", email],
      });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to Add Nft ";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};
