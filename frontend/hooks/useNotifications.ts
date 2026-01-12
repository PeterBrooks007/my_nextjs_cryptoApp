import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type DeleteNotificationPayload = {
  id: string | undefined; // user ID
  formData: {
    userId: string | undefined;
    notificationData: {
      notificationId: string | undefined;
    };
  };
};

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const {
    data: notificationsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await api.get(
          "/notifications/getUserNotifications"
        );
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch notifications", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  // delete Notification Mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async ({ id, formData }: DeleteNotificationPayload) => {
      // Send DELETE request with data payload
      return api.delete(`/notifications/deleteNotification/${id}`, {
        data: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["totalCounts"] });
    },
  });

  const deleteNotification = (payload: DeleteNotificationPayload) => {
    deleteNotificationMutation.mutate(payload);
  };

  // Clear Notification Mutation
  const clearNotificationMutation = useMutation({
    mutationFn: async () => {
      return api.delete(`/notifications/adminClearNotification/id`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["totalCounts"] });
    },
  });

  const clearNotification = () => {
    clearNotificationMutation.mutate();
  };

  return {
    notifications: notificationsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteNotification,
    isDeletingNotification: deleteNotificationMutation.isPending,
    clearNotification,
    isClearingNotification: clearNotificationMutation.isPending,
  };
};
