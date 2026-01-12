"use client";

import { api } from "@/lib/api";
import { CoinpaprikaCoin } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export const useCoinpaprika = (currency: string | undefined) => {
  // get data from localstorage at first
  const [allCoins, setAllCoins] = useState(() => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem("allCoinpaprikaCoinPrices");
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      return parsed.data ?? [];
    } catch {
      return [];
    }
  });

  //getAllCoinpaprikaCoinPrices Mutation
  const getAllCoinpaprikaCoinPricesMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.get(`/users/getAllCoinpaprikaCoinPrices`);

      setAllCoins(data);

      // console.log("coinpaprika coin", data);

      // Only save to localStorage if data is returned and is not empty
      if (data && data.length > 0) {
        localStorage.setItem(
          "allCoinpaprikaCoinPrices",
          JSON.stringify({
            data: data, // The original data (coins data)
            savedAt: new Date().toISOString(), // Adding the current date in ISO format
          })
        );
      }

      return data;
    },
  });

  //stable callback for useEffect for Function to mutate the mutation
  const { mutate } = getAllCoinpaprikaCoinPricesMutation;

  const getAllCoinpaprikaCoinPrices = useCallback(
    () => {
      mutate(); // ✅ uses the stable mutate fn
    },
    [mutate] // ✅ correct dependency
  );

  //   useeffect to automatically get all coin if currency change or if no data on the localstorage
  useEffect(() => {
    if (!currency) {
      return; // Exit early if user data is not yet available
    }

    const checkAndUpdatePrices = () => {
      const allCoinpaprikaCoinPricesData = localStorage.getItem(
        "allCoinpaprikaCoinPrices"
      );

      if (allCoinpaprikaCoinPricesData) {
        const { savedAt, data } = JSON.parse(allCoinpaprikaCoinPricesData);

        // Check if the data array is empty
        const isDataEmpty = !data || data.length === 0;

        // Check if any of the data's quote matches the user's currency code
        const doesCurrencyMatch = data.some(
          (coin: CoinpaprikaCoin) => coin.quotes[currency]
        );

        // Convert `savedAt` to Date object and compare time difference
        const savedAtTime = new Date(savedAt).getTime();
        const currentTime = new Date().getTime();
        const fifteenMinutesInMillis = 15 * 60 * 1000; // 15 minutes in milliseconds
        const timestampPlusFifteenMinutes =
          savedAtTime + fifteenMinutesInMillis;

        const hasTimePassedFifteenMinutes =
          currentTime > timestampPlusFifteenMinutes;

        // If more than 15 minutes have passed, data is empty, or currency doesn't match
        if (hasTimePassedFifteenMinutes || isDataEmpty || !doesCurrencyMatch) {
          getAllCoinpaprikaCoinPrices();
        }
      } else {
        // If no data exists in localStorage, dispatch the action immediately
        getAllCoinpaprikaCoinPrices();
      }
    };

    // Initial check
    checkAndUpdatePrices();

    // Set an interval to repeat the check every 15 minutes
    const intervalId = setInterval(() => {
      checkAndUpdatePrices();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [currency, getAllCoinpaprikaCoinPrices]);

  return {
    allCoins, // ✅ returned data
    getAllCoinpaprikaCoinPrices,
    isLoading: getAllCoinpaprikaCoinPricesMutation.isPending,
    isError: getAllCoinpaprikaCoinPricesMutation.isError,
    error: getAllCoinpaprikaCoinPricesMutation.error,
    isSuccess: getAllCoinpaprikaCoinPricesMutation.isSuccess,
    refetch: () => getAllCoinpaprikaCoinPrices(),
  };
};
