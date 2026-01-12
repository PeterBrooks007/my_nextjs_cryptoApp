import { api } from "@/lib/api";
import { useSheetStore } from "@/store/sheetStore";
import { TradeFormData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

// useAddTrade
export const useAddTrade = (id: string) => {
  const queryClient = useQueryClient();
  const { setOpenTradeHistory } = useSheetStore();

  return useMutation({
    mutationFn: async (formData: TradeFormData) => {
      // console.log(userData);
      return api.post(`/trades/addTrade`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });
      await queryClient.invalidateQueries({
        queryKey: ["tradeHistories", id],
      });
      setOpenTradeHistory(true);

      toast.success("Trade added Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to admin";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }
      // console.log(error);

      toast.error(message);
    },
  });
};
