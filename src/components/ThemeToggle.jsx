"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className, ...props }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const Icon = theme === "dark" ? Moon : Sun;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full relative overflow-hidden transition-transform duration-300 hover:bg-accent ${className}`}
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      {...props}
    >
      <Icon className="size-5 transition-transform duration-300 hover:rotate-12" />
    </Button>
  );
}
