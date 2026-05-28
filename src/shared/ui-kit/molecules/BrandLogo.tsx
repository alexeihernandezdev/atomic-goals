import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";

export interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  stacked?: boolean;
}

const sizeStyles = {
  sm: { atomic: "text-base", goals: "text-xs", dot: "h-1.5 w-1.5" },
  md: { atomic: "text-xl", goals: "text-sm", dot: "h-2 w-2" },
  lg: { atomic: "text-3xl", goals: "text-lg", dot: "h-2.5 w-2.5" },
};

export function BrandLogo({
  size = "md",
  stacked = false,
  className,
  ...props
}: BrandLogoProps) {
  const s = sizeStyles[size];

  if (stacked) {
    return (
      <div
        className={cn("flex flex-col leading-none select-none", className)}
        {...props}
      >
        <span
          className={cn(
            "font-mono font-semibold uppercase tracking-[0.12em] text-[--ag-fg]",
            s.atomic,
          )}
        >
          atomic
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={cn("inline-block rounded-full bg-[--ag-lime]", s.dot)}
          />
          <span
            className={cn(
              "font-mono font-medium uppercase tracking-[0.12em] text-[--ag-fg-muted]",
              s.goals,
            )}
          >
            goals
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center gap-2 select-none", className)}
      {...props}
    >
      <span
        className={cn(
          "font-mono font-semibold uppercase tracking-[0.12em] text-[--ag-fg]",
          s.atomic,
        )}
      >
        atomic
      </span>
      <span className={cn("inline-block rounded-full bg-[--ag-lime]", s.dot)} />
      <span
        className={cn(
          "font-mono font-medium uppercase tracking-[0.12em] text-[--ag-fg-muted]",
          s.goals,
        )}
      >
        goals
      </span>
    </div>
  );
}
