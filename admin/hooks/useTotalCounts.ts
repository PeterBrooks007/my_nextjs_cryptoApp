"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useTotalCounts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["totalCounts"],
    queryFn: async () => {
      const { data } = await api.get("/totalCounts/getAllAdminTotalCounts");
      if (!data) {
        throw new Error(data.message || "Failed to fetch users");
      }
      // console.log(data)
      return data;
    },
  });

  // console.log("stories", storiesData);

  return {
    isLoading,
    error,
    refetch,
    totalUsers: data?.userCount,
    unreadMessages: data?.inboxCount,
    totalDepositRequests: data?.pendingDepositCount,
    totalWithdrawalRequests: data?.pendingWithdrawalCount,
    recentUsers: data?.recentUsers,
    newNotifications: data?.notificationCount,
    
  };
};
