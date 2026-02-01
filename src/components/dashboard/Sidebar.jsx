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
  PieChart
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
    <div className="flex h-full flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Logo size="sm" href="/dashboard" />
      </div>

      <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "text-primary bg-gradient-primary-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    "size-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 via-primary/10 to-purple-500/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-primary opacity-10 blur-2xl rounded-full"></div>
            <h4 className="font-semibold text-sm mb-1 relative z-10">Pro Features</h4>
            <p className="text-xs text-muted-foreground mb-3 relative z-10">
              Get detailed analytics and export options.
            </p>
            <Button size="sm" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity border-0 shadow-primary relative z-10 text-white">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-card/50 backdrop-blur-xl sticky top-0 h-screen z-30">
      <SidebarContent />
    </aside>
  );
}
