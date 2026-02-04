"use client";

import { Button } from "@/components/ui/button";

export default function ReceiptsPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsCount,
  onPageChange,
  loading,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      <p className="text-sm text-slate-500 font-medium">
        Showing{" "}
        <span className="text-slate-900 dark:text-white font-bold">
          {itemsCount}
        </span>{" "}
        of{" "}
        <span className="text-slate-900 dark:text-white font-bold">
          {totalItems}
        </span>{" "}
        receipts
      </p>
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4 h-9 font-semibold"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4 h-9 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 border-none font-semibold"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
