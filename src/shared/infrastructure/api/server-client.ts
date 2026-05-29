/**
 * Server-side OpenAPI client (used in Server Components + Server Actions).
 * Forwards the access_token cookie as Authorization Bearer header.
 *
 * ⚠️  stub — wired fully in Phase 1.
 */
import createClient from "openapi-fetch";

// Uncomment after running `pnpm openapi:gen`:
// import type { paths } from "./schema";

const baseUrl = process.env.API_INTERNAL_URL ?? "http://localhost:4000/api/v1";

// export async function createServerClient() {
//   const { cookies } = await import("next/headers");
//   const cookieStore = cookies();
//   const token = cookieStore.get("access_token")?.value;
//   return createClient<paths>({
//     baseUrl,
//     headers: token ? { Authorization: `Bearer ${token}` } : {},
//   });
// }

export async function createServerClient() {
  return createClient<Record<string, never>>({ baseUrl });
}
