"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "./UserMenu";
import { Breadcrumbs } from "./Breadcrumbs";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarContent } from "./Sidebar";

export function TopBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Handle Search
  const handleSearch = (term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const term = e.target.value;
      if (pathname !== "/receipts") {
        router.push(`/receipts?search=${term}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Trigger */}
          <div className="block lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex">
            <Breadcrumbs />
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end flex-1">
          {/* Search Bar - Centered/Right aligned based on space */}
          <div
            className={`hidden md:flex items-center relative transition-all duration-300 ${isSearchFocused ? "w-80 ring-2 ring-primary/20 rounded-md" : "w-64"}`}
          >
            <Search
              className={`absolute left-2.5 top-2.5 h-4 w-4 transition-colors ${isSearchFocused ? "text-primary" : "text-muted-foreground"}`}
            />
            <Input
              type="search"
              placeholder="Search receipts..."
              className="pl-9 h-9 bg-muted/40 border-transparent focus:bg-background focus:border-primary/50 transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              defaultValue={searchParams.get("search")?.toString()}
            />
            <div className="absolute right-2 top-2 hidden lg:flex items-center gap-1 pointer-events-none">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors rounded-full"
              >
                <Bell className="h-5 w-5" />
                {/* Empty State: No red dot if no notifications */}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    You have no new notifications.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-center py-6 text-muted-foreground/50">
                    <Bell className="h-8 w-8 opacity-20" />
                  </div>
                  <div className="text-center text-xs text-muted-foreground">
                    You&apos;re all caught up!
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <ThemeToggle />
          <div className="pl-2 border-l border-border/50">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
