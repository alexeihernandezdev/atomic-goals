import type { SettingsGateway, UpdateProfileCommand, ChangePasswordCommand } from "../application/gateways/settings.gateway";
import type { UserProfile } from "../domain/profile";
import { mapHttpError } from "@/shared/infrastructure/api/http-error";

interface ApiClient {
  GET(path: string): Promise<{ data: unknown; error: unknown }>;
  PATCH(path: string, options?: { body?: unknown }): Promise<{ data: unknown; error: unknown }>;
  POST(path: string, options?: { body?: unknown }): Promise<{ data: unknown; error: unknown }>;
}

function mapProfile(raw: unknown): UserProfile {
  const r = (raw as Record<string, unknown>) ?? {};
  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    avatarUrl: (r.avatarUrl ?? r.avatar ?? null) as string | null,
  };
}

export class HttpSettingsGateway implements SettingsGateway {
  constructor(private readonly client: ApiClient) {}

  async getProfile(): Promise<UserProfile> {
    const { data, error } = await this.client.GET("/users/me");
    if (error) throw mapHttpError(error);
    return mapProfile(data);
  }

  async updateProfile(command: UpdateProfileCommand): Promise<UserProfile> {
    const { data, error } = await this.client.PATCH("/users/me", {
      body: command,
    });
    if (error) throw mapHttpError(error);
    return mapProfile(data);
  }

  async changePassword(command: ChangePasswordCommand): Promise<void> {
    const { error } = await this.client.POST("/users/me/password", {
      body: {
        currentPassword: command.currentPassword,
        newPassword: command.newPassword,
      },
    });
    if (error) throw mapHttpError(error);
  }
}
