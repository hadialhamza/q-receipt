"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Eye, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteReceipt } from "@/app/actions/receipts/delete-receipt";
import { toast } from "sonner";

export default function ReceiptsTable({
  initialReceipts,
  initialTotal,
  initialPage = 1,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debounceTimer = useRef(null);

  // Extract client name from receivedFrom
  const extractClientName = (receivedFrom) => {
    if (!receivedFrom) return "N/A";
    const firstLine = receivedFrom.split("\n")[0];
    return firstLine.length > 50
      ? firstLine.substring(0, 50) + "..."
      : firstLine;
  };

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
          params.set("search", value);
          params.set("page", "1");
        } else {
          params.delete("search");
          params.delete("page");
        }

        startTransition(() => {
          router.push(`/receipts?${params.toString()}`);
        });
      }, 500);
    },
    [router, searchParams],
  );

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    startTransition(() => {
      router.push(`/receipts?${params.toString()}`);
    });
  };

  const handleDelete = async (id, receiptNo) => {
    if (!confirm(`Are you sure you want to delete receipt ${receiptNo}?`)) {
      return;
    }

    const result = await deleteReceipt(id);
    if (result.success) {
      toast.success("Receipt deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete receipt");
    }
  };

  const totalPages = Math.ceil(initialTotal / 50);
  const currentPage = initialPage;

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
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {initialReceipts.length === 0 ? (
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
                  <th className="px-6 py-4 font-semibold">Receipt No</th>
                  <th className="px-6 py-4 font-semibold">Client Name</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {initialReceipts.map((receipt) => (
                  <tr
                    key={receipt._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-medium text-muted-foreground">
                      {receipt.receiptNo}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {extractClientName(receipt.receivedFrom)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(
                        receipt.date || receipt.createdAt,
                      ).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ৳ {parseFloat(receipt.total || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          asChild
                        >
                          <Link href={`/pe/${receipt.shortCode}`} target="_blank">
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          asChild
                        >
                          <Link href={`/edit/${receipt._id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            handleDelete(receipt._id, receipt.receiptNo)
                          }
                        >
                          <Trash2 className="size-4" />
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
            Page {currentPage} of {totalPages} ({initialTotal} total receipts)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isPending}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isPending}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
