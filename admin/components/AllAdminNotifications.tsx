"use client";

import { useState } from "react";
import { Bell, Trash2, RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { timeAgo } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { Spinner } from "./ui/spinner";
import { useTotalCounts } from "@/hooks/useTotalCounts";

export default function AllAdminNotifications({
  showAllNotification,
}: {
  showAllNotification: boolean;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedNotificationID, setSelectedNotificationID] = useState<{
    userId: string;
    notificationId: string;
  } | null>(null);

  const {
    notifications,
    isLoading,
    deleteNotification,
    refetch,
    isRefetching,
    isDeletingNotification,
    clearNotification,
    isClearingNotification,
  } = useNotifications();

  const { refetch: refetchTotalCount } = useTotalCounts();

  let AllNotifications;

  if (showAllNotification) {
    AllNotifications = Array.isArray(notifications)
      ? notifications?.slice().sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime(); // ✅ Fix
        })
      : [];
  } else {
    AllNotifications = Array.isArray(notifications)
      ? notifications
          ?.slice()
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime(); // ✅ Fix
          })
          .slice(0, 3)
      : [];
  }

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    const formData = {
      userId: selectedNotificationID?.userId,
      notificationData: {
        notificationId: selectedNotificationID?.notificationId,
      },
    };
    const id = selectedNotificationID?.userId;
    const payload = { id, formData };

    deleteNotification(payload);

    setOpenDeleteDialog(false);
  };

  const handleClearAll = () => {
    if (notifications.length === 0) {
      toast.error("No notifications to clear");
      return;
    }
    clearNotification();
    // toast.success("All notifications cleared");
  };

  const handleRefresh = () => {
    refetch();
    refetchTotalCount();
  };

  return (
    <div className="w-full">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-lg">Notifications</h2>

            <Button
              size="sm"
              variant="outline"
              className="text-xs font-semibold text-green-600 border-green-600! mr-1"
            >
              {notifications.length} New
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearAll}
              className="text-xs"
            >
              Clear
            </Button>
            <Button
              size="icon"
              variant="outline"
              disabled={
                isRefetching || isDeletingNotification || isClearingNotification
              }
              onClick={handleRefresh}
              className="w-8 h-8"
            >
              {isRefetching || isDeletingNotification ? (
                <Spinner />
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-[400px]">
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {AllNotifications.map((n) => (
                <div
                  key={n._id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted transition"
                >
                  <Avatar className="bg-green-600">
                    <AvatarFallback>
                      <Bell className="w-4 h-4 " />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm sm:text-base">
                        {n.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedNotificationID({
                            userId: n?.userId?._id,
                            notificationId: n?._id,
                          });
                          handleDelete();
                        }}
                        className="w-7 h-7"
                        disabled={
                          isRefetching ||
                          isDeletingNotification ||
                          isClearingNotification
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    <p className="w-52 sm:w-72 text-xs sm:text-base text-muted-foreground line-clamp-4">
                      {n.message}
                    </p>
                    <p className="text-[10px] sm:text-[12px] font-semibold text-gray-500">
                      {timeAgo(new Date(n.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center text-center text-sm text-muted-foreground py-6">
              {isLoading ? (
                <div className="">
                  <Spinner />
                </div>
              ) : (
                "No Notifications"
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notification? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
