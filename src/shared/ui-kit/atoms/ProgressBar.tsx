import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: "primary" | "lime" | "amber" | "pink" | "blue" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const colorMap = {
  primary: "bg-[--ag-primary]",
  lime: "bg-[--ag-lime]",
  amber: "bg-[--ag-amber]",
  pink: "bg-[--ag-pink]",
  blue: "bg-[--ag-blue]",
  success: "bg-[--ag-success]",
};

const sizeMap = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

export function ProgressBar({
  value,
  max = 100,
  color = "primary",
  size = "sm",
  showLabel = false,
  animated = false,
  className,
  ...props
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          "flex-1 overflow-hidden rounded-full bg-[--ag-border]",
          sizeMap[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-[--ag-duration-slow] ease-[--ag-ease-out]",
            colorMap[color],
            animated && "animate-vibe-pulse",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-[--ag-fg-muted] tabular-nums w-9 text-right shrink-0">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
