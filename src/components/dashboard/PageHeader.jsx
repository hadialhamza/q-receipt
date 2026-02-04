"use client";

import { cn } from "@/lib/utils";

export default function PageHeader({
  title,
  highlightWord,
  description,
  icon: Icon,
  stats,
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-7 shadow-sm",
        className,
      )}
    >
      {/* Background Decorator */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-6">
        {/* Left Side: Icon & Title Area */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          {/* Logo/Icon Section */}
          {Icon && (
            <div className="relative shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50 shadow-inner">
                <Icon className="size-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
                Management Portal
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {title}{" "}
              {highlightWord && (
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600">
                  {highlightWord}
                </span>
              )}
            </h1>
            {description && (
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-100 font-medium">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Stats & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Compact Stats Card */}
          {stats && (
            <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 min-w-45 shadow-xs group">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stats.label}
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    {stats.value}
                  </h2>
                  {stats.unit && (
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                      {stats.unit}
                    </span>
                  )}
                </div>
              </div>
              {stats.Icon && (
                <stats.Icon className="absolute -bottom-2 -right-2 size-14 text-slate-900/3 dark:text-white/3 group-hover:scale-110 transition-transform duration-500" />
              )}
              <div className="absolute top-0 right-0 w-1 h-full bg-blue-500" />
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
