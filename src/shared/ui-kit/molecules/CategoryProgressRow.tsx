import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";
import { ProgressBar } from "@/shared/ui-kit/atoms/ProgressBar";

export interface CategoryProgressRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  progress: number;
  color?: string;
  count?: number;
}

export function CategoryProgressRow({
  name,
  progress,
  color = "var(--ag-primary)",
  count,
  className,
  ...props
}: CategoryProgressRowProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <span className="text-sm font-mono text-[--ag-fg] truncate">
            {name}
          </span>
          {count !== undefined && (
            <span className="text-xs font-mono text-[--ag-fg-subtle] shrink-0">
              ({count})
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-[--ag-fg-muted] tabular-nums shrink-0">
          {Math.round(progress)}%
        </span>
      </div>
      <ProgressBar
        value={progress}
        size="xs"
        color="primary"
        className="[&>div>div]:transition-all"
        style={{ "--ag-primary": color } as React.CSSProperties}
      />
    </div>
  );
}
