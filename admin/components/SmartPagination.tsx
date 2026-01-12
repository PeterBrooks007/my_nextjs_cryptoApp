import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type PaginationProps = {
  page: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
};

export function SmartPagination({
  page,
  totalItems,
  rowsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const createPaginationRange = (): (number | "...")[] => {
    const totalNumbers = 5; // max page numbers visible (including ends)
    const range: (number | "...")[] = [];

    if (totalPages <= totalNumbers) {
      // show all pages if less than totalNumbers
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const left = Math.max(1, page - 1);
    const right = Math.min(totalPages - 2, page + 1);

    // Always include first and last pages
    if (page <= 2) {
      range.push(0, 1, 2, "...", totalPages - 1);
    } else if (page >= totalPages - 3) {
      range.push(0, "...", totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      range.push(0, "...", left, right, "...", totalPages - 1);
    }

    return range;
  };

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <Pagination className="justify-end pt-2">
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(page - 1)}
            aria-disabled={page === 0}
            className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {/* Page numbers */}
        {createPaginationRange().map((item, i) =>
          item === "..." ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={item === page}
                onClick={() => handlePageChange(item)}
                className="cursor-pointer"
              >
                {item + 1}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(page + 1)}
            aria-disabled={page >= totalPages - 1}
            className={
              page >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
