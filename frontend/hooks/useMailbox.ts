import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

// useMailInbox hook
export const useGetUserMails = () => {
  const queryClient = useQueryClient();

  const {
    data: allMailData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["allUserMail"],
    queryFn: async () => {
      try {
        const response = await api.get("/mailbox/getUserMail");
        // console.log(response.data);
        await queryClient.invalidateQueries({ queryKey: ["totalCounts"] });

        return response;
      } catch (error) {
        console.log("Failed to fetch all Mail Inbox", error);
        throw error;
      }
    },
    select: (res) => res?.data,
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes (prevents refetch)
    gcTime: 1000 * 60 * 10, // keep alive for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    allUserMail: allMailData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};

export const useAddMail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: {
      userId: string | undefined;
      messages: {
        to: string;
        from: string | undefined;
        subject: string;
        content: string;
      }[];
    }) => {
      return api.post("/mailbox/addmail", formData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["allUserMail"] });

      // let TwoFactorEnabled;
      // if (response.data.isTwoFactorEnabled === true) {
      //   TwoFactorEnabled = "ON";
      // } else {
      //   TwoFactorEnabled = "OFF";
      // }

      window.location.hash = "#sent";

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to Add Mail ";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

export const useStarredMail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: {
      messageData: {
        messageData: {
          messageId: string | undefined;
          userId: string | undefined;
        }[];
        from: string;
      };
    }) => {
      return api.patch("/mailbox/adminStarredMail", messageData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["allUserMail"] });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to star Message ";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

export const useMarkasreadOnViewMail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: {
      messageData: {
        messageData: {
          messageId: string | undefined;
          userId: string | undefined;
        }[];
        from: string;
      };
    }) => {
      return api.patch("/mailbox/adminMarkMailAsRead", messageData);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["allUserMail"] });
      queryClient.invalidateQueries({ queryKey: ["totalCounts"] });
    },
    onError: (error: unknown) => {
      let message = "Failed to mark as read Message ";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

export const useDeleteMail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: {
      messageData: {
        messageData: {
          messageId: string | undefined;
          userId: string | undefined;
        }[];
        from: string;
      };
    }) => {
      return api.delete("/mailbox/adminDeleteMail", { data: messageData });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["allUserMail"] });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to Delete Message ";

      if (error instanceof AxiosError) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        }
      }

      toast.error(message);
    },
  });
};

export const useMarkasReadArrayOfMessages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: {
      messageData: { messageData: { messageId: string }[]; from: string };
    }) => {
      return api.patch("/mailbox/adminMarkMailAsRead", messageData);
    },
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ["totalCounts"] });
      await queryClient.invalidateQueries({ queryKey: ["allUserMail"] });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to Mark as read Message ";

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

export const useDeleteArrayOfMessages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: {
      messageData: { messageData: { messageId: string }[]; from: string };
    }) => {
      return api.delete("/mailbox/adminDeleteMail", { data: messageData });
    },
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ["totalCounts"] });
      await queryClient.invalidateQueries({ queryKey: ["allUserMail"] });

      toast.success(response?.data?.message);
    },
    onError: (error: unknown) => {
      let message = "Failed to Delete Message ";

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
