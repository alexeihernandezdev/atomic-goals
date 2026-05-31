"use client";

import { useLogout } from "@/modules/auth/presentation/hooks/use-logout";
import { useAuthStore } from "@/modules/auth/presentation/stores/auth-store";
import { cn } from "@/shared/presentation/utils/cn";
import { LogOut } from "lucide-react";
import * as React from "react";

export function UserMenu() {
  const { user } = useAuthStore();
  const { logout } = useLogout();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-[--ag-radius-md]",
          "hover:bg-ag-surface-hover transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ag-ring]",
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span
          className={cn(
            "h-7 w-7 rounded-[--ag-radius-full] flex items-center justify-center",
            "bg-ag-primary text-ag-primary-fg text-xs font-mono font-semibold",
          )}
        >
          {initials}
        </span>
        <span className="text-sm font-mono text-ag-fg hidden sm:block max-w-[120px] truncate">
          {user?.name ?? "Usuario"}
        </span>
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full right-0 mt-2 w-48 z-50",
            "rounded-[--ag-radius-lg] bg-ag-surface border border-ag-border",
            "shadow-lg animate-[vibe-pop_0.2s_ease-out]",
            "overflow-hidden",
          )}
          role="menu"
        >
          <div className="px-4 py-3 border-b border-ag-border">
            <p className="text-xs font-mono font-medium text-ag-fg truncate">
              {user?.name ?? "Usuario"}
            </p>
            <p className="text-xs font-mono text-ag-fg-subtle truncate">
              {user?.email ?? ""}
            </p>
          </div>
          <div className="py-1">
            <button
              onClick={() => void logout()}
              role="menuitem"
              className={cn(
                "flex items-center gap-2.5 w-full px-4 py-2.5",
                "text-sm font-mono text-ag-error",
                "hover:bg-ag-error-bg transition-colors",
              )}
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
