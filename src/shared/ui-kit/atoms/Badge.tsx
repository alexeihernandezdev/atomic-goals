import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/presentation/utils/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1",
    "rounded-[--ag-radius-xs] px-2 py-0.5",
    "text-xs font-mono font-medium uppercase tracking-[--ag-tracking-wide]",
    "border transition-colors",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-[--ag-primary] text-[--ag-primary-fg] border-transparent",
        lime: "bg-[--ag-lime] text-[--ag-lime-fg] border-transparent",
        amber: "bg-[--ag-amber] text-[--ag-amber-fg] border-transparent",
        pink: "bg-[--ag-pink] text-[--ag-pink-fg] border-transparent",
        blue: "bg-[--ag-blue] text-[--ag-blue-fg] border-transparent",
        outline: "bg-transparent text-[--ag-fg] border-[--ag-border-strong]",
        muted: "bg-[--ag-bg-subtle] text-[--ag-fg-muted] border-transparent",
        success: "bg-[--ag-success-bg] text-[--ag-success] border-transparent",
        warning: "bg-[--ag-warning-bg] text-[--ag-warning] border-transparent",
        destructive: "bg-[--ag-error-bg] text-[--ag-error] border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
