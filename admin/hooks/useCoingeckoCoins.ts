"use client";

import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export const useCoingeckoCoins = () => {
  // get data from localstorage at first
  const [allCoins, setAllCoins] = useState(() => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem("allCoins");
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      return parsed.data ?? [];
    } catch {
      return [];
    }
  });

  //getAllCoingeckoCoinsMutation Mutation
  const getAllCoingeckoCoinsMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.get(`/users/getAllCoins`);

      setAllCoins(data);

      // Only save to localStorage if data is returned and is not empty
      if (data && data.length > 0) {
        localStorage.setItem(
          "allCoins",
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
  const { mutate } = getAllCoingeckoCoinsMutation;

  const getAllCoingeckoCoins = useCallback(
    () => {
      mutate(); // ✅ uses the stable mutate fn
    },
    [mutate] // ✅ correct dependency
  );

  //   useeffect to automatically get all coin if time has passed or if no data on the localstorage
  useEffect(() => {
    const allCoinsData = localStorage.getItem("allCoins");

    if (allCoinsData) {
      const { savedAt } = JSON.parse(allCoinsData);

      // Convert `savedAt` to Date object and compare time difference
      const savedAtTime = new Date(savedAt).getTime();
      const currentTime = new Date().getTime();
      const sixHoursInMillis = 24 * 60 * 60 * 1000;

      const timestampPlusSixHours = savedAtTime + sixHoursInMillis;

      const hasTimePassedSixHours = currentTime > timestampPlusSixHours;

      // console.log("hasTimePassed24Hours", hasTimePassedSixHours);

      // If more than 6 hours have passed, dispatch the action
      if (hasTimePassedSixHours) {
        getAllCoingeckoCoins();
      }
    } else {
      // If no data exists in localStorage, dispatch the action immediately
      getAllCoingeckoCoins();
    }
  }, [getAllCoingeckoCoins]);

  return {
    allCoins: allCoins, // ✅ returned data
    getAllCoingeckoCoins,
    isLoading: getAllCoingeckoCoinsMutation.isPending,
    isError: getAllCoingeckoCoinsMutation.isError,
    error: getAllCoingeckoCoinsMutation.error,
    isSuccess: getAllCoingeckoCoinsMutation.isSuccess,
  };
};
