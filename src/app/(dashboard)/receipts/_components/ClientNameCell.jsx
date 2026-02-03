"use client";

import { useRef } from "react";

export default function ClientNameCell({ rawText, storedName }) {
  // 1. If we have a stored name from the DB, use it directly.
  if (storedName) {
    return <span className="font-medium">{storedName}</span>;
  }

  // 2. Fallback for old data: Just show truncated raw text or N/A.
  // We avoid running expensive regex or AI on the client side for old data
  // to keep the table fast and simple as requested.
  if (!rawText) return <span className="text-muted-foreground">N/A</span>;

  const firstLine = rawText.split("\n")[0].substring(0, 40);
  const display = firstLine.length < rawText.split("\n")[0].length ? firstLine + "..." : firstLine;

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-muted-foreground" title={rawText}>
        {display}
      </span>
    </div>
  );
}
