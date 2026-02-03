"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteReceipt } from "@/app/actions/receipts/delete-receipt";
import { getReceipts } from "@/app/actions/receipts/get-receipts";
import { toast } from "sonner";

import ClientNameCell from "./ClientNameCell";

export default function ReceiptsTable({
  initialReceipts,
  initialTotal,
  initialPage = 1,
}) {
  const [receipts, setReceipts] = useState(initialReceipts);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);

  const router = useRouter();
  const debounceTimer = useRef(null);

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        setLoading(true);
        try {
          // Fetch new data based on search term (Server Action)
          const result = await getReceipts({ search: value, page: 1, limit: 50 });
          if (result.success) {
            setReceipts(result.data);
            setTotal(result.total);
            setCurrentPage(1);
          } else {
            toast.error("Failed to search receipts");
          }
        } catch (error) {
          console.error(error);
          toast.error("Something went wrong");
        } finally {
          setLoading(false);
        }
      }, 500);
    },
    []
  );

  const handlePageChange = async (newPage) => {
    setLoading(true);
    try {
      const result = await getReceipts({ search: searchTerm, page: newPage, limit: 50 });
      if (result.success) {
        setReceipts(result.data);
        setTotal(result.total);
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      toast.error("Failed to change page");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, receiptNo) => {
    if (!confirm(`Are you sure you want to delete receipt ${receiptNo}?`)) {
      return;
    }

    const result = await deleteReceipt(id);
    if (result.success) {
      toast.success("Receipt deleted successfully");
      // Refresh current view
      handlePageChange(currentPage);
    } else {
      toast.error(result.error || "Failed to delete receipt");
    }
  };

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">All Receipts</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your issued receipts
          </p>
        </div>
        <Button asChild>
          <Link href="/create">
            <Plus className="mr-2 size-4" />
            New Receipt
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="rounded-lg border bg-card p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search by Receipt No or Client Name..."
            className="pl-10 h-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" size={16} />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {receipts.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-muted size-16 rounded-full flex items-center justify-center mb-4">
              <Search className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-lg font-semibold">No receipts found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try changing your search or create a new receipt
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Receipt No</th>
                  <th className="px-6 py-4 font-semibold w-1/3">Client / Business Name</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Date of Edit</th>
                  <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Amount</th>
                  <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {receipts.map((receipt) => (
                  <tr
                    key={receipt._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-blue-600 dark:text-blue-400">
                      {receipt.receiptNo}
                    </td>
                    <td className="px-6 py-4">
                      <ClientNameCell rawText={receipt.receivedFrom} />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(receipt.date || receipt.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-right whitespace-nowrap">
                      ৳ {parseFloat(receipt.total || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
                          asChild
                        >
                          <Link href={`/pe/${receipt.shortCode}`} target="_blank">
                            <span className="font-medium">View</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                          asChild
                        >
                          <Link href={`/edit/${receipt._id}`}>
                            <span className="font-medium">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                          onClick={() =>
                            handleDelete(receipt._id, receipt.receiptNo)
                          }
                        >
                          <span className="font-medium">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({total} total receipts)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
