import Link from "next/link";
import { MoveLeft, Home, FileQuestion } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Content Container */}
      <div className="z-10 max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-400">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>

        <div className="relative inline-block">
          <h1 className="text-[10rem] md:text-[12rem] font-bold leading-none tracking-tighter text-gradient-primary drop-shadow-2xl select-none">
            404
          </h1>
          <div className="absolute -top-4 -right-4 animate-bounce delay-300">
            <div className="p-3 glass rounded-2xl shadow-xl">
              <FileQuestion className="size-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white">
            Lost in Space?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
            The page you are looking for has been moved or doesn&apos;t exist.
            Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 shadow-primary-lg active:scale-95 transition-all"
          >
            <Link href="/">
              <Home className="mr-2" />
              Take Me Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 glass-card border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all"
          >
            <Link href="/dashboard">
              <MoveLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Subtle Floating Decorative Icons */}
      <div className="absolute top-1/4 left-10 opacity-20 dark:opacity-10 animate-pulse delay-500">
        <div className="size-16 border-2 border-blue-500 rounded-full" />
      </div>
      <div className="absolute bottom-1/4 right-10 opacity-20 dark:opacity-10 animate-pulse delay-1000">
        <div className="size-20 border-2 border-indigo-500 rotate-45" />
      </div>

      {/* Global CSS for some custom animations if needed, though most is tailwind */}
      <footer className="absolute bottom-6 text-sm text-muted-foreground opacity-50">
        © {new Date().getFullYear()} QReceipt - All rights reserved.
      </footer>
    </div>
  );
}
