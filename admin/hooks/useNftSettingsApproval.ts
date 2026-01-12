import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

// useAllNfts hook
export const useAllNfts = () => {
  const {
    data: allNftsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["allNfts"],
    queryFn: async () => {
      try {
        const response = await api.get("/nftSettings/getAllNfts");
        // console.log("response",response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch all Nfts", error);
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
    allNfts: allNftsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};

// useUserNfts hook
export const useUserNfts = (email: string) => {
  const {
    data: allNftsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["allNfts", email],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/nftSettings/admingetUserNfts/${email}`
        );
        // console.log("response",response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch all user Nfts", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  return {
    allUserNfts: allNftsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};

// useAdminAddNftToUser
export const useAdminAddNftToUser = (email: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: {
      nftID: string | undefined;
      UserId: string;
    }) => {
      return api.patch("/nftSettings/adminAddNftToUser", formData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["allNfts", email] });

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

// useAdminRemoveUserNft
export const useAdminRemoveUserNft = (email: string) => {
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
      return api.patch(`/nftSettings/adminRemoveUserNft/${id}`, formData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["allNfts", email] });

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
