"use client";

import Link from "next/link";
import {
  Hash,
  Building2,
  User,
  Calendar,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ClientNameCell from "./ClientNameCell";
import DownloadQrAction from "./actions/DownloadQrAction";
import DownloadPdfAction from "./actions/DownloadPdfAction";

export default function ReceiptTableRow({ receipt, onDelete }) {
  return (
    <tr className="flex flex-col md:table-row hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-slate-200 dark:border-slate-800 odd:bg-slate-100/50 dark:odd:bg-white/5 last:border-0">
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
          <span className="font-medium flex items-center gap-1.5 -translate-y-px">
            <Calendar className="size-3.5 text-orange-500 hidden md:block" />
            {receipt.createdAt
              ? new Date(receipt.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </span>
          <span className="text-[10px] text-slate-400 md:ml-5">
            {receipt.createdAt
              ? new Date(receipt.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
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
            <Link href={`/pe/${receipt.shortCode}`} target="_blank">
              <Eye className="size-4" />
            </Link>
          </Button>

          {/* Download Actions */}
          <DownloadQrAction
            receiptNo={receipt.receiptNo}
            shortCode={receipt.shortCode}
          />
          <DownloadPdfAction data={receipt} shortCode={receipt.shortCode} />

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
            onClick={() => onDelete(receipt._id, receipt.receiptNo)}
            title="Delete Receipt"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
