"use client";

import { UnauthorizedError } from "@/shared/domain/errors/unauthorized.error";

import { clearClientSession } from "./clear-client-session";

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

/** Client-side — clears session and navigates to login. */
export function redirectToLoginOnClient(): void {
  if (typeof window === "undefined") return;

  const from = window.location.pathname;
  const params = new URLSearchParams({
    reason: "session-expired",
    from,
  });

  void clearClientSession().finally(() => {
    window.location.assign(`/login?${params.toString()}`);
  });
}

/** Returns true when a client redirect was triggered. */
export function handleClientUnauthorized(error: unknown): boolean {
  if (!isUnauthorizedError(error)) return false;
  redirectToLoginOnClient();
  return true;
}
