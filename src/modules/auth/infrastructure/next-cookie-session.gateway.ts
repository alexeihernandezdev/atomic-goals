import type { SessionGateway } from "@/modules/auth/application/gateways/session.gateway";
import type { User } from "@/modules/auth/domain/entities/user";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const ONE_HOUR = 60 * 60;
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export class NextCookieSessionGateway implements SessionGateway {
  async getAccessToken(): Promise<string | null> {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  }

  async setSession(accessToken: string, _user?: User, refreshToken?: string): Promise<void> {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    store.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ONE_HOUR,
      path: "/",
    });
    if (refreshToken) {
      store.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: THIRTY_DAYS,
        path: "/",
      });
    }
  }

  async clearSession(): Promise<void> {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    store.delete(ACCESS_TOKEN_COOKIE);
    store.delete(REFRESH_TOKEN_COOKIE);
  }
}
