import { redirect } from "next/navigation";
import { UnauthorizedError } from "@/shared/domain/errors/unauthorized.error";
import { NextCookieSessionGateway } from "@/modules/auth/infrastructure/next-cookie-session.gateway";

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

/** Server Components / Route Handlers — clears cookies and redirects to login. */
export async function redirectToLoginOnServer(from?: string): Promise<never> {
  await new NextCookieSessionGateway().clearSession();
  const params = new URLSearchParams({ reason: "session-expired" });
  if (from) params.set("from", from);
  redirect(`/login?${params.toString()}`);
}

/** Redirects to login when session expired; otherwise returns false. */
export async function redirectIfUnauthorized(
  error: unknown,
  from?: string,
): Promise<boolean> {
  if (!isUnauthorizedError(error)) return false;
  await redirectToLoginOnServer(from);
  return false;
}

