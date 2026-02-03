"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

export function CustomStatsCard({
  title,
  value,
  icon,
  trend,
  trendDirection = "up",
  className,
  colorString,
}) {
  // Color configuration
  const colorConfigs = {
    purple: {
      bg: "bg-violet-100",
      border: "border-violet-200",
      text: "text-violet-700",
      iconBg: "bg-violet-200",
      circle: "bg-violet-400",
    },
    orange: {
      bg: "bg-orange-100",
      border: "border-orange-200",
      text: "text-orange-700",
      iconBg: "bg-orange-200",
      circle: "bg-orange-400",
    },
    green: {
      bg: "bg-emerald-100",
      border: "border-emerald-200",
      text: "text-emerald-700",
      iconBg: "bg-emerald-200",
      circle: "bg-emerald-400",
    },
    blue: {
      bg: "bg-sky-100",
      border: "border-sky-200",
      text: "text-sky-700",
      iconBg: "bg-sky-200",
      circle: "bg-sky-400",
    },
    pink: {
      bg: "bg-pink-100",
      border: "border-pink-200",
      text: "text-pink-700",
      iconBg: "bg-pink-200",
      circle: "bg-pink-400",
    },
  };

  const theme = colorConfigs[colorString] || colorConfigs.purple;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }} // Hover effect
      transition={{ duration: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 transition-shadow hover:shadow-lg h-40",
        theme.bg,
        theme.border,
        className,
      )}
    >
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header: Title & Icon */}
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-bold text-gray-600 tracking-wide uppercase">
            {title}
          </h3>
          {/* Icon Box */}
          <div className={cn("p-2 rounded-lg [&_svg]:w-5 [&_svg]:h-5", theme.iconBg, theme.text)}>
            {icon || <TrendingUp className="w-5 h-5" />}
          </div>
        </div>

        {/* Main Value & Trend */}
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <h2
              className={cn(
                "text-3xl font-extrabold tracking-tight",
                theme.text,
              )}
            >
              {value}
            </h2>
          </div>

          {/* Trend Indicator (New Feature) */}
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <span
                className={cn(
                  "flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
                  trendDirection === "up"
                    ? "text-emerald-700 bg-emerald-200/50"
                    : "text-rose-700 bg-rose-200/50",
                )}
              >
                {trendDirection === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                )}
                {trend}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                from last month
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Background Decorators (Modern Circles) */}
      <div
        className={cn(
          "absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 pointer-events-none blur-2xl",
          theme.circle,
        )}
      />
      <div
        className={cn(
          "absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20 pointer-events-none blur-xl",
          theme.circle,
        )}
      />
    </motion.div>
  );
}
