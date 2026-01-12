import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

// type DeleteNotificationPayload = {
//   id: string | undefined; // user ID
//   formData: {
//     userId: string | undefined;
//     notificationData: {
//       notificationId: string | undefined;
//     };
//   };
// };

export const useUsers = () => {
  const queryClient = useQueryClient();

  const {
    data: allUsersData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      try {
        const response = await api.get("/users/getAllUsers");
        // console.log(response.data);
        return response;
      } catch (error) {
        console.log("Failed to fetch Users", error);
      }
    },
    select: (res) => res?.data,
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes (prevents refetch)
    gcTime: 1000 * 60 * 10, // keep alive for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // delete Notification Mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      const { data } = await api.delete(`/users/adminDeleteUser/${id}`);

      if (data?.message) {
        toast.success(data.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["totalCounts"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });

  const deleteUser = (id: string | undefined) => {
    deleteUserMutation.mutate(id);
  };

  return {
    allUsers: allUsersData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteUser,
    isDeletingUser: deleteUserMutation.isPending,
  };
};
