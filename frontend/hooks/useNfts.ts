import { useMutation, useQuery } from "@tanstack/react-query";
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
export const useUserNfts = (email: string | undefined) => {
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
        const response = await api.get(`/nftSettings/getMyNfts`);
        // console.log("response",response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch all  Nfts", error);
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

export const useReSellNft = (
  setOpenSellNft: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return useMutation({
    mutationFn: async (payload: {
      id: string;
      formData: {
        email?: string;
        nftName: string;
        nftPrice: string;
        sellingPrice: string;
      };
    }) => {
      const { id, formData } = payload;
      return api.patch(`/nftSettings/userReSellNft/${id}`, formData);
    },
    onSuccess: () => {
      setOpenSellNft(false);
      toast.success("Message Sent Successfully, you will be notify shortly");
    },
    onError: (error: unknown) => {
      let message = "Failed to send request";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};
