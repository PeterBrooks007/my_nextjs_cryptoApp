import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSheetStore } from "@/store/sheetStore";
import { ConnectWalletsType } from "@/types";

export const useConnectWallets = () => {
  const { setOpenAddConnectWallet, setOpenEditConnectWallet } = useSheetStore();
  const queryClient = useQueryClient();

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
        console.log("Failed to fetch connect wallets", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // ✅ Add Connect Wallet Mutation
  const addConnectWalletMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/connectWallet/addConnectWallet", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["connectWallets"] });

      toast("Connect Wallet added successfully");
      setOpenAddConnectWallet(false);
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

  const addConnectWallet = (formData: FormData) => {
    addConnectWalletMutation.mutate(formData);
  };

  // Update Connect Wallet Mutation
  const updateConnectWalletMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string | undefined;
      userData: Omit<
        ConnectWalletsType,
        "_id" | "photo" | "createdAt" | "updatedAt" | "__v"
      >;
    }) => {
      return api.patch(`/connectWallet/updateConnectWallet/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["connectWallets"] });

      toast("Connect Wallet Updated successfully");
      setOpenEditConnectWallet(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Connect Wallet";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const updateConnectWallet = (
    id: string | undefined,
    userData: Omit<
      ConnectWalletsType,
      "_id" | "photo" | "createdAt" | "updatedAt" | "__v"
    >
  ) => {
    updateConnectWalletMutation.mutate({ id, userData });
  };

  // Update Connect Wallet Photo Mutation
  const updateConnectWalletPhotoMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: FormData;
    }) => {
      return api.post(
        `/connectWallet/updateConnectWalletPhoto/${id}`,
        formData
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["connectWallets"] });
      setOpenEditConnectWallet(false);
    },
  });

  const updateConnectWalletPhoto = (
    id: string | undefined,
    formData: FormData
  ) => {
    updateConnectWalletPhotoMutation.mutate({ id, formData });
  };

  // Delete Connect Wallet Mutation
  const deleteConnectWalletMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/connectWallet/deleteConnectWallet/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["connectWallets"] });
      toast("Connect Wallet Deleted successfully");
      setOpenEditConnectWallet(false);
    },
  });

  const deleteConnectWallet = (id: string | undefined) => {
    deleteConnectWalletMutation.mutate(id);
  };

  // Delete Arrays of Wallet Mutation
  const deleteArraysOfWalletMutation = useMutation({
    mutationFn: async (walletIds: string[]) => {
      return api.delete(`/connectWallet/deleteArrayOfWallets`, {
        data: { walletIds },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["connectWallets"] });
      toast("Connect Wallet Deleted successfully");
      setOpenEditConnectWallet(false);
    },
  });

  const deleteArrayOfWallets = (walletIds: string[]) => {
    deleteArraysOfWalletMutation.mutate(walletIds);
  };

  return {
    allConnectWallets: connectWalletsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    addConnectWallet,
    isAddingConnectWallet: addConnectWalletMutation.isPending,
    updateConnectWallet,
    isUpdatingConnectWallet: updateConnectWalletMutation.isPending,

    updateConnectWalletPhoto,
    isUpdatingConnectWalletPhoto: updateConnectWalletPhotoMutation.isPending,

    deleteConnectWallet,
    isDeletingConnectWallet: deleteConnectWalletMutation.isPending,

    deleteArrayOfWallets,
    isDeletingArrayOfWallets: deleteArraysOfWalletMutation.isPending,
  };
};
