"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FormInput({
  id,
  label,
  icon: Icon,
  iconClassName,
  placeholder,
  verificationStatus,
  type = "text",
  className,
  readOnly = false,
  ...props
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const status = verificationStatus?.[id];

  const renderVerificationIcon = () => {
    if (status === "verified") {
      return (
        <ShieldCheck className="absolute right-3 top-2.5 text-green-500 size-4 pointer-events-none transition-all animate-in fade-in zoom-in duration-300" />
      );
    }
    if (status === "mismatch") {
      return (
        <div className="absolute right-3 top-2.5 group cursor-help z-10 transition-all animate-in fade-in zoom-in duration-300">
          <AlertTriangle className="text-red-500 size-4" />
          <div className="hidden group-hover:block absolute right-0 bottom-full mb-2 w-48 p-2 bg-destructive text-destructive-foreground text-xs rounded shadow-lg">
            ⚠️ Value mismatch with PDF! Please verify manually.
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <Label
          htmlFor={id}
          className="mb-2 block text-xs font-bold uppercase text-muted-foreground tracking-wide transition-colors"
        >
          {label}
        </Label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon
            className={cn(
              "absolute left-3 top-2.5 size-4 pointer-events-none transition-colors",
              iconClassName ||
                "text-slate-400 group-focus-within:text-blue-500",
            )}
          />
        )}
        <Input
          id={id}
          {...register(id)}
          type={type}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            Icon && "pl-9",
            status && "pr-10",
            readOnly && "bg-muted font-semibold",
            errors[id] && "border-destructive focus-visible:ring-destructive",
            "transition-all duration-200",
          )}
          {...props}
        />
        {renderVerificationIcon()}
      </div>
      {errors[id] && (
        <p className="text-destructive text-[10px] font-bold uppercase mt-1 transition-all animate-in fade-in slide-in-from-top-1">
          {errors[id].message}
        </p>
      )}
    </div>
  );
}
