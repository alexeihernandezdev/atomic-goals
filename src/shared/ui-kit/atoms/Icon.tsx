import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/shared/presentation/utils/cn";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: LucideIcon;
  size?: IconSize | number;
  strokeWidth?: number;
  label?: string;
}

export function Icon({
  icon: LucideIcon,
  size = "md",
  strokeWidth = 1.5,
  label,
  className,
  ...props
}: IconProps) {
  const px = typeof size === "number" ? size : sizeMap[size];

  return (
    <span
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={!label}
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        className,
      )}
      {...props}
    >
      <LucideIcon size={px} strokeWidth={strokeWidth} />
    </span>
  );
}
