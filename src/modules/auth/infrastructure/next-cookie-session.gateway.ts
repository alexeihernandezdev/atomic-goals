import type { SessionGateway } from "@/modules/auth/application/gateways/session.gateway";
import type { User } from "@/modules/auth/domain/entities/user";

const ACCESS_TOKEN_COOKIE = "access_token";
const ONE_HOUR = 60 * 60;

export class NextCookieSessionGateway implements SessionGateway {
  async getAccessToken(): Promise<string | null> {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  }

  async setSession(accessToken: string, _user?: User): Promise<void> {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    store.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ONE_HOUR,
      path: "/",
    });
  }

  async clearSession(): Promise<void> {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    store.delete(ACCESS_TOKEN_COOKIE);
  }
}
