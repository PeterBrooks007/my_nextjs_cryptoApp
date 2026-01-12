import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSheetStore } from "@/store/sheetStore";
import { WalletAddressType } from "@/types";

export const useWalletAddress = () => {
  const { setOpenAddWallet, setOpenEditWallet } = useSheetStore();
  const queryClient = useQueryClient();

  const {
    data: walletAddressData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["walletAddress"],
    queryFn: async () => {
      try {
        const response = await api.get("/walletAddress/getAllWalletAddress");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch walletAddress", error);
        throw error;
      }
    },
    select: (res) => res?.data,
    staleTime: Infinity, // fresh for 5 mins
    gcTime: Infinity, // cache survives longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // ✅ Add Wallet Address Mutation
  const addWalletAddressMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/walletAddress/addWalletAddress", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["walletAddress"] });

      toast("Wallet added successfully");
      setOpenAddWallet(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to add wallet address";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const addWalletAddress = (formData: FormData) => {
    addWalletAddressMutation.mutate(formData);
  };

  // Update wallet Address Mutation
  const updateWalletAddressMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string | undefined;
      userData: Pick<
        WalletAddressType,
        "walletName" | "walletSymbol" | "walletAddress"
      >;
    }) => {
      return api.patch(`/walletAddress/updateWalletAddress/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["walletAddress"] });

      toast("Wallet added successfully");
      setOpenEditWallet(false);
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
  const updateWalletAddress = (
    id: string | undefined,
    userData: Pick<
      WalletAddressType,
      "walletName" | "walletSymbol" | "walletAddress"
    >
  ) => {
    updateWalletAddressMutation.mutate({ id, userData });
  };

  // Update Wallet Address Icon Mutation
  const updateWalletAddresIconMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: FormData;
    }) => {
      return api.post(`/walletAddress/updateWalletAddresIcon/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["walletAddress"] });
      setOpenEditWallet(false);
    },
  });

  const updateWalletAddresIcon = (
    id: string | undefined,
    formData: FormData
  ) => {
    updateWalletAddresIconMutation.mutate({ id, formData });
  };

  // Update Wallet Address Qrcode Mutation
  const updateWalletAddresQrcodeMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: FormData;
    }) => {
      return api.post(
        `/walletAddress/updateWalletAddresQrcode/${id}`,
        formData
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["walletAddress"] });
      setOpenEditWallet(false);
    },
  });

  const updateWalletAddresQrcode = (
    id: string | undefined,
    formData: FormData
  ) => {
    updateWalletAddresQrcodeMutation.mutate({ id, formData });
  };

  // Delete wallet Address Mutation
  const deleteWalletAddressMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/walletAddress/deleteWalletAddress/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["walletAddress"] });
      setOpenEditWallet(false);
    },
  });

  const deleteWalletAddress = (id: string | undefined) => {
    deleteWalletAddressMutation.mutate(id);
  };

  return {
    allWalletAddress: walletAddressData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    addWalletAddress,
    isAddingWalletAddress: addWalletAddressMutation.isPending,
    updateWalletAddress,
    isUpdatingWalletAddress: updateWalletAddressMutation.isPending,
    updateWalletAddresIcon,
    isUpdatingWalletAddresIcon: updateWalletAddresIconMutation.isPending,
    updateWalletAddresQrcode,
    isUpdatingWalletAddresQrcode: updateWalletAddresQrcodeMutation.isPending,
    deleteWalletAddress,
    isDeletingWalletAddress: deleteWalletAddressMutation.isPending,
  };
};
