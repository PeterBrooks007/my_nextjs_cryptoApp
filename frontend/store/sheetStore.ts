import { create } from "zustand";

interface SheetState {
  // Wallet address Sheet
  openAddWallet: boolean;
  setOpenAddWallet: (val: boolean) => void;
  openEditWallet: boolean;
  setOpenEditWallet: (val: boolean) => void;

  // Expert Trader Sheet
  openAddTrader: boolean;
  setOpenAddTrader: (val: boolean) => void;
  openEditTrader: boolean;
  setOpenEditTrader: (val: boolean) => void;

  // Trading Bot Sheet
  openAddBot: boolean;
  setOpenAddBot: (val: boolean) => void;
  openEditBot: boolean;
  setOpenEditBot: (val: boolean) => void;

  // Trading Signal Sheet
  openAddSignal: boolean;
  setOpenAddSignal: (val: boolean) => void;
  openEditSignal: boolean;
  setOpenEditSignal: (val: boolean) => void;

  // Nft Settings Sheet
  openAddNft: boolean;
  setOpenAddNft: (val: boolean) => void;
  openEditNft: boolean;
  setOpenEditNft: (val: boolean) => void;

  // Connect Wallet Sheet
  openAddConnectWallet: boolean;
  setOpenAddConnectWallet: (val: boolean) => void;
  openEditConnectWallet: boolean;
  setOpenEditConnectWallet: (val: boolean) => void;

  // Trade Setting Sheet
  openAddTradeSetting: boolean;
  setOpenAddTradeSetting: (val: boolean) => void;
  openEditTradeSetting: boolean;
  setOpenEditTradeSetting: (val: boolean) => void;

  // Deposit Request Sheet
  openAddDepositRequest: boolean;
  setOpenAddDepositRequest: (val: boolean) => void;
  openEditDepositRequest: boolean;
  setOpenEditDepositRequest: (val: boolean) => void;

  // Withdrawal Request Sheet
  openAddWithdrawalRequest: boolean;
  setOpenAddWithdrawalRequest: (val: boolean) => void;
  openEditWithdrawalRequest: boolean;
  setOpenEditWithdrawalRequest: (val: boolean) => void;

  // openOperator Sheet
  openOperatorSheet: boolean;
  setOpenOperatorSheet: (val: boolean) => void;
  openEditOperatorSheet: boolean;
  setOpenEditOperatorSheet: (val: boolean) => void;

  // openTradeHistory Sheet
  openTradeHistory: boolean;
  setOpenTradeHistory: (val: boolean) => void;
  openEditTradeHistory: boolean;
  setOpenEditTradeHistory: (val: boolean) => void;
}

export const useSheetStore = create<SheetState>((set) => ({
  // Wallet address Sheet
  openAddWallet: false,
  setOpenAddWallet: (val: boolean) => set({ openAddWallet: val }),
  openEditWallet: false,
  setOpenEditWallet: (val: boolean) => set({ openEditWallet: val }),

  // Expert Trader Sheet
  openAddTrader: false,
  setOpenAddTrader: (val: boolean) => set({ openAddTrader: val }),
  openEditTrader: false,
  setOpenEditTrader: (val: boolean) => set({ openEditTrader: val }),

  // Trading Bots Sheet
  openAddBot: false,
  setOpenAddBot: (val: boolean) => set({ openAddBot: val }),
  openEditBot: false,
  setOpenEditBot: (val: boolean) => set({ openEditBot: val }),

  // Trading Signals Sheet
  openAddSignal: false,
  setOpenAddSignal: (val: boolean) => set({ openAddSignal: val }),
  openEditSignal: false,
  setOpenEditSignal: (val: boolean) => set({ openEditSignal: val }),

  // Nft Settings Sheet
  openAddNft: false,
  setOpenAddNft: (val: boolean) => set({ openAddNft: val }),
  openEditNft: false,
  setOpenEditNft: (val: boolean) => set({ openEditNft: val }),

  // Connect Wallet Sheet
  openAddConnectWallet: false,
  setOpenAddConnectWallet: (val: boolean) => set({ openAddConnectWallet: val }),
  openEditConnectWallet: false,
  setOpenEditConnectWallet: (val: boolean) =>
    set({ openEditConnectWallet: val }),

  //Trade Setting Sheet
  openAddTradeSetting: false,
  setOpenAddTradeSetting: (val: boolean) => set({ openAddTradeSetting: val }),
  openEditTradeSetting: false,
  setOpenEditTradeSetting: (val: boolean) => set({ openEditTradeSetting: val }),

  //Deposit Request Sheet
  openAddDepositRequest: false,
  setOpenAddDepositRequest: (val: boolean) =>
    set({ openAddDepositRequest: val }),
  openEditDepositRequest: false,
  setOpenEditDepositRequest: (val: boolean) =>
    set({ openEditDepositRequest: val }),

  //Withdrawal Request Sheet
  openAddWithdrawalRequest: false,
  setOpenAddWithdrawalRequest: (val: boolean) =>
    set({ openAddWithdrawalRequest: val }),
  openEditWithdrawalRequest: false,
  setOpenEditWithdrawalRequest: (val: boolean) =>
    set({ openEditWithdrawalRequest: val }),

  //openOperator Sheet
  openOperatorSheet: false,
  setOpenOperatorSheet: (val: boolean) => set({ openOperatorSheet: val }),
  openEditOperatorSheet: false,
  setOpenEditOperatorSheet: (val: boolean) => set({ openOperatorSheet: val }),

  //openTradeHistory Sheet
  openTradeHistory: false,
  setOpenTradeHistory: (val: boolean) => set({ openTradeHistory: val }),
  openEditTradeHistory: false,
  setOpenEditTradeHistory: (val: boolean) => set({ openTradeHistory: val }),
}));
