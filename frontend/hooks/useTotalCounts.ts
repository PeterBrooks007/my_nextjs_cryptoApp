"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useTotalCounts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["totalCounts"],
    queryFn: async () => {
      const { data } = await api.get("/totalCounts/getAllUserTotalCounts");
      if (!data) {
        throw new Error(data.message || "Failed to fetch users");
      }
      // console.log(data);
      return data;
    },
  });

  // console.log("stories", storiesData);

  return {
    isLoading,
    error,
    refetch,
    unreadMessages: data?.unreadMessageCount,
    newNotifications: data?.notificationCount,
  };
};
