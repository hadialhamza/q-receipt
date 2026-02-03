"use client";

import React from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-500/10 rounded-full blur-[120px]"
      />

      <div className="z-10 flex flex-col items-center space-y-10">
        {/* Logo with pulsing ring */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-5 border-2 border-blue-500/20 rounded-2xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="lg" clickable={false} />
          </motion.div>
        </div>

        {/* Custom Loading Indicator */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.5, 1],
                  backgroundColor: [
                    "rgba(59, 130, 246, 0.3)",
                    "rgba(59, 130, 246, 1)",
                    "rgba(59, 130, 246, 0.3)",
                  ],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
                className="size-3 rounded-full shadow-sm"
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col items-center space-y-1"
          >
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 font-outfit tracking-widest uppercase">
              Initializing
            </span>
            <div className="h-1 w-48 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-blue-500 to-transparent w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-[15%] opacity-10"
      >
        <div className="size-20 border-2 border-blue-500 rounded-full" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 left-[15%] opacity-10"
      >
        <div className="size-24 border-2 border-indigo-500 rounded-lg" />
      </motion.div>

      <footer className="absolute bottom-8 group">
        <p className="text-xs text-muted-foreground/40 font-medium tracking-tight">
          Generating Secure Experience...
        </p>
      </footer>
    </div>
  );
}
