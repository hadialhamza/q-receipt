"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Settings,
  Plus,
  BarChart2,
  Users,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Create Receipt",
    href: "/create",
    icon: Plus,
  },
  {
    name: "All Receipts",
    href: "/receipts",
    icon: FileText,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col font-sans">
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <Logo size="sm" href="/dashboard" />
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                )}
                <Icon
                  className={cn(
                    "size-5 transition-transform duration-300",
                    isActive ? "scale-105" : "group-hover:scale-105",
                  )}
                />
                <span
                  className={cn(
                    "transition-colors",
                    isActive && "font-semibold",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 sticky top-0 h-screen z-30">
      <SidebarContent />
    </aside>
  );
}
