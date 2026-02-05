"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "../Logo";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else if (result?.ok) {
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-6 sm:p-8 lg:p-10 animate-in fade-in duration-500 delay-300 fill-mode-both">
      <div className="space-y-6">
        <div className="lg:hidden mb-4 flex justify-center animate-in fade-in slide-in-from-top-4 duration-500 delay-200 fill-mode-both">
          <Logo size="md" variant="default" clickable={false} />
        </div>

        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          <h2 className="font-outfit text-3xl font-black text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-400 fill-mode-both"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider"
            >
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition font-medium"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] font-bold uppercase text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider"
            >
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 font-medium"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 hover:bg-transparent transition-colors z-10"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-[10px] font-bold uppercase text-destructive mt-1 animate-in fade-in slide-in-from-top-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked)}
              className="size-5 rounded-md border-slate-300 dark:border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-bold text-slate-600 dark:text-slate-400 cursor-pointer hover:text-blue-500 transition-colors"
            >
              Remember me
            </Label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>

              {/* Shine effect with Tailwind */}
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] -skew-x-30 group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none" />
            </Button>
          </div>
        </form>

        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest pt-4 animate-in fade-in duration-1000 delay-500 fill-mode-both">
          Secure enterprise authentication
        </p>
      </div>
    </div>
  );
}
