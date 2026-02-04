"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReceiptsEmptyState({ onClearSearch }) {
  return (
    <div className="p-20 flex flex-col items-center justify-center text-center">
      <div className="bg-slate-100 dark:bg-slate-900 size-20 rounded-2xl flex items-center justify-center mb-6 ring-8 ring-slate-50 dark:ring-slate-900/50">
        <Search className="text-slate-400" size={36} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        No matching receipts
      </h3>
      <p className="text-slate-500 mt-2 max-w-70">
        We couldn&apos;t find any receipts matching your search criteria.
      </p>
      <Button
        variant="outline"
        className="mt-6 rounded-xl"
        onClick={onClearSearch}
      >
        Clear Search
      </Button>
    </div>
  );
}
