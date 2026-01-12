import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useTradingBots = () => {
  const {
    data: tradingBotsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tradingBots"],
    queryFn: async () => {
      try {
        const response = await api.get("/tradingBots/getAllTradingBots");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch trading bots", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  return {
    allTradingBots: tradingBotsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};
