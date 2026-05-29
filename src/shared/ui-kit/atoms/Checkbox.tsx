import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/shared/presentation/utils/cn";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = "md", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      sizeMap[size],
      "shrink-0 rounded-[--ag-radius-xs]",
      "border-2 border-[--ag-border-strong]",
      "transition-all duration-[--ag-duration-fast]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ag-ring] focus-visible:ring-offset-1",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[--ag-primary] data-[state=checked]:border-[--ag-primary] data-[state=checked]:text-[--ag-primary-fg]",
      "data-[state=checked]:animate-[vibe-pop_0.2s_ease-out]",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check
        strokeWidth={3}
        className={cn(
          size === "sm" ? "h-2.5 w-2.5" : size === "md" ? "h-3 w-3" : "h-4 w-4",
        )}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";
