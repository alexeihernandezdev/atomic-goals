import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";

export interface QuoteCardProps extends React.HTMLAttributes<HTMLQuoteElement> {
  quote: string;
  author?: string;
  accentColor?: string;
}

export function QuoteCard({
  quote,
  author,
  accentColor = "var(--ag-lime)",
  className,
  ...props
}: QuoteCardProps) {
  return (
    <blockquote
      className={cn(
        "rounded-[--ag-radius-lg] p-6",
        "bg-[--ag-surface] border border-[--ag-border]",
        "relative overflow-hidden",
        className,
      )}
      {...props}
    >
      <span
        className="absolute top-0 left-0 w-1 h-full rounded-l-[--ag-radius-lg]"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />
      <p className="font-mono text-sm leading-relaxed text-[--ag-fg] pl-2">
        &ldquo;{quote}&rdquo;
      </p>
      {author && (
        <footer className="mt-3 pl-2">
          <cite className="font-mono text-xs text-[--ag-fg-muted] not-italic uppercase tracking-[--ag-tracking-wider]">
            — {author}
          </cite>
        </footer>
      )}
    </blockquote>
  );
}
