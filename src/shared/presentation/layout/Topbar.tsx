"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/shared/presentation/utils/cn";
import { ThemeToggle } from "@/shared/ui-kit/atoms/ThemeToggle";
import { usePathname } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/categories": "Categorías",
  "/goals": "Metas",
  "/calendar": "Calendario",
  "/activity": "Actividad",
  "/trash": "Papelera",
  "/settings": "Ajustes",
};

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const topLevel = `/${segments[0] ?? ""}`;
  const sectionLabel = ROUTE_LABELS[topLevel] ?? segments[0] ?? "";

  const isDetail = segments.length > 1;
  const parentHref = isDetail ? topLevel : null;

  return { sectionLabel, sectionHref: topLevel, isDetail, parentHref };
}

interface TopbarProps {
  trailing?: React.ReactNode;
}

export function Topbar({ trailing }: TopbarProps) {
  const { sectionLabel, sectionHref, isDetail, parentHref } = useBreadcrumb();

  return (
    <header
      className={cn(
        "h-14 flex items-center justify-between px-6",
        "border-b border-[--ag-border] bg-[--ag-surface]",
      )}
    >
      <nav aria-label="Ruta actual" className="flex items-center gap-2">
        {isDetail && parentHref && (
          <Link
            href={parentHref}
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-[--ag-radius-sm]",
              "text-[--ag-fg-muted] hover:bg-[--ag-surface-hover] hover:text-[--ag-fg]",
              "transition-colors",
            )}
            aria-label="Volver atrás"
          >
            <ArrowLeft size={15} />
          </Link>
        )}

        <ol className="flex items-center gap-1.5">
          <li>
            {isDetail ? (
              <Link
                href={sectionHref}
                className="text-sm font-mono text-[--ag-fg-muted] hover:text-[--ag-fg] transition-colors"
              >
                {sectionLabel}
              </Link>
            ) : (
              <span className="text-sm font-mono font-medium text-[--ag-fg]">
                {sectionLabel}
              </span>
            )}
          </li>
          {isDetail && (
            <>
              <li>
                <span className="text-xs text-[--ag-fg-subtle]">/</span>
              </li>
              <li>
                <span className="text-sm font-mono font-medium text-[--ag-fg]">
                  detalle
                </span>
              </li>
            </>
          )}
        </ol>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {trailing}
      </div>
    </header>
  );
}
