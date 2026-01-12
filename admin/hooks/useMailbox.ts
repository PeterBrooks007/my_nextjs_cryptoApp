import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

// useMailInbox hook
export const useMailInbox = () => {
  const queryClient = useQueryClient();

  const {
    data: allMailInboxData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["allMailInbox"],
    queryFn: async () => {
      try {
        const response = await api.get("/mailbox/getAllMailInbox");
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
    allMailInbox: allMailInboxData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};

// useMailSent hook
export const useMailSent = (folder: string) => {
  const {
    data: allMailSentData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["allMailSent"],
    queryFn: async () => {
      try {
        const response = await api.get("/mailbox/getAllMailSent");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch all Mail Inbox", error);
        throw error;
      }
    },
    select: (res) => res?.data,
    enabled: folder === "sent", // inbox loads by default, others wait
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes (prevents refetch)
    gcTime: 1000 * 60 * 10, // keep alive for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    allMailSent: allMailSentData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};

// useMailStarred hook
export const useMailStarred = (folder: string) => {
  const {
    data: allMailStarredData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["allMailStarred"],
    queryFn: async () => {
      try {
        const response = await api.get("/mailbox/getAllMailIsStarred");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch all Mail Inbox", error);
        throw error;
      }
    },
    select: (res) => res?.data,
    enabled: folder === "starred", // inbox loads by default, others wait
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes (prevents refetch)
    gcTime: 1000 * 60 * 10, // keep alive for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    allMailStarred: allMailStarredData || [],
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
      userId: string;
      messages: {
        to: string;
        from: string;
        subject: string;
        content: string;
      }[];
    }) => {
      return api.post("/mailbox/addmail", formData);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["allMailSent"] });

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
      if (response.data.from === "inboxComponent") {
        queryClient.invalidateQueries({ queryKey: ["allMailStarred"] });
        await queryClient.invalidateQueries({ queryKey: ["allMailInbox"] });
      }
      if (response.data.from === "sentComponent") {
        queryClient.invalidateQueries({ queryKey: ["allMailStarred"] });
        await queryClient.invalidateQueries({ queryKey: ["allMailSent"] });
      }
      if (response.data.from === "starredComponent") {
        queryClient.invalidateQueries({ queryKey: ["allMailSent"] });
        queryClient.invalidateQueries({ queryKey: ["allMailInbox"] });
        await queryClient.invalidateQueries({ queryKey: ["allMailStarred"] });
      }

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
      queryClient.invalidateQueries({ queryKey: ["allMailInbox"] });
      queryClient.invalidateQueries({ queryKey: ["totalCounts"] });
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
      if (response.data.from === "inboxComponent") {
        await queryClient.invalidateQueries({ queryKey: ["allMailInbox"] });
      }
      if (response.data.from === "sentComponent") {
        await queryClient.invalidateQueries({ queryKey: ["allMailSent"] });
      }

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
      await queryClient.invalidateQueries({ queryKey: ["allMailInbox"] });

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
      if (response.data.from === "inboxComponent") {
        queryClient.invalidateQueries({ queryKey: ["totalCounts"] });
        queryClient.invalidateQueries({ queryKey: ["allMailStarred"] });
        await queryClient.invalidateQueries({ queryKey: ["allMailInbox"] });
      }
      if (response.data.from === "sentComponent") {
        queryClient.invalidateQueries({ queryKey: ["allMailStarred"] });
        await queryClient.invalidateQueries({ queryKey: ["allMailSent"] });
      }
      if (
        response.data.from !== "sentComponent" ||
        response.data.from !== "inboxComponent"
      ) {
        queryClient.invalidateQueries({ queryKey: ["allMailStarred"] });
        queryClient.invalidateQueries({ queryKey: ["totalCounts"] });
        queryClient.invalidateQueries({ queryKey: ["allMailInbox"] });
        queryClient.invalidateQueries({ queryKey: ["allMailSent"] });
      }

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
