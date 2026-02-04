"use client";

import { motion } from "framer-motion";

export default function SavingLoader({ text = "SAVING TO DATABASE..." }) {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      {/* Main Container */}
      <div className="relative w-80 h-80 bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center">
        {/* Background Grid (Static) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[20px_20px]"></div>

        {/* --- Animation Core: Data Uplink --- */}
        <div className="relative z-10 w-32 h-32 flex items-center justify-center mb-8">
          {/* 1. Outer Rotating Ring (Server Connection) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30 w-full h-full"
          ></motion.div>

          {/* 2. Inner Spinning Ring (Processing) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-24 h-24 rounded-full border-t-2 border-emerald-400 shadow-[0_0_15px_#10b981]"
          ></motion.div>

          {/* 3. Central Core (Pulsing Database) */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-emerald-500 rounded-full shadow-[0_0_30px_#10b981] flex items-center justify-center"
          >
            {/* Simple Database Icon Shape */}
            <div className="w-6 h-6 border-2 border-emerald-900 rounded-lg flex flex-col justify-center gap-0.5 p-0.5">
              <div className="h-0.5 w-full bg-emerald-900 rounded-full"></div>
              <div className="h-0.5 w-full bg-emerald-900 rounded-full"></div>
              <div className="h-0.5 w-full bg-emerald-900 rounded-full"></div>
            </div>
          </motion.div>

          {/* 4. Upward Moving Particles (Uploading Data Effect) */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: -60, opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.4, // Stagger effect
              }}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"
            />
          ))}
        </div>

        {/* Text Animation */}
        <div className="text-center space-y-2 z-10">
          <motion.h3
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-emerald-400 font-mono text-sm font-bold tracking-[0.2em]"
          >
            {text}
          </motion.h3>
          <p className="text-slate-500 text-[10px] font-medium tracking-wide uppercase">
            Do not close window
          </p>
        </div>

        {/* Bottom Progress Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
          />
        </div>
      </div>
    </div>
  );
}
