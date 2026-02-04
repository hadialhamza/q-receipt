"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, MoveLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Content Container */}
      <div className="z-10 max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>

        <div className="relative inline-block">
          <div className="relative">
            <h1 className="text-[10rem] md:text-[12rem] font-bold leading-none tracking-tighter opacity-10 select-none">
              ERR
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 glass rounded-full shadow-2xl animate-bounce">
                <AlertCircle
                  className="size-24 text-red-500"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white">
            Something went wrong!
          </h2>
          <div className="glass-card p-4 border-red-500/20 bg-red-50/50 dark:bg-red-500/10 max-w-md mx-auto">
            <p className="text-red-600 dark:text-red-400 font-medium text-sm wrap-break-word">
              {error?.message ||
                "An unexpected error occurred. Please try again later."}
            </p>
            {error?.digest && (
              <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => reset()}
            size="lg"
            className="rounded-full px-8 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 active:scale-95 transition-all text-white"
          >
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 glass-card border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all"
          >
            <Link href="/">
              <Home className="mr-2 size-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <MoveLeft className="size-3" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-sm text-muted-foreground opacity-50">
        © {new Date().getFullYear()} QReceipt - Emergency Response Team
      </footer>
    </div>
  );
}
