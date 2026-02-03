"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  FileText,
  Settings,
  Plus,
  BarChart2,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    color: "blue",
  },
  {
    name: "Create Receipt",
    href: "/create",
    icon: Plus,
    color: "emerald",
  },
  {
    name: "All Receipts",
    href: "/receipts",
    icon: FileText,
    color: "orange",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart2,
    color: "violet",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    color: "slate",
  },
];

const colorStyles = {
  blue: {
    activeText: "text-blue-800 dark:text-blue-100",
    activeBg: "bg-blue-200 dark:bg-blue-500/30",
    hoverText: "group-hover:text-blue-800 dark:group-hover:text-blue-100",
    hoverBg: "group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20",
    indicator: "bg-blue-600 dark:bg-blue-400",
    shadow: "shadow-[0_0_8px_rgba(37,99,235,0.5)]",
    gradient: "from-blue-500/0 via-blue-500/30 to-blue-500/0",
  },
  emerald: {
    activeText: "text-emerald-800 dark:text-emerald-100",
    activeBg: "bg-emerald-200 dark:bg-emerald-500/30",
    hoverText: "group-hover:text-emerald-800 dark:group-hover:text-emerald-100",
    hoverBg: "group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20",
    indicator: "bg-emerald-600 dark:bg-emerald-400",
    shadow: "shadow-[0_0_8px_rgba(5,150,105,0.5)]",
    gradient: "from-emerald-500/0 via-emerald-500/30 to-emerald-500/0",
  },
  orange: {
    activeText: "text-orange-900 dark:text-orange-100",
    activeBg: "bg-orange-200 dark:bg-orange-500/30",
    hoverText: "group-hover:text-orange-900 dark:group-hover:text-orange-100",
    hoverBg: "group-hover:bg-orange-200 dark:group-hover:bg-orange-500/20",
    indicator: "bg-orange-600 dark:bg-orange-400",
    shadow: "shadow-[0_0_8px_rgba(234,88,12,0.5)]",
    gradient: "from-orange-500/0 via-orange-500/30 to-orange-500/0",
  },
  violet: {
    activeText: "text-violet-900 dark:text-violet-100",
    activeBg: "bg-violet-200 dark:bg-violet-500/30",
    hoverText: "group-hover:text-violet-900 dark:group-hover:text-violet-100",
    hoverBg: "group-hover:bg-violet-200 dark:group-hover:bg-violet-500/20",
    indicator: "bg-violet-600 dark:bg-violet-400",
    shadow: "shadow-[0_0_8px_rgba(124,58,237,0.5)]",
    gradient: "from-violet-500/0 via-violet-500/30 to-violet-500/0",
  },
  slate: {
    activeText: "text-slate-900 dark:text-white",
    activeBg: "bg-slate-300 dark:bg-slate-700",
    hoverText: "group-hover:text-slate-900 dark:group-hover:text-white",
    hoverBg: "group-hover:bg-slate-300 dark:group-hover:bg-slate-700",
    indicator: "bg-slate-900 dark:bg-white",
    shadow: "shadow-[0_0_8px_rgba(15,23,42,0.5)]",
    gradient: "from-slate-500/0 via-slate-500/30 to-slate-500/0",
  },
};

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col font-sans">
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <Logo size="sm" href="/dashboard" />
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const styles = colorStyles[item.color];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 group relative overflow-hidden active:scale-95",
                  isActive
                    ? cn(styles.activeText, styles.activeBg, "shadow-sm")
                    : cn(
                        "text-muted-foreground",
                        styles.hoverText,
                        styles.hoverBg,
                      ),
                )}
              >
                {/* Hover Gradient Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    styles.gradient,
                  )}
                />

                {/* Active Indicator Line */}
                {isActive && (
                  <div
                    className={cn(
                      "absolute left-0 top-1 bottom-1 w-1 rounded-r-full",
                      styles.indicator,
                      styles.shadow,
                    )}
                  />
                )}

                {/* Animated Icon */}
                <Icon
                  className={cn(
                    "size-5 transition-transform duration-300",
                    isActive ? "scale-105" : "group-hover:-translate-x-1",
                  )}
                />

                {/* Animated Text */}
                <span
                  className={cn(
                    "relative z-10 transition-all duration-300",
                    isActive
                      ? "font-bold tracking-tight"
                      : "group-hover:tracking-wide font-medium",
                  )}
                >
                  {item.name}
                </span>

                {/* Hover/Active Dot */}
                <div
                  className={cn(
                    "absolute right-2 transition-all duration-300",
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                  )}
                >
                  <span
                    className={cn(
                      "block h-1.5 w-1.5 rounded-full",
                      styles.indicator,
                    )}
                  />
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-border/40">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 group relative overflow-hidden active:scale-95"
          >
            <div className="absolute inset-0 bg-linear-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <LogOut className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="relative z-10 font-semibold group-hover:tracking-wide transition-all duration-300">
              Log Out
            </span>
            <div className="absolute right-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <span className="block h-1.5 w-1.5 rounded-full bg-red-500" />
            </div>
          </button>
        </div>
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
