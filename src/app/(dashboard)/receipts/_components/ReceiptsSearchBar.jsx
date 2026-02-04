"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ReceiptsSearchBar({
  searchTerm,
  onSearchChange,
  loading,
}) {
  return (
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
          onChange={onSearchChange}
        />
        {loading && (
          <Loader2
            className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500"
            size={18}
          />
        )}
      </div>
    </div>
  );
}
