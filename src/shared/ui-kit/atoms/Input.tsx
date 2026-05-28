import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex w-full rounded-[--ag-radius-md] border border-[--ag-border-strong] bg-[--ag-surface]",
          "px-3 py-2 text-sm font-mono text-[--ag-fg] placeholder:text-[--ag-fg-subtle]",
          "transition-colors duration-[--ag-duration-fast]",
          "focus:outline-none focus:border-[--ag-primary] focus:ring-2 focus:ring-[--ag-primary]/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[--ag-bg-subtle]",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          error &&
            "border-[--ag-error] focus:border-[--ag-error] focus:ring-[--ag-error]/20",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
