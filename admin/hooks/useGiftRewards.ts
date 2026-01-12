import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";

export const useGiftRewards = (id: string) => {
  const [openAddReward, setOpenAddReward] = useState(false);

  const queryClient = useQueryClient();

  // adminAddRewardToUserMutation
  const adminAddRewardToUserMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: { amount: number; subject: string; message: string };
    }) => {
      return api.patch(`/users/adminAddGiftReward/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users", id],
      });
      setOpenAddReward(false);
      toast("Reward added to user successfuly successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to add reward";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const adminAddRewardToUser = (
    id: string,
    formData: {
      amount: number;
      subject: string;
      message: string;
    }
  ) => {
    adminAddRewardToUserMutation.mutate({ id, formData });
  };

  // delete User Notification Mutation
  const adminDeleteGiftRewardMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        rewardId: string;
      };
    }) => {
      // Send DELETE request with data payload
      return api.patch(`/users/adminDeleteGiftReward/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", id] });
      toast.success("Reward Deleted");
    },
  });

  const adminDeleteGiftReward = (payload: {
    id: string | undefined;
    formData: {
      rewardId: string;
    };
  }) => {
    adminDeleteGiftRewardMutation.mutate(payload);
  };

  return {
    openAddReward,
    setOpenAddReward,

    adminAddRewardToUser,
    isAdminAddingRewardToUser: adminAddRewardToUserMutation.isPending,

    adminDeleteGiftReward,
    isAdminDeleteGiftReward: adminDeleteGiftRewardMutation.isPending,
  };
};
