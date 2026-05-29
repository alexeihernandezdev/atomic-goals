import type { User } from "@/modules/auth/domain/entities/user";

export interface SessionGateway {
  getAccessToken(): Promise<string | null>;
  setSession(accessToken: string, user?: User, refreshToken?: string): Promise<void>;
  clearSession(): Promise<void>;
}
