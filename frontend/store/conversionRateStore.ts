import { ConversionRateType } from "@/types";
import { create } from "zustand";

interface ConversionRateStore {
  // ConversionRateStore Sheet
  conversionRate: ConversionRateType | null;
  setConversionRate: (val: ConversionRateType) => void;
}

export const useConversionRateStore = create<ConversionRateStore>((set) => ({
  // ConversionRateStore Sheet
  conversionRate:
    typeof window !== "undefined"
      ? (() => {
          const stored = sessionStorage.getItem("conversionRate");
          return stored ? JSON.parse(stored).data : null;
        })()
      : null,

  setConversionRate: (val: ConversionRateType) => set({ conversionRate: val }),
}));
