"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

export function Breadcrumbs() {
  const pathname = usePathname();

  // Split pathname into segments and remove empty strings
  const segments = pathname.split("/").filter((segment) => segment);

  // Don't show breadcrumbs on dashboard home if it's just /dashboard
  if (
    segments.length === 0 ||
    (segments.length === 1 && segments[0] === "dashboard")
  ) {
    return (
      <div className="flex items-center text-sm font-medium text-muted-foreground">
        <Home className="mr-2 h-4 w-4" />
        Dashboard
      </div>
    );
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden md:flex items-center text-sm"
    >
      <Link
        href="/dashboard"
        className="flex items-center text-muted-foreground hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Dashboard</span>
      </Link>

      {segments.map((segment, index) => {
        // Skip "dashboard" if it's the first segment since we already have the Home icon
        if (segment === "dashboard") return null;

        // Build the path up to this segment
        const href = `/${segments.slice(0, index + 1).join("/")}`;

        // Format the segment name (e.g., "my-receipts" -> "My Receipts")
        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        const isLast = index === segments.length - 1;

        return (
          <Fragment key={href}>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
