/** Returns true when the JWT `exp` is in the past (or payload cannot be read). */
export function isJwtExpired(token: string, skewSeconds = 30): boolean {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf8"),
    ) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
  } catch {
    return true;
  }
}
