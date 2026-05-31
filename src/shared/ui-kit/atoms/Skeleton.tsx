"use client";

import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";

export interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse bg-[--ag-border]", className)}
      style={style}
      aria-hidden
    />
  );
}
