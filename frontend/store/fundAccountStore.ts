import { create } from "zustand";

interface FundAccountStore {
  // FundAccount Sheet
  isFundAccount: boolean;
  setIsFundAccount: (val: boolean) => void;
}

export const useFundAccountStore = create<FundAccountStore>((set) => ({
  // FundAccount Sheet
  isFundAccount: false,
  setIsFundAccount: (val: boolean) => set({ isFundAccount: val }),
}));
