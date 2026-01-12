import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";
import { User } from "@/types";

type LockFormData = {
  generalLock: boolean;
  upgradeLock: boolean;
  signalLock: boolean;
};

type AdminLockAccountParams = {
  id: string;
  formData: LockFormData;
};

export const useUser = (id: string) => {
  const queryClient = useQueryClient();

  // Query singleUservData
  const {
    data: usersData = null,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      try {
        const response = await api.get("/users/getSingleUser/" + id);
        // console.log("response",response);
        return response;
      } catch (error) {
        console.log("Failed to fetch Users", error);
      }
    },
    enabled: !!id, // ensures id exists before fetching
    select: (res) => res?.data,
  });

  // adminLockAccount Mutation
  const adminLockAccountMutation = useMutation({
    mutationFn: ({ id, formData }: AdminLockAccountParams) =>
      api.patch(`/users/adminLockAccount/${id}`, formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", id] });
      toast.success("Lock/Unlock has been updated");
    },
    onError: (err) => {
      let message = "Something went wrong";
      // ✅ Safe type narrowing (no any, no explicit AxiosError type needed)
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? err.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      // console.log(err);
      toast.error(message);
    },
  });

  const adminLockAccount = ({ id, formData }: AdminLockAccountParams) => {
    adminLockAccountMutation.mutate({ id, formData });
  };

  return {
    singleUser: usersData as User,
    isLoading,
    error,
    refetch,
    isRefetching,
    adminLockAccount,
    adminLockAccountLoading: adminLockAccountMutation.isPending,
  };
};
