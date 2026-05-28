import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/presentation/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-mono font-medium tracking-wide uppercase text-sm",
    "transition-all duration-[--ag-duration-base] ease-[--ag-ease-out]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ag-ring] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[--ag-primary] text-[--ag-primary-fg]",
          "hover:bg-[--ag-primary-hover] active:scale-[0.97]",
        ].join(" "),
        lime: [
          "bg-[--ag-lime] text-[--ag-lime-fg]",
          "hover:brightness-95 active:scale-[0.97]",
        ].join(" "),
        amber: [
          "bg-[--ag-amber] text-[--ag-amber-fg]",
          "hover:brightness-95 active:scale-[0.97]",
        ].join(" "),
        pink: [
          "bg-[--ag-pink] text-[--ag-pink-fg]",
          "hover:brightness-95 active:scale-[0.97]",
        ].join(" "),
        outline: [
          "border border-[--ag-border-strong] bg-transparent text-[--ag-fg]",
          "hover:bg-[--ag-surface-hover] active:scale-[0.97]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[--ag-fg-muted]",
          "hover:bg-[--ag-surface-hover] hover:text-[--ag-fg]",
        ].join(" "),
        destructive: [
          "bg-[--ag-error] text-white",
          "hover:brightness-95 active:scale-[0.97]",
        ].join(" "),
      },
      size: {
        xs: "h-7  px-3  text-xs  rounded-[--ag-radius-sm]",
        sm: "h-9  px-4  text-xs  rounded-[--ag-radius-md]",
        md: "h-11 px-5  text-sm  rounded-[--ag-radius-md]",
        lg: "h-13 px-6  text-base rounded-[--ag-radius-lg]",
        icon: "h-9  w-9        rounded-[--ag-radius-md]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({ variant, size }),
          loading && "animate-[vibe-pulse_1.5s_ease-in-out_infinite]",
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-vibe-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
