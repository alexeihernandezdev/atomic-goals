import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/presentation/utils/cn";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  onRemove?: () => void;
  removable?: boolean;
}

export function Chip({
  className,
  color,
  onRemove,
  removable = false,
  children,
  style,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[--ag-radius-sm] px-2.5 py-1",
        "text-xs font-mono font-medium",
        "border border-[--ag-border]",
        "transition-colors",
        className,
      )}
      style={{
        backgroundColor: color ? `${color}20` : undefined,
        borderColor: color ? `${color}40` : undefined,
        color: color ?? undefined,
        ...style,
      }}
      {...props}
    >
      {color && (
        <span
          className="inline-block h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 -mr-0.5 rounded-full hover:opacity-70 focus:outline-none transition-opacity"
          aria-label="Eliminar"
        >
          <X size={11} />
        </button>
      )}
    </span>
  );
}
