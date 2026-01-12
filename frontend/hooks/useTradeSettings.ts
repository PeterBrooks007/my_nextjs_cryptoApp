import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useTradeSettings = () => {
  const {
    data: tradingSettingsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tradingSettings"],
    queryFn: async () => {
      try {
        const response = await api.get("/tradingSettings/getAllTradingSetting");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch trading settings", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  return {
    allTradeSettings: tradingSettingsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};
