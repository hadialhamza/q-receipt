"use client";

import { motion } from "framer-motion";

export default function ScanningLoader({ text = "SCANNING RECEIPT DATA..." }) {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-72 h-96 bg-slate-900/50 border border-blue-500/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">
        {/* Background Grid Pattern (Tech Feel) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

        {/* Receipt Shape Placeholder (Ghost) */}
        <div className="absolute inset-0 p-6 flex flex-col items-center opacity-20">
          <div className="w-16 h-16 rounded-full bg-white mb-6"></div>
          <div className="w-full h-4 bg-white rounded mb-3"></div>
          <div className="w-3/4 h-4 bg-white rounded mb-8"></div>
          <div className="w-full h-32 bg-white rounded border-2 border-dashed border-white/50"></div>
        </div>

        {/* The Moving Laser Scanner */}
        <motion.div
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.5,
          }}
          className="absolute left-0 w-full h-2 bg-blue-500 shadow-[0_0_20px_#3b82f6,0_0_10px_#60a5fa] z-10"
        >
          {/* Green Glow Following the Line */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-blue-500/20 to-transparent"></div>
        </motion.div>

        {/* Text Animation */}
        <div className="absolute bottom-8 left-0 w-full text-center">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-blue-400 font-mono text-sm font-bold tracking-widest uppercase"
          >
            {text}
          </motion.span>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
      </div>
    </div>
  );
}
