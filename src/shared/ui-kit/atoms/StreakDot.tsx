import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";

export type StreakDotState = "done" | "missed" | "today" | "future";

export interface StreakDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  state: StreakDotState;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const stateStyles: Record<StreakDotState, string> = {
  done: "bg-[--ag-lime] border-[--ag-lime]",
  missed: "bg-[--ag-error-bg] border-[--ag-error]",
  today:
    "bg-[--ag-primary] border-[--ag-primary] animate-[vibe-pulse_2s_ease-in-out_infinite]",
  future: "bg-transparent border-[--ag-border-strong]",
};

const sizeStyles = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

export function StreakDot({
  state,
  label,
  size = "md",
  className,
  ...props
}: StreakDotProps) {
  return (
    <span
      role="img"
      aria-label={label ?? state}
      className={cn(
        "inline-block rounded-full border-2 shrink-0",
        sizeStyles[size],
        stateStyles[state],
        className,
      )}
      {...props}
    />
  );
}
