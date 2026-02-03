import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group relative overflow-hidden active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:shadow-md",
        outline:
          "border-2 border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-accent transform hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:shadow-blue-500/25 border-0",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        xs: "h-7 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  // If using Slot (asChild), we can't safely inject inner styling divs.
  // We strictly rely on the classes.
  if (asChild) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {/* 1. Gradient Swipe Effect (Visible on Hover) */}
      <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* 2. Content Wrapper (Ensure text/icon stays above effects) */}
      <span className="relative z-10 flex items-center gap-2 [&_svg]:transition-transform [&_svg]:duration-300 group-hover:[&_svg]:translate-x-0.5">
        {children}
      </span>

      {/* 3. Optional: Subtle bottom highlight/reflection like sidebar indicator if desired */}
      {(variant === 'default' || variant === 'premium') && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-linear-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}

export { Button, buttonVariants }
