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
import { SetStateAction } from "react";
import { toast } from "sonner";

// useLogin
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

// useLogout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.get("/users/logout"),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["me"] }); // ✅ updated
    },
  });
};

// useCurrentUser
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
    staleTime: Infinity, //  (prevents refetch)
    gcTime: Infinity, // prevent removing from the garbage collector
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// useChangePassword
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

// useChangePin
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

// use2faAuthentication
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
      let message = "Failed to Changed ";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

// useContactUs
export const useContactUs = () => {
  return useMutation({
    mutationFn: async (userData: {
      firstname: string;
      lastname: string;
      email: string;
      subject: string;
      message: string;
    }) => {
      return api.post("/users/contactUs", userData);
    },
    onSuccess: async (response) => {
      // console.log(response.data)
      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to send message";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

// useRequestCard
export const useRequestCard = () => {
  return useMutation({
    mutationFn: async (userData: {
      firstname: string | undefined;
      lastname: string | undefined;
      email: string | undefined;
      phone: string | undefined;
      country: string | undefined;
      cardType: string;
    }) => {
      return api.post("/users/requestCard", userData);
    },
    onSuccess: async () => {
      // console.log(response.data)
      toast.success(
        "Message sent successfully, we will get back to you shortly."
      );
    },
    onError: (error: unknown) => {
      let message = "Failed to send message";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

// useUpdatePhoto
export const useUpdatePhoto = (
  setImagePreview: React.Dispatch<SetStateAction<string | null>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return api.patch("/users/updatePhoto", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setImagePreview(null);

      toast.success("User Photo Updated");
    },
    onError: (error: unknown) => {
      let message = "Failed to Update";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

// useEditProfile
export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      firstname: string;
      lastname: string;
      email: string;
      phone: string;
      address: {
        address: string;
        state: string;
        country: string | undefined;
        countryFlag: string | undefined;
      };
    }) => {
      console.log(userData);
      return api.patch(`/users/updateUser`, userData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });

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

// useIdVerificationUpload
export const useIdVerificationUpload = (
  setImagePreviews: React.Dispatch<
    SetStateAction<{
      front: string | null;
      back: string | null;
    }>
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/users/idVerificationUpload", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setImagePreviews({ front: null, back: null });

      toast.success("Ids uploaded sucessfully and awaiting approval");
    },
    onError: (error: unknown) => {
      let message = "Failed to Update";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

// useResidencyVerification
export const useResidencyVerification = (
  setImagePreview: React.Dispatch<SetStateAction<string | null>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return api.patch("/users/residencyVerification", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setImagePreview(null);

      toast.success("Residency uploaded sucessfully and awaiting approval");
    },
    onError: (error: unknown) => {
      let message = "Failed to Update";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};
