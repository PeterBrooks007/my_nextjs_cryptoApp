"use client";

import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersList() {
  // Example dataset
  const allUsers = [
    "David", "Sarah", "Michael", "Sophia", "Daniel", "Emma", "Chris", "Olivia",
    "Henry", "Ava", "Noah", "Mia", "Ethan", "Liam", "Zoe", "Leo", "Bella",
    "James", "Charlotte", "Lucas",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // rows per page

  const totalPages = Math.ceil(allUsers.length / pageSize);

  const currentData = allUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // reset back to page 1
  };

  return (
    <div className="space-y-6">

      {/* Rows Per Page Dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Items */}
      <ul className="space-y-2">
        {currentData.map((user, index) => (
          <li key={index} className="p-3 border rounded-md">
            {user}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>

          <PaginationItem>
            <PaginationPrevious
              onClick={() => goToPage(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => goToPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => goToPage(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>

    </div>
  );
}
