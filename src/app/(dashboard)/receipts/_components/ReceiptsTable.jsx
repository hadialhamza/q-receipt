"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ReceiptText, Hash, Building2, User, Calendar, Banknote, Settings2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import { deleteReceipt } from "@/app/actions/receipts/delete-receipt";
import { getReceipts } from "@/app/actions/receipts/get-receipts";
import { toast } from "sonner";

// Sub-components
import ReceiptsSearchBar from "./ReceiptsSearchBar";
import ReceiptsEmptyState from "./ReceiptsEmptyState";
import ReceiptTableRow from "./ReceiptTableRow";
import ReceiptsPagination from "./ReceiptsPagination";

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
      handlePageChange(currentPage);
    } else {
      toast.error(result.error || "Failed to delete receipt");
    }
  };

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <PageHeader
        title="All"
        highlightWord="Receipts"
        description="Manage and track all your issued insurance receipts in one place."
        icon={ReceiptText}
        stats={{
          label: "Total Records",
          value: total.toLocaleString(),
          unit: "Recs",
          Icon: Receipt,
        }}
      >
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
      </PageHeader>

      <ReceiptsSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        loading={loading}
      />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm shadow-sm overflow-hidden">
        {receipts.length === 0 ? (
          <ReceiptsEmptyState
            onClearSearch={() => {
              setSearchTerm("");
              handlePageChange(1);
            }}
          />
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
                  <ReceiptTableRow
                    key={receipt._id}
                    receipt={receipt}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReceiptsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        itemsCount={receipts.length}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}
