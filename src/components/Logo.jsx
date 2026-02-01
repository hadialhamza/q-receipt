import { QrCode } from "lucide-react";
import Link from "next/link";

export default function Logo({
  size = "md",
  variant = "default",
  clickable = true,
}) {
  const sizeClasses = {
    sm: { container: "gap-2", icon: "size-8", text: "text-xl" },
    md: { container: "gap-2.5", icon: "size-10", text: "text-2xl" },
    lg: { container: "gap-3", icon: "size-12", text: "text-3xl" },
  };

  const variantClasses = {
    default: {
      container: "text-gray-900 dark:text-white",
      icon: "bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white",
      iconRing: "ring-blue-600/20 dark:ring-blue-500/30",
    },
    inverted: {
      container: "text-white",
      icon: "bg-white text-blue-600",
      iconRing: "ring-white/20",
    },
    dark: {
      container: "text-gray-900",
      icon: "bg-gradient-to-br from-blue-600 to-blue-700 text-white",
      iconRing: "ring-blue-600/20",
    },
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  const logoBody = (
    <div
      className={`inline-flex items-center ${currentSize.container} ${currentVariant.container} group`}
    >
      <div
        className={`${currentSize.icon} ${currentVariant.icon} ${currentVariant.iconRing} rounded-xl flex items-center justify-center ring-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}
      >
        <QrCode className="size-[60%]" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span
          className={`${currentSize.text} font-bold leading-tight tracking-tight`}
        >
          QReceipt
        </span>
        <span
          className={`text-[0.6em] font-medium leading-tight -mt-0.5 ${
            variant === "inverted"
              ? "text-white/70"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Smart Receipts
        </span>
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-block">
        {logoBody}
      </Link>
    );
  }

  return logoBody;
}
