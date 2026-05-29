"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Target,
  Calendar,
  Activity,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/shared/presentation/utils/cn";
import { BrandLogo } from "@/shared/ui-kit/molecules/BrandLogo";
import { useUiStore } from "@/shared/presentation/stores/ui-store";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/categories", label: "Categorías", icon: FolderOpen },
  { href: "/goals", label: "Metas", icon: Target },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/activity", label: "Actividad", icon: Activity },
  { href: "/trash", label: "Papelera", icon: Trash2 },
  { href: "/settings", label: "Ajustes", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[--ag-surface] border-r border-[--ag-border]",
        "transition-all duration-[--ag-duration-slow] ease-[--ag-ease-inout]",
        sidebarCollapsed ? "w-16" : "w-56",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[--ag-border]">
        {!sidebarCollapsed && <BrandLogo size="sm" stacked />}
        <button
          onClick={toggleSidebar}
          className={cn(
            "h-7 w-7 flex items-center justify-center rounded-[--ag-radius-sm]",
            "text-[--ag-fg-muted] hover:bg-[--ag-surface-hover] hover:text-[--ag-fg]",
            "transition-colors",
            sidebarCollapsed && "mx-auto",
          )}
          aria-label={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        <ul className="flex flex-col gap-0.5 px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  title={sidebarCollapsed ? label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-[--ag-radius-md]",
                    "text-sm font-mono transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ag-ring]",
                    active
                      ? "bg-[--ag-primary]/10 text-[--ag-primary] font-medium"
                      : "text-[--ag-fg-muted] hover:bg-[--ag-surface-hover] hover:text-[--ag-fg]",
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      "shrink-0",
                      active ? "text-[--ag-primary]" : "text-[--ag-fg-subtle]",
                    )}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate animate-[vibe-fade_0.15s_ease-out]">
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
