"use client";

import { clientContainer } from "@/shared/composition/client-container";

/** Clears httpOnly cookies (API) and browser session (use case + OpenAPI token cache). */
export async function clearClientSession(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {
    // best-effort
  }
  try {
    await clientContainer().auth.logout.execute();
  } catch {
    // best-effort
  }
}
