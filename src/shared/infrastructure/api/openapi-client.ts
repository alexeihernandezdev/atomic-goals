/**
 * Browser-side OpenAPI client (used in Client Components).
 * Generated types from `pnpm openapi:gen` live in schema.d.ts.
 */
import createClient from "openapi-fetch";

// Uncomment after running `pnpm openapi:gen`:
// import type { paths } from "./schema";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const TOKEN_KEY = "ag_access_token";

let cachedAccessToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

export function clearCachedAccessToken(): void {
  cachedAccessToken = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

async function resolveAccessToken(options?: {
  forceRefresh?: boolean;
}): Promise<string | null> {
  const forceRefresh = options?.forceRefresh ?? false;
  if (!forceRefresh && cachedAccessToken) return cachedAccessToken;

  const resolve = async (): Promise<string | null> => {
    if (!forceRefresh) {
      const res = await fetch("/api/auth/token", { credentials: "include" });
      if (res.ok) {
        const json = (await res.json()) as { accessToken?: string };
        if (json.accessToken) {
          cachedAccessToken = json.accessToken;
          if (typeof window !== "undefined") {
            sessionStorage.setItem(TOKEN_KEY, json.accessToken);
          }
          return json.accessToken;
        }
      }
    }

    cachedAccessToken = null;
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!refreshRes.ok) return null;

    const json = (await refreshRes.json()) as { accessToken?: string };
    cachedAccessToken = json.accessToken ?? null;
    if (cachedAccessToken && typeof window !== "undefined") {
      sessionStorage.setItem(TOKEN_KEY, cachedAccessToken);
    }
    return cachedAccessToken;
  };

  if (!forceRefresh && tokenPromise) return tokenPromise;
  tokenPromise = resolve().finally(() => {
    tokenPromise = null;
  });
  return tokenPromise;
}

const authenticatedFetch: typeof fetch = async (input, init) => {
  const token = await resolveAccessToken();

  const buildRequest = (bearerToken: string | null) => {
    const headers = new Headers(
      input instanceof Request ? input.headers : init?.headers,
    );
    if (bearerToken) headers.set("Authorization", `Bearer ${bearerToken}`);
    if (input instanceof Request) {
      return new Request(input, { headers });
    }
    return new Request(input, { ...init, headers });
  };

  let request = buildRequest(token);
  let response = await fetch(request);
  if (response.status === 401) {
    clearCachedAccessToken();
    const newToken = await resolveAccessToken({ forceRefresh: true });
    if (newToken) {
      request = buildRequest(newToken);
      response = await fetch(request);
    }
  }
  return response;
};

export const apiClient = createClient<Record<string, never>>({
  baseUrl,
  credentials: "include",
  fetch: authenticatedFetch,
});

export type ApiClient = typeof apiClient;
