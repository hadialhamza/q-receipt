"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Single Digit Flip Component ---
const FlipDigit = ({ digit, label, index }) => {
  return (
    <div className="flex flex-col items-center gap-1 md:gap-2">
      <div
        className="relative h-10 w-8 sm:h-12 sm:w-10 md:h-14 md:w-12 overflow-hidden rounded-md sm:rounded-lg 
        bg-white dark:bg-slate-900
        border border-gray-200 dark:border-slate-700/50 shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={digit}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Split Background */}
            <div className="absolute inset-0 flex flex-col">
              <div className="h-1/2 w-full bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-black/20"></div>
              <div className="h-1/2 w-full bg-white dark:bg-slate-800/80"></div>
            </div>

            {/* Digit */}
            <span
              className="relative font-mono text-xl sm:text-2xl md:text-3xl font-bold 
              text-slate-900 dark:text-slate-100
              tabular-nums leading-none z-10 drop-shadow-sm"
            >
              {digit}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Scan line Effect - Moved Outside AnimatePresence for continuous loop */}
        <motion.div
          initial={{ top: "-20%" }}
          animate={{ top: "120%" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.2,
          }}
          className="absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-70 z-20 pointer-events-none blur-[1px]"
        />

        {/* Inner Corners & Highlights */}
        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 sm:top-1 sm:left-1 sm:w-1 sm:h-1 rounded-full bg-cyan-500/50" />
        <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 sm:top-1 sm:right-1 sm:w-1 sm:h-1 rounded-full bg-cyan-500/50" />
        {/* Center Split Line with Glow */}
        <div
          className="absolute top-1/2 left-0 w-full h-px 
          bg-linear-to-r from-transparent via-gray-400/50 dark:via-black/40 to-transparent 
          shadow-[0_1px_0_rgba(255,255,255,0.1)] z-20"
        />
      </div>
    </div>
  );
};

// --- Animated Separator Component ---
const AnimatedSeparator = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-1 h-1 rounded-full bg-cyan-600 dark:bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="w-1 h-1 rounded-full bg-cyan-600 dark:bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
      />
    </div>
  );
};

// --- Main Clock ---
export default function FlipClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num) => num.toString().padStart(2, "0");

  const hours = format(time.getHours() % 12 || 12);
  const minutes = format(time.getMinutes());
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  return (
    <div
      suppressHydrationWarning
      className="relative p-4 
      bg-white/50 dark:bg-slate-900/40
      backdrop-blur-xl rounded-xl sm:rounded-2xl 
      border border-gray-200 dark:border-slate-700/30
      shadow-sm dark:shadow-2xl
      select-none pointer-events-none"
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-linear-to-r from-cyan-500/10 via-transparent to-blue-500/10" />

      <div className="relative flex items-center gap-1 sm:gap-2 md:gap-4">
        {/* Hours */}
        <div className="flex gap-0.5 sm:gap-1 md:gap-1.5">
          <FlipDigit digit={hours[0]} label="HRS" index={0} />
          <FlipDigit digit={hours[1]} label="" index={1} />
        </div>

        {/* Separator */}
        <AnimatedSeparator />

        {/* Minutes */}
        <div className="flex gap-0.5 sm:gap-1 md:gap-1.5">
          <FlipDigit digit={minutes[0]} label="MIN" index={2} />
          <FlipDigit digit={minutes[1]} label="" index={3} />
        </div>

        {/* AM/PM Indicator */}
        <div className="flex flex-col justify-center gap-2">
          <motion.div
            animate={{
              color: ampm === "AM" ? "#0891b2" : "#a1a1aa",
              scale: ampm === "AM" ? 1.1 : 1,
              textShadow: "none",
              backgroundColor:
                ampm === "AM" ? "rgba(6,182,212,0.15)" : "rgba(6,182,212,0)",
            }}
            className="p-1 rounded-sm 
              text-[8px] text-center font-bold tracking-widest uppercase 
              border border-gray-200 dark:border-gray-800/50"
          >
            <span className="text-cyan-700 dark:text-cyan-400">AM</span>
          </motion.div>
          <motion.div
            animate={{
              color: ampm === "PM" ? "#0891b2" : "#a1a1aa",
              scale: ampm === "PM" ? 1.1 : 1,
              textShadow: "none",
              backgroundColor:
                ampm === "PM" ? "rgba(6,182,212,0.15)" : "rgba(6,182,212,0)",
            }}
            className="p-1 rounded-sm 
              text-[8px] font-bold tracking-widest uppercase 
              border border-gray-200 dark:border-slate-700/50"
          >
            <span className="text-cyan-700 dark:text-cyan-400">PM</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
