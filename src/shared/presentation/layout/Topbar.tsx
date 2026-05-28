"use client";

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
  const label = ROUTE_LABELS[topLevel] ?? segments[0] ?? "";
  return [{ label, href: topLevel }];
}

interface TopbarProps {
  trailing?: React.ReactNode;
}

export function Topbar({ trailing }: TopbarProps) {
  const crumbs = useBreadcrumb();

  return (
    <header
      className={cn(
        "h-14 flex items-center justify-between px-6",
        "border-b border-[--ag-border] bg-[--ag-surface]",
      )}
    >
      <nav aria-label="Ruta actual">
        <ol className="flex items-center gap-1.5">
          {crumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-xs text-[--ag-fg-subtle]">/</span>
              )}
              <span className="text-sm font-mono font-medium text-[--ag-fg]">
                {crumb.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {trailing}
      </div>
    </header>
  );
}
