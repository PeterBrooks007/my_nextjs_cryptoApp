import { create } from "zustand";

interface TradingModeStore {
  // trading Mode Sheet
  tradingMode: string;
  setTradingModeStore: (val: string) => void;
}

export const useTradingModeStore = create<TradingModeStore>((set) => ({
  // trading Mode Sheet
  tradingMode: "Live",
  setTradingModeStore: (val: string) => set({ tradingMode: val }),
}));
