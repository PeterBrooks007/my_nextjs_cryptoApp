import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useUserNotifications = (id: string) => {
  const queryClient = useQueryClient();

  const {
    data: notificationsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["notifications", id],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/notifications/adminGetUserNotifications/${id}`
        );
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch user notifications", error);
        throw error;
      }
    },
    select: (res) => res?.data?.data,
  });

  // addUserNotificationMutation
  const addUserNotificationMutation = useMutation({
    mutationFn: async (formData: {
      userId: string;
      notificationData: {
        from: string;
        title: string;
        message: string;
      };
    }) => {
      return api.post("/notifications/addNotification", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications", id],
      });

      toast("User Notification added successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to add Notification";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const addUserNotification = (formData: {
    userId: string;
    notificationData: {
      from: string;
      title: string;
      message: string;
    };
  }) => {
    addUserNotificationMutation.mutate(formData);
  };

  // updateUserNotificationMutation
  const updateUserNotificationMutation = useMutation({
    mutationFn: async (formData: {
      userId: string;
      notificationData: {
        notificationId: string | undefined;
        title: string;
        message: string;
        createdAt: string | undefined;
      };
    }) => {
      return api.patch(
        `/notifications/adminUpdateUserNotification/${id}`,
        formData
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications", id],
      });

      toast("User Notification updated successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to update Notification";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  const updateUserNotification = (formData: {
    userId: string;
    notificationData: {
      notificationId: string | undefined;
      title: string;
      message: string;
      createdAt: string | undefined;
    };
  }) => {
    updateUserNotificationMutation.mutate(formData);
  };

  // delete User Notification Mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        userId: string | undefined;
        notificationData: {
          notificationId: string | undefined;
        };
      };
    }) => {
      // Send DELETE request with data payload
      return api.delete(`/notifications/deleteNotification/${id}`, {
        data: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", id] });
      toast.success("Notification Deleted");
    },
  });

  const deleteNotification = (payload: {
    id: string | undefined;
    formData: {
      userId: string | undefined;
      notificationData: {
        notificationId: string | undefined;
      };
    };
  }) => {
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

    addUserNotification,
    isAddingUserNotification: addUserNotificationMutation.isPending,

    updateUserNotification,
    isUpdatingUserNotification: updateUserNotificationMutation.isPending,

    deleteNotification,
    isDeletingNotification: deleteNotificationMutation.isPending,

    clearNotification,
    isClearingNotification: clearNotificationMutation.isPending,
  };
};
