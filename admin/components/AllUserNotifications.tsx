"use client";

import { useState } from "react";
import { Bell, Trash2, RefreshCcw, PlusCircle, Edit2Icon } from "lucide-react";
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
import { timeAgo } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { useParams } from "next/navigation";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { NotificationType } from "@/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import AddUserNotifications from "./AddUserNotifications";
import EditUserNotifications from "./EditUserNotifications";

export default function AllUserNotifications({
  showAllNotification,
}: {
  showAllNotification: boolean;
}) {
  const [openAddNotification, setOpenAddNotification] = useState(false);
  const [openEditNotification, setOpenEditNotification] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationType | null>(null);

  const params = useParams();
  const id = params?.userId as string;

  const {
    notifications,
    isLoading,
    deleteNotification,
    refetch,
    isRefetching,
    addUserNotification,
    isAddingUserNotification,
    updateUserNotification,
    isUpdatingUserNotification,
    isDeletingNotification,
  } = useUserNotifications(id);

  // console.log("notifications", notifications);

  let AllNotifications;

  if (showAllNotification) {
    AllNotifications = Array.isArray(notifications[0]?.notifications)
      ? notifications[0]?.notifications
          ?.filter(
            (notification: NotificationType) =>
              notification.to !== "Support Team"
          )
          .slice()
          .sort((a: NotificationType, b: NotificationType) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime(); // ✅ Fix
          })
      : [];
  } else {
    AllNotifications = Array.isArray(notifications[0]?.notifications)
      ? notifications[0]?.notifications
          .filter(
            (notification: NotificationType) =>
              notification.to !== "Support Team"
          )
          ?.slice()
          .sort((a: NotificationType, b: NotificationType) => {
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
      userId: id,
      notificationData: {
        notificationId: selectedNotification?._id,
      },
    };
    const payload = { id, formData };

    deleteNotification(payload);

    setOpenDeleteDialog(false);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isAddingUserNotification || isUpdatingUserNotification) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <CardContent className="px-4">
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
              {isLoading ? <Spinner /> : AllNotifications.length}
              New
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setOpenAddNotification(true);
              }}
              className="text-xs"
            >
              <PlusCircle />
              Add
            </Button>
            <Button
              size="icon"
              variant="outline"
              disabled={isRefetching || isDeletingNotification}
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
              {AllNotifications.map((n: NotificationType) => (
                <div
                  key={n._id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted transition"
                >
                  <Avatar className="bg-green-600 ">
                    <AvatarFallback>
                      <Bell className="w-4 h-4 " />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm sm:text-base">
                        {n.title}
                      </h3>

                      <div className="flex gap-2 ">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedNotification(n);
                            setOpenEditNotification(true);
                          }}
                          className="w-7 h-7"
                          disabled={isRefetching || isDeletingNotification}
                        >
                          <Edit2Icon className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedNotification(n);
                            handleDelete();
                          }}
                          className="w-7 h-7"
                          disabled={isRefetching || isDeletingNotification}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
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

      {/* ADD NOTIFICATION */}
      <Sheet open={openAddNotification} onOpenChange={setOpenAddNotification}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Add Notificationt</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-0">
              <AddUserNotifications
                addUserNotification={addUserNotification}
                setOpenAddNotification={setOpenAddNotification}
              />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* EDIT NOTIFICATION */}
      <Sheet open={openEditNotification} onOpenChange={setOpenEditNotification}>
        <SheetContent className="w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="">Edit Notificationt</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            <div className="mx-0">
              <EditUserNotifications
                updateUserNotification={updateUserNotification}
                setOpenEditNotification={setOpenEditNotification}
                selectedNotification={selectedNotification}
              />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* DELETE NOTIFICATION  */}
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
