/**
 * Browser-side OpenAPI client (used in Client Components).
 * Generated types from `pnpm openapi:gen` live in schema.d.ts.
 *
 * ⚠️  stub — wired fully in Phase 1 when schema.d.ts is generated.
 */
import createClient from "openapi-fetch";

// Uncomment after running `pnpm openapi:gen`:
// import type { paths } from "./schema";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

// export const apiClient = createClient<paths>({ baseUrl, credentials: "include" });
export const apiClient = createClient<Record<string, never>>({
  baseUrl,
  credentials: "include",
});

export type ApiClient = typeof apiClient;
