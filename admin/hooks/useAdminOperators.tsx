import { api } from "@/lib/api";
import { useSheetStore } from "@/store/sheetStore";
import { EditUserProfileType, TradeFormData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

// useIdApproval
export const useIdApproval = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: { status: string | undefined };
    }) => {
      return api.patch(`/users/adminApproveId/${id}`, userData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to approve Id ";

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

// useAutoTradeSettings
export const useAutoTradeSettings = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: {
        isAutoTradeActivated: boolean;
        type: string | undefined;
        winLoseValue: string;
      };
    }) => {
      return api.patch(`/users/adminSetUserAutoTrade/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success("User Auto Trade Settings has been updated successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to update Auto Trade Settings ";

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

// useEditProfile
export const useEditProfile = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: EditUserProfileType;
    }) => {
      console.log(userData);
      return api.patch(`/users/adminUpdateUser/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success("User Updated Successlly");
    },
    onError: (error: unknown) => {
      let message = "Failed to Edit Profile ";

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

// useBalanceUpdate
export const useBalanceUpdate = (id: string, type: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: { amount: number };
    }) => {
      // Decide endpoint based on type
      const endpoint =
        type === "debit" ? "adminDebitTradeBalance" : "adminFundTradeBalance";

      return api.patch(`/users/${endpoint}/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      const endpoint =
        type === "debit"
          ? "User Debited Successfully"
          : "User funded Successfully";

      toast.success(endpoint);
    },
    onError: (error: unknown) => {
      let message = "Failed to Update";

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

// useSetManualAssetMode
export const useSetManualAssetMode = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/users/adminSetIsManualAssetMode/${id}`);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to Set Manual Asset mode ";

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

// useAddAssetWalletFromUser
export const useAddAssetWalletFromUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      // console.log(userData);
      return api.post(`/users/adminAddNewAssetWalletToUser/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success("Asset Added Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Added Asset";

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

// useDeleteAssetWalletFromUser
export const useDeleteAssetWalletFromUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: { walletSymbol: string | undefined };
    }) => {
      console.log(userData);
      return api.delete(`/users/adminDeleteAssetWalletFromUser/${id}`, {
        data: userData,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success("Asset Deleted Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Deleted Asset";

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

// useUpdateAssetBalance
export const useUpdateAssetBalance = (id: string, type: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: { symbol: string | undefined; amount: number };
    }) => {
      // Decide endpoint based on type
      const endpoint =
        type === "debit" ? "adminDebitAssetBalance" : "adminFundAssetBalance";

      return api.patch(`/users/${endpoint}/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      const endpoint =
        type === "debit"
          ? "Asset Debited Successfully"
          : "Asset funded Successfully";

      toast.success(endpoint);
    },
    onError: (error: unknown) => {
      let message = "Failed ";

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

// useManualUpdateAssetBalance
export const useManualUpdateAssetBalance = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: {
        symbol: string | undefined;
        amount: number;
        amountInCryoto: number;
      };
    }) => {
      // console.log(userData);
      return api.patch(`/users/adminManualUpdateAssetBalance/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success("Asset Updated Successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Update";

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

// useResidencyApproval
export const useResidencyApproval = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: { status: string | undefined };
    }) => {
      return api.patch(`/users/adminApproveResidency/${id}`, userData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to approve Residency ";

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

// useDemoAccount
export const useDemoAccount = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: {
        isDemoAccountActivated: boolean;
        demoBalance: number;
      };
    }) => {
      return api.patch(`/users/adminActivateDemoAccount/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success("User Demo Account updated successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to update Demo Account ";

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

// useEmailVerification
export const useEmailVerification = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/users/adminVerifyEmail/${id}`);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to update Email Verification ";

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

// useChangeCurrency
export const useChangeCurrency = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: { code: string | undefined; flag: string | undefined };
    }) => {
      return api.patch(`/users/adminChangeUserCurrency/${id}`, userData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to update change currency ";

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

// useDemoAccount
export const useWithdrawalLock = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: {
        lockCode: number;
        lockSubject: string;
        lockComment: string;
        isWithdrawalLocked: boolean;
      };
    }) => {
      return api.patch(`/users/adminSetUserWithdrawalLock/${id}`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });

      toast.success(
        "User Withdrawal Lock Settings has been updated successfully"
      );
    },
    onError: (error: unknown) => {
      let message = "Failed to update Withdrawal Lock";

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

// useUpdateCustomizeEmailLogo
export const useUpdateCustomizeEmailLogo = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: FormData;
    }) => {
      return api.post(`/users/updateCustomizeEmailLogo/${id}`, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });
      toast.success("Customized Email logo Changed successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to update ";

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

// useAdminSendCustomizedMail
export const useAdminSendCustomizedMail = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | undefined;
      formData: {
        to: string;
        fullName: string;
        subject: string;
        teamName: string;
        content: string;
        footer: string;
      };
    }) => {
      return api.post(`/users/adminSendCustomizedMail/${id}`, formData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });
      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to send ";

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
