import createClient from "openapi-fetch";

const baseUrl = process.env.API_INTERNAL_URL ?? "http://localhost:4000/api/v1";

export async function createServerClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return createClient<Record<string, never>>({
    baseUrl,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
