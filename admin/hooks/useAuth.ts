"use client";

import { api } from "@/lib/api";
import { User } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError, { email: string; password: string }>({
    mutationFn: async (data) => {
      const res = await api.post<{ data: User; token: string }>(
        "/users/login",
        data
      );

      if (res.data.token) {
        router.replace("/dashboard");
      }
      return res.data.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Logged in successfully!");
    },
    onError: (error: unknown) => {
      let message = "Login failed";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.get("/users/logout"),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["me"] }); // ✅ updated
    },
  });
};

export const useCurrentUser = (): UseQueryResult<User, Error> => {
  const queryClient = useQueryClient();
  const router = useRouter(); // Use the router here

  return useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await api.get<User>("/users/getUser");
        return res.data;
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;

        if (error.response?.status === 401) {
          try {
            // Note: Use a POST request for logout as it performs an action
            await api.get("/users/logout");
          } catch {}

          queryClient.removeQueries({ queryKey: ["me"] });

          router.push("/auth/login");

          throw new Error("Session expired. Redirecting to login.");
        }
        // For all other errors (500, 404, network issues), re-throw
        throw err;
      }
    },
    // Keep retry at 0 to prevent React Query from automatically retrying network/server errors
    retry: 0,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (userData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      return api.patch("/users/changePassword", userData);
    },
    onSuccess: async () => {
      // await queryClient.invalidateQueries({ queryKey: ["connectWallets"] });

      toast("Password Changed successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Changed successfully";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

export const useChangePin = () => {
  return useMutation({
    mutationFn: async (userData: {
      currentPin: string;
      newPin: string;
      confirmPin: string;
    }) => {
      return api.patch("/users/changePin", userData);
    },
    onSuccess: async () => {
      // await queryClient.invalidateQueries({ queryKey: ["connectWallets"] });

      toast("Pin Changed successfully");
    },
    onError: (error: unknown) => {
      let message = "Failed to Changed successfully";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

export const use2faAuthentication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: { isTwoFactorEnabled: boolean }) => {
      return api.patch("/users/twofaAuthentication", userData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });

      let TwoFactorEnabled;
      if (response.data.isTwoFactorEnabled === true) {
        TwoFactorEnabled = "ON";
      } else {
        TwoFactorEnabled = "OFF";
      }

      toast.success(
        "Two factor authentication has be switched " + TwoFactorEnabled
      );
    },
    onError: (error: unknown) => {
      let message = "Failed to Changed successfully";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};
