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
  Hash,
  Building2,
  User,
  Calendar,
  Banknote,
  Settings2,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomStatsCard } from "@/components/dashboard/CustomStatsCard";
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
      {/* Premium Header Wrapper (WelcomeBanner Aesthetic) */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-7 shadow-sm">
        {/* Background Decorator (Optional, keeping it clean for consistency) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-6">
          {/* Left Side: Icon & Title Area */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Logo/Icon Section */}
            <div className="relative shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50 shadow-inner">
                <ReceiptText className="size-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
                  Management Portal
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                All{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600">
                  Receipts
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-[400px] font-medium">
                Manage and track all your issued insurance receipts in one
                place.
              </p>
            </div>
          </div>

          {/* Right Side: Compact Stats & Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Compact Stats Card */}
            <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 min-w-[180px] shadow-xs group">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Records
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    {total.toLocaleString()}
                  </h2>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                    Recs
                  </span>
                </div>
              </div>
              <Receipt className="absolute -bottom-2 -right-2 size-14 text-slate-900/[0.03] dark:text-white/[0.03] group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-0 right-0 w-1 h-full bg-blue-500" />
            </div>

            <Button
              asChild
              size="lg"
              className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
            >
              <Link href="/create">
                <Plus className="mr-2 size-5" />
                New Receipt
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full">
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
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">
                    <div className="flex items-center gap-2">
                      <Hash className="size-3.5 text-blue-500" />
                      Receipt Details
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-3.5 text-purple-500" />
                      Company
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs w-[30%]">
                    <div className="flex items-center gap-2">
                      <User className="size-3.5 text-violet-500" />
                      Client Info
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 text-orange-500" />
                      Created Date
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Banknote className="size-3.5 text-emerald-500" />
                      Total Amount
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Settings2 className="size-3.5 text-slate-500" />
                      Management
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {receipts.map((receipt) => (
                  <tr
                    key={receipt._id}
                    className="flex flex-col md:table-row hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-slate-200 dark:border-slate-800 odd:bg-slate-100/50 dark:odd:bg-white/5 last:border-0"
                  >
                    <td
                      data-label="Receipt"
                      className="px-6 py-4 md:py-5 flex justify-between md:table-cell items-center before:content-[attr(data-label)] before:md:content-none before:font-bold before:text-slate-400 before:uppercase before:text-[10px]"
                    >
                      <div className="flex flex-col md:items-start items-end">
                        <div className="flex items-center gap-2">
                          <Hash className="size-4 text-blue-500 hidden md:block" />
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">
                            {receipt.receiptNo}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 uppercase mt-0.5 tracking-tight md:ml-6">
                          #{receipt.shortCode}
                        </span>
                      </div>
                    </td>
                    <td
                      data-label="Company"
                      className="px-6 py-4 md:py-5 flex justify-between md:table-cell items-center before:content-[attr(data-label)] before:md:content-none before:font-bold before:text-slate-400 before:uppercase before:text-[10px]"
                    >
                      <div className="flex md:justify-start justify-end">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            receipt.companyType === "GLOBAL"
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : receipt.companyType === "FEDERAL"
                                ? "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                          )}
                        >
                          <Building2 className="size-2.5" />
                          {receipt.companyType === "GLOBAL"
                            ? "Global Insurance"
                            : receipt.companyType === "FEDERAL"
                              ? "Federal Insurance"
                              : "Takaful Insurance"}
                        </span>
                      </div>
                    </td>
                    <td
                      data-label="Client Info"
                      className="px-6 py-4 md:py-5 flex justify-between md:table-cell items-center before:content-[attr(data-label)] before:md:content-none before:font-bold before:text-slate-400 before:uppercase before:text-[10px]"
                    >
                      <div className="md:w-full text-right md:text-left flex md:items-center justify-end md:justify-start gap-2">
                        <User className="size-4 text-violet-500 hidden md:block shrink-0" />
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
                        <span className="font-medium flex items-center gap-1.5 translate-y-[-1px]">
                          <Calendar className="size-3.5 text-orange-500 hidden md:block" />
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
                        <span className="text-[10px] text-slate-400 md:ml-5">
                          {receipt.createdAt
                            ? new Date(receipt.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              },
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
