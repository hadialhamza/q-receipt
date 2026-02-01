"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AppearanceSettings() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Theme Preferences</CardTitle>
        <CardDescription>Select the theme for the dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cursor-pointer">
          <div className="rounded-xl border-2 border-muted p-1 hover:border-primary transition-colors hover:bg-muted/50">
            <div className="space-y-2 rounded-lg bg-[#ecedef] p-2">
              <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-2 w-20 rounded-lg bg-[#ecedef]" />
                <div className="h-2 w-25 rounded-lg bg-[#ecedef]" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                <div className="h-2 w-25 rounded-lg bg-[#ecedef]" />
              </div>
            </div>
          </div>
          <div className="block p-2 text-center font-normal">Light</div>
        </div>

        <div className="cursor-pointer">
          <div className="rounded-xl border-2 border-muted p-1 hover:border-primary transition-colors hover:bg-muted/50">
            <div className="space-y-2 rounded-lg bg-slate-950 p-2">
              <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-2 w-20 rounded-lg bg-slate-400" />
                <div className="h-2 w-25 rounded-lg bg-slate-400" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-slate-400" />
                <div className="h-2 w-25 rounded-lg bg-slate-400" />
              </div>
            </div>
          </div>
          <div className="block p-2 text-center font-normal">Dark</div>
        </div>

        <div className="cursor-pointer">
          <div className="rounded-xl border-2 border-primary/50 bg-primary/5 p-1">
            <div className="space-y-2 rounded-lg bg-slate-950 p-2">
              <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-2 w-20 rounded-lg bg-slate-400" />
                <div className="h-2 w-25 rounded-lg bg-slate-400" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-slate-400" />
                <div className="h-2 w-25 rounded-lg bg-slate-400" />
              </div>
            </div>
          </div>
          <div className="block p-2 text-center font-medium text-primary">
            System
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
