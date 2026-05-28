import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";

export interface StepIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  current: number;
  total: number;
}

export function StepIndicator({
  current,
  total,
  className,
  ...props
}: StepIndicatorProps) {
  const fmt = (n: number) => String(n).padStart(2, "0");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs text-[--ag-fg-muted] tracking-[--ag-tracking-wider] uppercase",
        className,
      )}
      aria-label={`Paso ${current} de ${total}`}
      {...props}
    >
      <span className="text-[--ag-fg] font-semibold">{fmt(current)}</span>
      <span className="opacity-40">de</span>
      <span>{fmt(total)}</span>
    </span>
  );
}
