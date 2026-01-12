import { create } from "zustand";

interface TypeOfDepositStore {
  // trading Mode Sheet
  typeOfDeposit: string;
  setTypeOfDeposit: (val: string) => void;
}

export const useTypeOfDepositStore = create<TypeOfDepositStore>((set) => ({
  // trading Mode Sheet
  typeOfDeposit: "",
  setTypeOfDeposit: (val: string) => set({ typeOfDeposit: val }),
}));
