import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Currency } from "@/types";
import { useConversionRateStore } from "@/store/conversionRateStore";

const useChangeCurrency = (
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // const queryClient = useQueryClient();
  const { setConversionRate } = useConversionRateStore();

  // changeCurrencyMutation
  const changeCurrencyMutation = useMutation({
    mutationFn: async (payload: Currency | undefined) => {
      return api.patch("/users/changeCurrency", payload);
    },

    onSuccess: async (response) => {
      // console.log(response.data);
      setVisible(false);
      await setConversionRate(response?.data);

      // Only save to localStorage if data is returned and is not empty
      if (
        response.data &&
        typeof response?.data?.rate === "number" &&
        typeof response?.data?.code === "string" &&
        typeof response?.data?.flag === "string"
      ) {
        sessionStorage.setItem(
          "conversionRate",
          JSON.stringify({
            data: response?.data, // The original data (coins data)
            savedAt: new Date().toISOString(), // Adding the current date in ISO format
          })
        );
      }

      toast.success("Conversion Successful");
    },

    onError: (error: unknown) => {
      let message = "Failed to change currency";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });

  // Wrapper function
  const changeCurrency = (payload: Currency | undefined) => {
    changeCurrencyMutation.mutate(payload);
  };

  return {
    changeCurrency,
    isLoading: changeCurrencyMutation.isPending,
    isError: changeCurrencyMutation.isError,
    error: changeCurrencyMutation.error,
    isSuccess: changeCurrencyMutation.isSuccess,
  };
};

export default useChangeCurrency;
