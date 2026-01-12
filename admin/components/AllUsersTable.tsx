"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Pen,
  Trash,
  Lock,
  Globe,
  Phone,
  SearchIcon,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useWindowSize from "@/hooks/useWindowSize";
import { timeAgo } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

import { SmartPagination } from "./SmartPagination";
import { useUsers } from "@/hooks/useUsers";
import { Skeleton } from "./ui/skeleton";
import { User } from "@/types";

export default function AllUsersTable() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);
  const router = useRouter();
  const size = useWindowSize();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    allUsers,
    isLoading,
    refetch,
    isRefetching,
    deleteUser,
    isDeletingUser,
  } = useUsers();

  const [value, setValue] = useState("all");

  let allUservalue;

  if (value === "all") {
    allUservalue = Array.isArray(allUsers)
      ? allUsers
          .filter((user) => user?.role !== "admin") // Filter out admins
          .sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0)) // Sort by isOnline, online users first
      : [];
  } else if (value === "active") {
    allUservalue = Array.isArray(allUsers)
      ? allUsers.filter(
          (user) => user?.role !== "admin" && user?.isOnline === true
        )
      : [];
  } else {
    allUservalue = Array.isArray(allUsers)
      ? allUsers.filter((user) => user?.isOnline === false)
      : [];
  }

  const all = Array.isArray(allUsers)
    ? allUsers.filter((user) => user?.role !== "admin")
    : [];

  const active = Array.isArray(allUsers)
    ? allUsers.filter(
        (user) => user?.isOnline === true && user?.role !== "admin"
      )
    : [];

  const inactiveLength = Array.isArray(allUsers)
    ? allUsers.filter(
        (user) => user?.isOnline === false && user?.role !== "admin"
      )
    : [];

  // filter out user where appropriate (matching original)
  const filteredUsers = allUservalue.filter((user) => {
    if (user?.role === "admin") return false;
    const term = search.toLowerCase();
    return (
      user.firstname?.toLowerCase().includes(term) ||
      user.lastname?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // delete Users
  const deleteUserFunc = async () => {
    await deleteUser(selectedUser?._id);

    setOpenDelete(false);
    setSelectedUser(null);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/users/${id}`);
  };

  // small helper for card shadow + bg
  const cardBg = "bg-primary-foreground";
  const cardShadow = "shadow-sm";

  if (pageLoading || isLoading || isRefetching || isDeletingUser) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Set States */}
          <div className="flex flex-row gap-2 my-2 ml-0 mt-0">
            <Skeleton className="w-16 h-9" />
            <Skeleton className="w-22 h-9" />
            <Skeleton className="w-22 h-9" />
            <Skeleton className="w-12 xs:w-22 h-9" />
          </div>

          {/* Search input */}
          <div className="w-full lg:w-[300px]  h-9">
            <Skeleton className="w-full lg:w-[300px] h-9" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* === Top Bar === */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Set States */}
        <div className="flex flex-row gap-2 my-2 ml-0 mt-0">
          <Button
            variant="outline"
            className="border-orange-500 text-[12px] sm:text-[14px]"
            onClick={() => setValue("all")}
          >
            <Users size={25} color="orange" />
            All <span className="hidden xs:inline-flex">{all.length}</span>
          </Button>

          <Button
            variant="outline"
            className="border-green-500 text-[12px] sm:text-[14px]"
            onClick={() => setValue("active")}
          >
            <CheckCircle size={25} color="green" />
            Active{" "}
            <span className="hidden sm:inline-flex">{active.length}</span>
          </Button>

          <Button
            variant="outline"
            className="border-gray-500 text-[12px] sm:text-[14px]"
            onClick={() => setValue("inactive")}
          >
            <XCircle size={25} color="gray" />
            Inactive{" "}
            <span className="hidden sm:inline-flex">
              {inactiveLength.length}
            </span>
          </Button>

          <Button
            variant="outline"
            className=" border-gray-500 text-[12px] sm:text-[14px]"
            onClick={() => refetch()}
          >
            <RefreshCw size={18} color="gray" />
            <span className="hidden xs:flex">Refresh</span>
          </Button>
        </div>

        {/* Search input */}
        <div className="w-full lg:w-[300px]  h-9">
          <InputGroup>
            <InputGroupInput
              placeholder="Search user"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      {/* === Large screen: Cards Grid (size.width > 899) === */}
      {size.width && size.width > 899 && (
        <div className="pt-2 px-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedUsers.map((user) => (
              <div
                key={user._id}
                className={`${cardBg} ${cardShadow} p-3 rounded-lg border`}
              >
                {/* Top row: checkbox + status badge + actions */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      aria-label={`select-${user._id}`}
                      className="h-4 w-4"
                    />
                    <span
                      className={`text-xs font-medium inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                        user.isOnline
                          ? "bg-green-400 text-green-950"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {user.isOnline ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {user.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      aria-label="edit"
                      className="p-1 rounded-md border-2 border-green-500 hover:bg-green-50"
                      onClick={() => handleEdit(user._id)}
                    >
                      <Pen className="h-4 w-4 text-green-600" />
                    </button>

                    <button
                      aria-label="delete"
                      className="p-1 rounded-md border-2 border-red-500 hover:bg-red-50"
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenDelete(true);
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Avatar + name/email */}
                <div className="flex flex-col items-center gap-2 p-0.5">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                      <AvatarImage
                        src={user.photo}
                        alt={`${user.firstname} ${user.lastname}`}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {user.firstname?.[0]}
                        {user.lastname?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* online indicator with ping */}
                    {user.isOnline && (
                      <span className="absolute right-2.5 bottom-2 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 ring-2 ring-white dark:ring-slate-800"></span>
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <div className=" md:text-lg font-medium">
                      {user.firstname} {user.lastname}
                    </div>
                    <div className="text-xs md:text-base text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Info box */}
                <div className="mt-3 rounded-md px-2 py-2 bg-secondary border-2">
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    <Globe className="h-4 w-4" />
                    <div>Country: {user.address?.country}</div>
                    <Avatar className="h-5 w-5 ml-auto">
                      <AvatarImage
                        src={`https://flagcdn.com/w80/${user?.address?.countryFlag}.png`}
                        alt={`country flag`}
                      />
                      <AvatarFallback>
                        <Globe className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone: {user.phone}
                  </div>

                  <div className="text-sm flex items-center gap-2 line-clamp-1">
                    <Lock className="h-4 w-4" />
                    Password: {user.password}
                  </div>

                  <div className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Last seen:{" "}
                    {user.lastSeen === null ? "now" : timeAgo(user.lastSeen)}
                  </div>
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  Joined on{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Small screen / table view (size.width <= 899) === */}
      {size.width && size.width <= 899 && (
        <div className="border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-600 text-white">
                <TableHead className="text-white font-bold">User</TableHead>
                <TableHead className="text-white font-bold hidden lg:table-cell">
                  Contact
                </TableHead>
                <TableHead className="text-white font-bold hidden lg:table-cell">
                  Country
                </TableHead>
                {/* <TableHead className="text-white font-bold">Password</TableHead> */}
                {/* <TableHead className="text-white font-bold">Status</TableHead> */}
                <TableHead className="text-white font-bold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar
                        className="h-16 w-16 border-2 border-primary"
                        onClick={() =>
                          router.push(`/dashboard/users/${user._id}`)
                        }
                      >
                        <AvatarImage
                          src={user.photo}
                          alt={user.firstname}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {user.firstname?.[0]}
                          {user.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base font-semibold">
                          {user.firstname} {user.lastname}
                        </div>
                        <div className="lg:hidden w-34 xs:w-48 text-sm   truncate">
                          {user.email}
                        </div>

                        <div className="text-xs text-muted-foreground mt-1">
                          {user.isOnline ? (
                            <Badge className="bg-green-500 text-white flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Online
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-700 text-white flex items-center gap-1">
                              <XCircle className="h-3 w-3" /> Offline
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm">{user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.phone}
                    </div>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={`https://flagcdn.com/w80/${user?.address?.countryFlag}.png`}
                          alt={`country flag`}
                        />
                        <AvatarFallback>
                          <Globe className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      {user.address?.country}
                    </div>
                  </TableCell>

                  {/* <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Lock className="h-4 w-4" /> {user.password}
                    </div>
                  </TableCell> */}

                  {/* <TableCell>
                    {user.isOnline ? (
                      <Badge className="bg-green-500 text-white flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Online
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-700 text-white flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Offline
                      </Badge>
                    )}
                  </TableCell> */}

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-green-500 hover:bg-green-100"
                        onClick={() => handleEdit(user._id)}
                      >
                        <Pen className="h-4 w-4 text-green-600" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="border-red-500 hover:bg-red-100"
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* DELETE USER DIALOG */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Delete {selectedUser?.firstname} {selectedUser?.lastname}?
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all user data?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                deleteUserFunc();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PAGINATION */}
      {size.width && (
        <SmartPagination
          page={page}
          totalItems={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
