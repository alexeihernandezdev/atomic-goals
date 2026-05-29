"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/shared/presentation/utils/cn";

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) {
    return <span className="h-8 w-8" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-[--ag-radius-sm]",
        "text-[--ag-fg-muted] hover:text-[--ag-fg] hover:bg-[--ag-surface-hover]",
        "transition-all duration-[--ag-duration-base] ease-[--ag-ease-out]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[--ag-ring]",
        className,
      )}
      {...props}
    >
      {isDark ? (
        <Sun size={16} strokeWidth={1.5} />
      ) : (
        <Moon size={16} strokeWidth={1.5} />
      )}
    </button>
  );
}
