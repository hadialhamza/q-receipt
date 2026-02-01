"use client";

import LoginForm from "./LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 size-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 size-96 bg-gradient-to-tl from-purple-500/20 to-blue-500/20 dark:from-purple-600/10 dark:to-blue-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-600/5 dark:to-purple-600/5 rounded-full blur-3xl" />

      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-7xl">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/10 dark:shadow-black/40 overflow-hidden border border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-col lg:flex-row-reverse min-h-[700px]">
            {/* Right Side - Login Form */}
            <div className="w-full lg:w-[45%] p-8 sm:p-12 lg:p-16 xl:p-20 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <LoginForm />
            </div>

            {/* Left Side - Welcome Panel */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-900">
              {/* Decorative Pattern Overlay */}
              <div className="absolute inset-0">
                {/* Animated Gradient Orbs */}
                <div className="absolute top-0 left-0 size-96 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-0 size-96 bg-indigo-500/30 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

                {/* Grid Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center text-white p-12 xl:p-14">
                <div className="space-y-6 max-w-lg">
                  {/* Logo */}
                  <div>
                    <Logo size="lg" variant="inverted" clickable={false} />
                  </div>

                  <div className="space-y-3">
                    <h1 className="font-heading text-4xl xl:text-5xl font-bold leading-tight">
                      Streamline Your
                      <br />
                      <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                        Receipt Management
                      </span>
                    </h1>
                    <p className="text-base text-blue-50/90 leading-relaxed">
                      Generate, manage, and share QR-enabled receipts with ease.
                      Perfect for businesses of all sizes.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 pt-1">
                    {[
                      { icon: "⚡", text: "Instant QR code generation" },
                      { icon: "🔒", text: "Secure cloud storage" },
                      { icon: "📊", text: "Easy sharing & tracking" },
                      { icon: "✨", text: "Professional templates" },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 group hover:translate-x-1 transition-transform duration-300"
                      >
                        <div className="size-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                          {feature.icon}
                        </div>
                        <span className="text-blue-50/90 text-sm font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          © 2026 QReceipt. All rights reserved.
        </p>
      </div>
    </div>
  );
}
