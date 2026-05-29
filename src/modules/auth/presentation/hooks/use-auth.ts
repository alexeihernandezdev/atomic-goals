"use client";

import { useAuthStore } from "../stores/auth-store";

export function useAuth() {
  const { user, accessToken, setAuth, clearAuth } = useAuthStore();
  return {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    setAuth,
    clearAuth,
  };
}
