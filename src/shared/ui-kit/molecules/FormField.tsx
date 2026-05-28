import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";
import { Label } from "@/shared/ui-kit/atoms/Label";

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  hint,
  required,
  htmlFor,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p
          role="alert"
          className="text-xs font-mono text-[--ag-error] animate-[vibe-fade_0.2s_ease-out]"
        >
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs font-mono text-[--ag-fg-subtle]">{hint}</p>
      )}
    </div>
  );
}
