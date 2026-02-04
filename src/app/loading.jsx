"use client";

import React from "react";
import Logo from "@/components/Logo";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background/50 relative overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="z-10 flex flex-col items-center space-y-10">
        {/* Logo with pulsing ring */}
        <div className="relative">
          <div className="absolute -inset-5 border-2 border-primary/20 rounded-2xl animate-pulse" />
          <Logo size="lg" clickable={false} />
        </div>

        {/* Custom Loading Indicator */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="size-3 rounded-full bg-primary/30 animate-pulse"
                style={{ animationDelay: `${index * 200}ms` }}
              />
            ))}
          </div>

          <div className="flex flex-col items-center space-y-2 fill-mode-both">
            <span className="text-[10px] font-bold text-muted-foreground/60 font-outfit tracking-[0.2em] uppercase">
              Initializing Experience
            </span>
            <div className="h-1 w-48 bg-muted rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary to-transparent w-full h-full animate-[shimmer_2s_infinite_linear]" />
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 animate-in fade-in duration-1000 delay-500 fill-mode-both">
        <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
          Securely Generating Assets...
        </p>
      </footer>
    </div>
  );
}
