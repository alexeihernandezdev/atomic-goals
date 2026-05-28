"use client";

import type { SessionGateway } from "@/modules/auth/application/gateways/session.gateway";
import type { User } from "@/modules/auth/domain/entities/user";

const TOKEN_KEY = "ag_access_token";

export class BrowserSessionGateway implements SessionGateway {
  async getAccessToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(TOKEN_KEY);
  }

  async setSession(accessToken: string, _user?: User): Promise<void> {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(TOKEN_KEY, accessToken);
  }

  async clearSession(): Promise<void> {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(TOKEN_KEY);
  }
}
