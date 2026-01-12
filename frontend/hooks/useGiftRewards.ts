import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useGiftRewards = () => {
  const queryClient = useQueryClient();

  // userClaimRewardMutation
  const userClaimRewardMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        rewardId: string;
      };
    }) => {
      return api.patch(`/users/UserClaimReward/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });
      toast("Reward claimed successfuly");
    },
    onError: (error: unknown) => {
      let message = "Failed to claim reward";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const userClaimReward = (
    id: string | undefined,
    formData: {
      rewardId: string;
    }
  ) => {
    userClaimRewardMutation.mutate({ id, formData });
  };

  return {
    userClaimReward,
    isUserClaimingReward: userClaimRewardMutation.isPending,
  };
};
