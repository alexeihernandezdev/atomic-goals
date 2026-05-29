import type { AuthGateway } from "@/modules/auth/application/gateways/auth.gateway";
import type {
  AuthResult,
  LoginCommand,
  RegisterCommand,
  User,
} from "@/modules/auth/domain/entities/user";
import { mapHttpError } from "@/shared/infrastructure/api/http-error";
import { UserMapper } from "./mappers/user.mapper";

interface AuthApiClient {
  POST(
    path: string,
    options: { body: unknown; headers?: Record<string, string> },
  ): Promise<{ data: unknown; error: unknown }>;
  GET(
    path: string,
    options: { headers?: Record<string, string> },
  ): Promise<{ data: unknown; error: unknown }>;
}

export class HttpAuthGateway implements AuthGateway {
  constructor(private readonly client: AuthApiClient) {}

  async login(command: LoginCommand): Promise<AuthResult> {
    const { data, error } = await this.client.POST("/auth/login", {
      body: command,
    });
    if (error) throw mapHttpError(error);
    const raw = data as { accessToken: string; user: unknown };
    return {
      accessToken: raw.accessToken,
      user: UserMapper.toDomain(raw.user as Parameters<typeof UserMapper.toDomain>[0]),
    };
  }

  async register(command: RegisterCommand): Promise<AuthResult> {
    const { data, error } = await this.client.POST("/auth/register", {
      body: command,
    });
    if (error) throw mapHttpError(error);
    const raw = data as { accessToken: string; user: unknown };
    return {
      accessToken: raw.accessToken,
      user: UserMapper.toDomain(raw.user as Parameters<typeof UserMapper.toDomain>[0]),
    };
  }

  async logout(accessToken: string): Promise<void> {
    await this.client.POST("/auth/logout", {
      body: {},
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const { data, error } = await this.client.POST("/auth/refresh", {
      body: {},
      headers: { Cookie: `refresh_token=${refreshToken}` },
    });
    if (error) throw mapHttpError(error);
    const raw = data as { accessToken: string; user: unknown };
    return {
      accessToken: raw.accessToken,
      user: UserMapper.toDomain(raw.user as Parameters<typeof UserMapper.toDomain>[0]),
    };
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const { data, error } = await this.client.GET("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (error) throw mapHttpError(error);
    return UserMapper.toDomain(data as Parameters<typeof UserMapper.toDomain>[0]);
  }
}
