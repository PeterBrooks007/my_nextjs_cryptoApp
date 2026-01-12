"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Inbox as InboxIcon,
  Mail,
  Send,
  Trash2,
  Layers,
  Users,
  ShoppingBag,
  Tag,
  Bell,
  RefreshCcw,
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  Clock,
  Box,
  PanelRightClose,
  RefreshCw,
  SearchIcon,
  Star,
  X,
  Trash,
  MailOpen,
  Check,
  CheckCheck,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import { cn, timeAgo } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useWindowSize from "@/hooks/useWindowSize";
import {
  useDeleteArrayOfMessages,
  useDeleteMail,
  useMailInbox,
  useMailSent,
  useMailStarred,
  useMarkasReadArrayOfMessages,
  useMarkasreadOnViewMail,
  useStarredMail,
} from "@/hooks/useMailbox";
import { MailboxType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { SmartPagination } from "@/components/SmartPagination";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import ComposeNewMessage from "@/components/ComposeNewMessage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type FolderKey =
  | "inbox"
  | "drafts"
  | "sent"
  | "junk"
  | "trash"
  | "starred"
  | "social"
  | "updates"
  | "forums"
  | "shopping"
  | "promotions";

type SelectedMessage = {
  messageId: string;
  userId: string;
};

/* -------------------------
   Main Mailbox component
------------------------- */
export default function Mailbox() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [openCompose, setOpenCompose] = useState(false);
  const size = useWindowSize();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread">("all");
  const [activeFolder, setActiveFolder] = useState<FolderKey>("inbox");

  // Fetch mailboxes using custom hook
  const {
    allMailInbox,
    isLoading: isAllMailInboxLoading,
    refetch: refetchInbox,
    isRefetching: isInboxRefetching,
  } = useMailInbox();
  const {
    allMailSent,
    isLoading: isAllMailSentLoading,
    refetch: refetchSent,
    isRefetching: isSentRefetching,
  } = useMailSent(activeFolder);
  const {
    allMailStarred,
    isLoading: isAllMailStarredLoading,
    refetch: refetchStarred,
    isRefetching: isStarredRefetching,
  } = useMailStarred(activeFolder);

  // hooks to mutate
  const { mutate: starredMailMutate, isPending: starredMailIsPending } =
    useStarredMail();

  const { mutate: markAsReadOnViewMutate } = useMarkasreadOnViewMail();

  const {
    mutate: markasReadArrayOfMessagesMutate,
    isPending: markasReadArrayOfMessagesIsPending,
  } = useMarkasReadArrayOfMessages();

  const {
    mutate: deleteArrayOfMessagesMutate,
    isPending: deleteArrayOfMessagesIsPending,
  } = useDeleteArrayOfMessages();

  // Memoize folder data to map folder names to their emails
  const folderData: Record<FolderKey, MailboxType[]> = useMemo(
    () => ({
      inbox: allMailInbox,
      sent: allMailSent,
      starred: allMailStarred,

      drafts: [],
      junk: [],
      trash: [],
      social: [],
      updates: [],
      forums: [],
      shopping: [],
      promotions: [],
    }),
    [allMailInbox, allMailSent, allMailStarred]
  );

  // Get the list of emails for the currently active folder
  const activeList = useMemo(() => {
    return folderData[activeFolder] || [];
  }, [folderData, activeFolder]);

  // Find the currently selected email by ID
  const selectedEmail = useMemo(
    () => activeList.find((m) => m._id === selectedId),
    [activeList, selectedId]
  );

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);

  // Reset page number when folder, filter, or search query changes
  useEffect(() => {
    setTimeout(() => {
      setPage(0);
    }, 0);
  }, [activeFolder, filterType, searchQuery]);

  // Apply filtering and search
  const filteredList = useMemo(() => {
    let list = activeList;

    if (filterType === "unread") {
      list = list.filter((msg) => !msg.isRead);
    }

    if (!searchQuery) return list;

    const lowerQuery = searchQuery.toLowerCase();

    return list.filter(
      (msg) =>
        msg.subject.toLowerCase().includes(lowerQuery) ||
        msg.content.toLowerCase().includes(lowerQuery) ||
        `${msg.userId.firstname} ${msg.userId.lastname}`
          .toLowerCase()
          .includes(lowerQuery)
    );
  }, [activeList, searchQuery, filterType]);

  // Paginate filtered emails
  const paginatedFilteredList = filteredList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle URL hash change to update active folder
  useEffect(() => {
    function updateHash() {
      const hash = window.location.hash
        .replace("#", "")
        .toLowerCase() as FolderKey;

      if (hash in folderData) {
        setActiveFolder(hash);
      } else {
        setActiveFolder("inbox");
      }
    }

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [folderData]);

  // handle star message
  const handleStarredMail = (email: MailboxType) => {
    const selectmessageData = [
      { messageId: email?._id, userId: email?.userId._id },
    ];

    const messageData = {
      messageData: selectmessageData,
      from: `${activeFolder.toLowerCase()}Component`, //which component ? sentComponent or inboxComponent etc
    };

    starredMailMutate({ messageData });
  };

  // handle mark as red on View message
  const handleMarkasreadOnView = (email: MailboxType) => {
    const selectmessageData = [
      { messageId: email?._id, userId: email?.userId._id },
    ];

    const messageData = {
      messageData: selectmessageData,
      from: `${activeFolder.toLowerCase()}Component`, //which component ? sentComponent or inboxComponent etc
    };

    markAsReadOnViewMutate({ messageData });
  };

  // MULTIPLE SELECT SECTION

  const [selectedMessagesChecked, setselectedMessagesChecked] = useState<
    SelectedMessage[]
  >([]);

  const isAllSelected = selectedMessagesChecked.length === activeList.length;

  // Reset selectedMessagesChecked when folder, filter, or search query changes
  useEffect(() => {
    setTimeout(() => {
      setselectedMessagesChecked([]);
    }, 0);
  }, [activeFolder, filterType, searchQuery]);

  const [openDeleteSelectedMessageChecked, setDeleteSelectedMessageChecked] =
    useState(false);

  // Function to handle single checkbox change
  const handleSelectSingleMessageChecked = (message: MailboxType) => {
    const { _id: messageId, userId } = message;

    // Check if message is already selected
    const alreadySelected = selectedMessagesChecked.find(
      (mail) => mail.messageId === messageId
    );

    if (alreadySelected) {
      setselectedMessagesChecked(
        selectedMessagesChecked.filter((mail) => mail.messageId !== messageId)
      );
    } else {
      setselectedMessagesChecked([
        ...selectedMessagesChecked,
        { messageId, userId: userId._id },
      ]);
    }
  };

  // Function to handle master checkbox change
  const handleSelectAllMessage = (checked: boolean) => {
    if (checked) {
      const allMessages = activeList.map((message: MailboxType) => ({
        messageId: message._id,
        userId: message.userId._id,
      }));
      setselectedMessagesChecked(allMessages);
    } else {
      setselectedMessagesChecked([]);
    }
  };

  // Function to handle mark as read arrays of messages
  const handleMarkasreadSelectedMessage = async () => {
    const messageData = {
      messageData: selectedMessagesChecked,
      from: `${activeFolder.toLowerCase()}Component`,
    };

    await markasReadArrayOfMessagesMutate({ messageData });

    setselectedMessagesChecked([]);
    setDeleteSelectedMessageChecked(false);
  };

  // Function to handle delete arrays of messages
  const handleDeleteSelectedMessagesChecked = async () => {
    const messageData = {
      messageData: selectedMessagesChecked,
      from: `${activeFolder.toLowerCase()}Component`,
    };

    await deleteArrayOfMessagesMutate({ messageData });

    setselectedMessagesChecked([]);
    setDeleteSelectedMessageChecked(false);
  };

  if (pageLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Skeleton className="w-38 h-9" />
          <Skeleton className="w-24 h-9" />
        </div>
        <div className="w-full lg:w-[300px] h-9">
          <Skeleton className="w-full lg:w-[300px] h-9" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 sm:p-1 rounded-md">
      <div className="h-[75vh] xs:h-[78vh] sm:h-[80vh] rounded-md bg-card shadow-md border border-slate-200 dark:border-muted overflow-hidden flex relative">
        {/* LEFT SIDEBAR */}
        <aside className="hidden xl:flex flex-col gap-4 w-[260px] border-r border-slate-100 dark:border-muted p-4 ">
          <SidebarContent
            activeFolder={activeFolder}
            setOpenCompose={setOpenCompose}
          />
        </aside>

        {/* MIDDLE: Email list */}
        <section className="w-full xl:w-[350px] 2xl:w-[420px] border-r-0 xl:border-r border-slate-100 dark:border-muted flex flex-col">
          {/* Top header */}
          <div className="p-4 border-b border-slate-100 dark:border-muted flex items-center justify-between gap-3">
            <div className="flex gap-3 items-center">
              <PanelRightClose
                className="block xl:hidden size-5"
                onClick={() => setOpenSidebar(true)}
              />
              <h2 className="text-lg font-semibold">
                {activeFolder.charAt(0).toUpperCase() +
                  activeFolder.slice(1) +
                  `(${activeList.length})`}
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
              >
                All mail
              </Button>
              <Button
                size="sm"
                variant={filterType === "unread" ? "default" : "outline"}
                onClick={() => setFilterType("unread")}
              >
                Unread
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={
                  isInboxRefetching || isSentRefetching || isStarredRefetching
                }
                onClick={() => {
                  if (activeFolder === "inbox") refetchInbox?.();
                  if (activeFolder === "sent") refetchSent?.();
                  if (activeFolder === "starred") refetchStarred?.();
                }}
              >
                {isInboxRefetching ||
                isSentRefetching ||
                isStarredRefetching ? (
                  <Spinner />
                ) : (
                  <RefreshCw />
                )}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-100 dark:border-muted">
            <InputGroup>
              <InputGroupInput
                placeholder="Search messages"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Selected Message and delete */}
          {selectedMessagesChecked.length > 0 && (
            <div className="bg-secondary px-4 py-0.5 mt-4 mx-4 flex justify-between items-center border rounded-md">
              <p className="text-base text-white font-bold">
                {selectedMessagesChecked.length} Selected
              </p>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-white"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAllMessage}
                />
                {activeFolder === "inbox" && (
                  <Button
                    size={"icon-sm"}
                    variant={"ghost"}
                    disabled={selectedMessagesChecked.length === 0}
                    onClick={() => {
                      handleMarkasreadSelectedMessage();
                    }}
                  >
                    <MailOpen className="size-5!" />
                  </Button>
                )}

                <Button
                  size={"icon-sm"}
                  variant={"ghost"}
                  disabled={selectedMessagesChecked.length === 0}
                  onClick={() => {
                    setDeleteSelectedMessageChecked(true);
                  }}
                >
                  <Trash className="size-5!" />
                </Button>
              </div>
            </div>
          )}

          {/* Email list */}
          <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-hidden">
            <div className="flex flex-col gap-2">
              {isAllMailInboxLoading ||
              isAllMailSentLoading ||
              isAllMailStarredLoading ||
              starredMailIsPending ||
              deleteArrayOfMessagesIsPending ||
              markasReadArrayOfMessagesIsPending ? (
                <div className="grid gap-2">
                  {[1, 2].map((_, index) => (
                    <Skeleton key={index} className="w-full h-24 rounded-xl" />
                  ))}
                </div>
              ) : filteredList.length === 0 ? (
                <div className="text-center text-gray-400 mt-6">
                  No messages found.
                </div>
              ) : (
                paginatedFilteredList.map((message: MailboxType) => (
                  <article
                    key={message._id}
                    onClick={() => {
                      setSelectedId(message._id);
                      if (
                        message.from !== "Support Team" &&
                        message.isRead === false
                      ) {
                        handleMarkasreadOnView(message);
                      }
                      setOpenMessage(true);
                    }}
                    className={cn(
                      "bg-card border border-slate-200 dark:border-muted rounded-xl p-4 cursor-pointer transition hover:shadow-md",
                      selectedId === message._id ? "bg-muted" : ""
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold flex gap-2 items-center">
                          <Checkbox
                            checked={selectedMessagesChecked.some(
                              (mail) => mail.messageId === message?._id
                            )}
                            onCheckedChange={() => {
                              handleSelectSingleMessageChecked(message);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();

                              // handleSelectSingleMessageChecked(message);
                            }}
                          />
                          <div className="flex items-center gap-2">
                            {message.userId.firstname +
                              " " +
                              message.userId.lastname}
                            {message.from !== "Support Team" &&
                              message.isRead === false && (
                                <Badge className="p-1 rounded h-4 font-semibold">
                                  New
                                </Badge>
                              )}
                          </div>
                        </div>
                        <div className="text-sm text-slate-400 mt-1 font-medium">
                          {message.subject}
                        </div>
                      </div>
                      <div className="text-xs flex flex-col items-end">
                        {timeAgo(new Date(message?.createdAt).getTime())}

                        {message.from === "Support Team" ? (
                          message.isRead === false ? (
                            <Check className="size-5 text-gray-500" />
                          ) : (
                            <CheckCheck className="size-5 text-green-500" />
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-end gap-2">
                      <p className="text-sm dark:text-slate-300 mt-3 line-clamp-2">
                        {message.content}
                      </p>
                      <Button
                        variant={"ghost"}
                        size={"icon-sm"}
                        onClick={(e) => {
                          e.stopPropagation(); // <-- Prevent parent onClick
                          handleStarredMail(message);
                        }}
                      >
                        {message.isStarred ? (
                          <Star
                            className="size-5!"
                            size={24}
                            fill="gold"
                            stroke="none"
                          />
                        ) : (
                          <Star className="size-5!" size={24} />
                        )}
                      </Button>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* PAGINATION */}
            <SmartPagination
              page={page}
              totalItems={filteredList.length}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
            />

            <div className="h-20" />
          </ScrollArea>
        </section>

        {/* RIGHT: Email detail */}
        <main className="hidden xl:flex flex-1 flex-col">
          <EmailDetail email={selectedEmail} activeFolder={activeFolder} />
        </main>

        {/* Compose New Message */}
        {openCompose && (
          <div className="bg-card flex flex-col absolute right-0 lg:right-5 bottom-0 w-full lg:w-1/2 h-full lg:h-[70%]  rounded-none lg:rounded-t-xl shadow-2xl border-none lg:border overflow-hidden">
            {/* ComposeNewMessage Header */}
            <div className="bg-secondary flex justify-between items-center px-4 py-3">
              <div className="flex gap-2">
                <Mail />
                <p>Send Message</p>
              </div>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setOpenCompose(false)}
              >
                <X />
              </Button>
            </div>
            {/* ComposeNewMessage component */}
            <ComposeNewMessage composeMessageType="compose" />
          </div>
        )}
      </div>

      {/* Sidebar Mobile Sheet */}
      <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
        <SheetContent
          side="left"
          className="bg-card! w-[80%]! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300"
        >
          <SheetHeader className="border-b">
            <SheetTitle>
              <SidebarContent
                activeFolder={activeFolder}
                setOpenCompose={setOpenCompose}
                onItemClick={() => setOpenSidebar(false)}
              />
            </SheetTitle>
          </SheetHeader>
          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Mobile Message Sheet */}
      {size.width && size.width < 1280 && (
        <Sheet open={openMessage} onOpenChange={setOpenMessage}>
          <SheetContent
            side="right"
            className="bg-card! w-full! max-w-lg! data-[state=closed]:duration-300 data-[state=open]:duration-300"
          >
            <SheetHeader className="border-b">
              <SheetTitle>Read Message</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full overflow-y-auto flex flex-col">
              <EmailDetail email={selectedEmail} activeFolder={activeFolder} />
            </ScrollArea>
            <SheetFooter className="border-t">
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {/* DELETE SELECTED CHECK TRADING EXCHANGE DIALOG */}
      <Dialog
        open={openDeleteSelectedMessageChecked}
        onOpenChange={setDeleteSelectedMessageChecked}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {`Are you sure you want to delete ${selectedMessagesChecked.length} selected message(s)?`}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all this selected exchange&apos;s data?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteSelectedMessageChecked(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteSelectedMessagesChecked();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------
   SidebarItem helper
------------------------- */
function SidebarItem({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  count?: number | string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted cursor-pointer",
        active ? "bg-muted" : ""
      )}
      onClick={() => {
        window.location.hash = label.toLocaleLowerCase();
        if (onClick) onClick();
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-1 rounded-md",
            active ? "bg-slate-800 text-white" : "bg-transparent"
          )}
        >
          <Icon size={16} />
        </div>
        <span className="text-sm">{label}</span>
      </div>
      {count !== undefined && label.toLowerCase() === "inbox" && (
        <span className={cn("text-sm text-green-500 font-semibold")}>
          {count} new
        </span>
      )}
    </div>
  );
}

/* -------------------------
   SidebarContent
------------------------- */

function SidebarContent({
  activeFolder,
  setOpenCompose,
  onItemClick,
}: {
  activeFolder: FolderKey;
  setOpenCompose: React.Dispatch<React.SetStateAction<boolean>>;
  onItemClick?: () => void;
}) {
  const { unreadMessages } = useTotalCounts();

  const sidebarItemsTop = [
    { icon: InboxIcon, label: "Inbox", count: unreadMessages, key: "inbox" },
    { icon: Mail, label: "Drafts", count: "", key: "drafts" },
    { icon: Send, label: "Sent", key: "sent" },
    { icon: Bell, label: "Junk", count: "", key: "junk" },
    { icon: Trash2, label: "Trash", key: "trash" },
    { icon: Star, label: "Starred", key: "starred" },
  ];

  const sidebarItemsBottom = [
    { icon: Users, label: "Social", count: "", key: "social" },
    { icon: RefreshCcw, label: "Updates", count: "", key: "updates" },
    { icon: Layers, label: "Forums", count: "", key: "forums" },
    { icon: ShoppingBag, label: "Shopping", count: "", key: "shopping" },
    { icon: Tag, label: "Promotions", count: "", key: "promotions" },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center gap-3">
          <Button
            size="sm"
            className="w-full"
            onClick={() => {
              setOpenCompose(true);
              onItemClick?.();
            }}
          >
            Compose New Message
          </Button>
        </div>
      </div>

      <div className="h-px bg-muted" />

      <ScrollArea className="flex-1 mt-4">
        <nav className="space-y-4">
          <div className="space-y-2">
            {sidebarItemsTop.map((item) => (
              <SidebarItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                count={item.count}
                active={activeFolder === item.key}
                onClick={onItemClick}
              />
            ))}
          </div>

          <div className="h-px bg-muted" />

          <div className="space-y-2">
            {sidebarItemsBottom.map((item) => (
              <SidebarItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                count={item.count}
                active={activeFolder === item.key}
                onClick={onItemClick}
              />
            ))}
          </div>
        </nav>
      </ScrollArea>
    </>
  );
}

/* -------------------------
   EmailDetail component
------------------------- */
function EmailDetail({
  email,
  activeFolder,
}: {
  email: MailboxType | undefined;
  activeFolder: FolderKey;
}) {
  const { mutate, isPending } = useDeleteMail();
  const { mutate: starredMailMutate, isPending: starredMailIsPending } =
    useStarredMail();

  const [openDelete, setOpenDelete] = useState(false);

  // handle star message
  const handleStarredMail = () => {
    const selectmessageData = [
      { messageId: email?._id, userId: email?.userId._id },
    ];

    const messageData = {
      messageData: selectmessageData,
      from: `${activeFolder.toLowerCase()}Component`, //which component ? sentComponent or inboxComponent etc
    };

    starredMailMutate({ messageData });
  };

  // handle delete message
  const handleDeleteSelectedMessage = () => {
    const selectmessageData = [
      { messageId: email?._id, userId: email?.userId._id },
    ];

    const messageData = {
      messageData: selectmessageData,
      from: `${activeFolder.toLowerCase()}Component`, //which component ? sentComponent or inboxComponent etc
    };

    setOpenDelete(false);
    mutate({ messageData });
  };

  if (!email) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center text-gray-500 dark:text-gray-400">
        <Mail size={48} className="text-gray-300 dark:text-gray-600" />

        <h2 className="text-xl font-semibold">{`No ${activeFolder} messages selected`}</h2>

        <p className="max-w-xs">{`Select a message to view it here. Your emails will appear once you select one.`}</p>

        <Button variant="outline" size="sm">
          compose message
        </Button>
      </div>
    );
  }

  if (isPending || starredMailIsPending) {
    return (
      <div className="flex flex-1  justify-center items-center ">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <>
      <div className="p-4 border-b border-slate-100 dark:border-muted flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // <-- Prevent parent onClick
              handleStarredMail();
            }}
          >
            {email.isStarred ? (
              <Star className="size-5!" size={24} fill="gold" stroke="none" />
            ) : (
              <Star className="size-5!" size={24} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => setOpenDelete(true)}
          >
            {isPending ? <Spinner /> : <Trash2 size={16} />}
          </Button>
          <Button variant="ghost" size="sm">
            <Box size={16} />
          </Button>

          <Button variant="ghost" size="sm">
            <Clock size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <ArrowRight size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical size={16} />
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-muted flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-11 w-11 border-2">
            <AvatarImage
              src={email.userId.photo}
              alt={email.userId.firstname}
            />
            <AvatarFallback className="text-sm">
              {email.userId.firstname?.[0] + "" + email.userId.lastname?.[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                {email.userId.firstname + " " + email.userId.lastname}
              </h3>
            </div>
            <div className="text-sm text-gray-400 mt-1">{email.subject}</div>
            <span className="text-sm text-gray-400">
              Reply-To: {email.from}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {timeAgo(new Date(email?.createdAt).getTime())}
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-3xl leading-relaxed whitespace-pre-wrap">
          {email.content}
        </div>

        <div className="mt-8">
          <div className="text-sm text-slate-400">Attachments</div>
        </div>
      </ScrollArea>

      {/* DELETE SELECTED MESSAGE */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {`Are you sure you want to delete this message?`}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone.
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteSelectedMessage();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
