"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Plus,
  Loader2,
  Eye,
  Pencil,
  Trash2,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteReceipt } from "@/app/actions/receipts/delete-receipt";
import { getReceipts } from "@/app/actions/receipts/get-receipts";
import { toast } from "sonner";

import ClientNameCell from "./ClientNameCell";
import DownloadQrAction from "./actions/DownloadQrAction";
import DownloadPdfAction from "./actions/DownloadPdfAction";

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
  const handleSearchChange = useCallback((e) => {
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
  }, []);

  const handlePageChange = async (newPage) => {
    setLoading(true);
    try {
      const result = await getReceipts({
        search: searchTerm,
        page: newPage,
        limit: 50,
      });
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ReceiptText className="size-6" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              All Receipts
            </h1>
          </div>
          <p className="text-muted-foreground ml-16">
            Manage and track all your issued insurance receipts in one place.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 md:self-end"
        >
          <Link href="/create">
            <Plus className="mr-2 size-5" />
            New Receipt
          </Link>
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <div className="grid gap-4 md:grid-cols-[1fr,auto]">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search by Receipt No, Client Name or Business..."
            className="pl-10 h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-blue-500 rounded-xl transition-all"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {loading && (
            <Loader2
              className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500"
              size={18}
            />
          )}
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-sm font-medium text-slate-600 dark:text-slate-400">
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            {total}
          </span>
          Total Records
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm shadow-sm overflow-hidden">
        {receipts.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-100 dark:bg-slate-900 size-20 rounded-2xl flex items-center justify-center mb-6 ring-8 ring-slate-50 dark:ring-slate-900/50">
              <Search className="text-slate-400" size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No matching receipts
            </h3>
            <p className="text-slate-500 mt-2 max-w-[280px]">
              We couldn't find any receipts matching your search criteria.
            </p>
            <Button
              variant="outline"
              className="mt-6 rounded-xl"
              onClick={() => {
                setSearchTerm("");
                handlePageChange(1);
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-separate border-spacing-0">
              <thead className="hidden md:table-header-group bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                    Receipt Details
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] w-[35%]">
                    Client / Business Info
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                    Created Date
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] text-right">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] text-right">
                    Management
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {receipts.map((receipt) => (
                  <tr
                    key={receipt._id}
                    className="flex flex-col md:table-row hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b md:border-b-0 border-slate-200 dark:border-slate-800 last:border-0"
                  >
                    <td
                      data-label="Receipt"
                      className="px-6 py-4 md:py-5 flex justify-between md:table-cell items-center before:content-[attr(data-label)] before:md:content-none before:font-bold before:text-slate-400 before:uppercase before:text-[10px]"
                    >
                      <div className="flex flex-col md:items-start items-end">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">
                          {receipt.receiptNo}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase mt-0.5 tracking-tight">
                          #{receipt.shortCode}
                        </span>
                      </div>
                    </td>
                    <td
                      data-label="Client Info"
                      className="px-6 py-4 md:py-5 flex justify-between md:table-cell items-center before:content-[attr(data-label)] before:md:content-none before:font-bold before:text-slate-400 before:uppercase before:text-[10px]"
                    >
                      <div className="md:w-full text-right md:text-left">
                        <ClientNameCell
                          rawText={receipt.receivedFrom}
                          storedName={receipt.clientName}
                        />
                      </div>
                    </td>
                    <td
                      data-label="Created"
                      className="px-6 py-4 md:py-5 flex justify-between md:table-cell items-center before:content-[attr(data-label)] before:md:content-none before:font-bold before:text-slate-400 before:uppercase before:text-[10px] whitespace-nowrap"
                    >
                      <div className="flex flex-col md:items-start items-end">
                        <span className="font-medium">
                          {receipt.createdAt
                            ? new Date(receipt.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {receipt.createdAt
                            ? new Date(receipt.createdAt).toLocaleTimeString(
                                "en-GB",
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : ""}
                        </span>
                      </div>
                    </td>
                    <td
                      data-label="Total"
                      className="px-6 py-4 md:py-5 flex justify-between md:table-cell items-center before:content-[attr(data-label)] before:md:content-none before:font-bold before:text-slate-400 before:uppercase before:text-[10px] text-right whitespace-nowrap"
                    >
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold text-base">
                        ৳ {parseFloat(receipt.total || 0).toLocaleString()}
                      </span>
                    </td>
                    <td
                      data-label="Actions"
                      className="px-6 py-4 md:py-5 flex justify-between md:table-cell items-center before:content-[attr(data-label)] before:md:content-none before:font-bold before:text-slate-400 before:uppercase before:text-[10px]"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Action */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-xl border-cyan-500/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10"
                          asChild
                          title="View Receipt"
                        >
                          <Link
                            href={`/pe/${receipt.shortCode}`}
                            target="_blank"
                          >
                            <Eye className="size-4" />
                          </Link>
                        </Button>

                        {/* Download Actions */}
                        <DownloadQrAction
                          receiptNo={receipt.receiptNo}
                          shortCode={receipt.shortCode}
                        />
                        <DownloadPdfAction
                          data={receipt}
                          shortCode={receipt.shortCode}
                        />

                        {/* Edit Action */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-xl border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
                          asChild
                          title="Edit Receipt"
                        >
                          <Link href={`/edit/${receipt._id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>

                        {/* Delete Action */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-xl border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500"
                          onClick={() =>
                            handleDelete(receipt._id, receipt.receiptNo)
                          }
                          title="Delete Receipt"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <p className="text-sm text-slate-500 font-medium">
            Showing{" "}
            <span className="text-slate-900 dark:text-white font-bold">
              {receipts.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 dark:text-white font-bold">
              {total}
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
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl px-4 h-9 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 border-none font-semibold"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
