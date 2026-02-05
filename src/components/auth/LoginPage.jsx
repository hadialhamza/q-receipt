import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

const LoginForm = dynamic(() => import("./LoginForm"), {
  loading: () => (
    <div className="w-full h-96 animate-pulse bg-gray-100 dark:bg-gray-800/50 rounded-3xl" />
  ),
});

export const metadata = {
  title: "Login | QReceipt",
  description: "Secure login for QReceipt - Manage your financial documents.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl h-[80vh]">
        <div className="h-[95%] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-lg shadow-gray-900/10 dark:shadow-black/40 overflow-hidden border border-gray-200/50 dark:border-gray-800/50 relative p-5 lg:p-15">
          {/* Background Panel */}
          <div className="absolute inset-0 z-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-900">
            {/* Grid Pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-20 h-full w-full flex items-center justify-center gap-10">
            {/* Left Side Content*/}
            <div className="hidden lg:flex max-w-md flex-1 flex-col gap-7">
              <Logo size="lg" variant="inverted" clickable={false} />
              <h1 className="font-outfit text-white text-5xl font-bold leading-tight tracking-tighter">
                Elevate Your <br />
                <span className="bg-linear-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  Business Workflow
                </span>
              </h1>
              <p className="text-lg text-blue-50/80 leading-relaxed font-dm-sans">
                Join thousands of companies using QReceipt to manage their
                financial documents with smart QR integration.
              </p>
            </div>

            {/* Login form */}
            <div className="flex-1 max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 transform transition-transform hover:scale-[1.01]">
              <LoginForm />
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
