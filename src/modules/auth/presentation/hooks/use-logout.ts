"use client";

import { clearClientSession } from "@/shared/presentation/auth/clear-client-session";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth-store";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const logout = React.useCallback(async () => {
    try {
      await clearClientSession();
      clearAuth();
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Error al cerrar sesión.");
    }
  }, [clearAuth, router]);

  return { logout };
}
