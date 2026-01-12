import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSheetStore } from "@/store/sheetStore";
import { NftSettingsType } from "@/types";

export const useNftSettings = () => {
  const { setOpenAddNft, setOpenEditNft } = useSheetStore();
  const queryClient = useQueryClient();

  const {
    data: nftSettingsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["nftSettings"],
    queryFn: async () => {
      try {
        const response = await api.get("/nftSettings/getAllNfts");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch Nfts", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // ✅ Add Nft Mutation
  const addNftMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/nftSettings/addNft", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["nftSettings"] });

      toast(" Nft added successfully");
      setOpenAddNft(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to add trading Nft";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const addNft = (formData: FormData) => {
    addNftMutation.mutate(formData);
  };

  // Update  Nft Mutation
  const updateNftMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string | undefined;
      userData: Omit<
        NftSettingsType,
        "_id" | "photo" | "createdAt" | "updatedAt" | "__v"
      >;
    }) => {
      return api.patch(`/nftSettings/updateNft/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["nftSettings"] });

      toast("Nft Updated successfully");
      setOpenEditNft(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to Update Nft";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const updateNft = (
    id: string | undefined,
    userData: Omit<
      NftSettingsType,
      "_id" | "photo" | "createdAt" | "updatedAt" | "__v"
    >
  ) => {
    updateNftMutation.mutate({ id, userData });
  };

  // Update  Nft Photo Mutation
  const updateNftPhotoMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: FormData;
    }) => {
      return api.post(`/nftSettings/updateNftPhoto/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["nftSettings"] });
      setOpenEditNft(false);
    },
  });

  const updateNftPhoto = (id: string | undefined, formData: FormData) => {
    updateNftPhotoMutation.mutate({ id, formData });
  };

  // Delete Nft Mutation
  const deleteNftMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      return api.delete(`/nftSettings/deleteNft/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["nftSettings"] });
      setOpenEditNft(false);
    },
  });

  const deleteNft = (id: string | undefined) => {
    deleteNftMutation.mutate(id);
  };

  return {
    allNfts: nftSettingsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    addNft,
    isAddingNft: addNftMutation.isPending,
    updateNft,
    isUpdatingNft: updateNftMutation.isPending,

    updateNftPhoto,
    isUpdatingNftPhoto: updateNftPhotoMutation.isPending,

    deleteNft,
    isDeletingNft: deleteNftMutation.isPending,
  };
};
