import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Tab({ className, active = false, ...props }: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        "relative px-4 py-2 text-sm font-mono font-medium uppercase tracking-[--ag-tracking-wide]",
        "transition-all duration-[--ag-duration-base] ease-[--ag-ease-out]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[--ag-ring]",
        active
          ? "text-[--ag-fg] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[--ag-primary] after:rounded-full"
          : "text-[--ag-fg-muted] hover:text-[--ag-fg]",
        className,
      )}
      {...props}
    />
  );
}
