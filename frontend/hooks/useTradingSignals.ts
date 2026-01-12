import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useTradingSignals = () => {
  const {
    data: tradingSignalsData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tradingSignals"],
    queryFn: async () => {
      try {
        const response = await api.get("/tradingSignals/getAllTradingSignals");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch trading Signals", error);
        throw error;
      }
    },
    select: (res) => res?.data,
  });

  return {
    allTradingSignals: tradingSignalsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};
