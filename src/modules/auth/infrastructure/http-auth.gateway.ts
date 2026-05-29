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
  ): Promise<{ data: unknown; error: unknown; response: Response }>;
  GET(
    path: string,
    options: { headers?: Record<string, string> },
  ): Promise<{ data: unknown; error: unknown; response: Response }>;
}

// All responses are wrapped by TransformInterceptor: { data: T }
function unwrap<T>(data: unknown): T {
  return (data as { data: T }).data;
}

// Extract the refresh_token value from Set-Cookie response headers (server-side only)
function extractRefreshToken(response: Response): string | undefined {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  const setCookies: string[] =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : (headers.get("set-cookie") ?? "").split(/,\s*(?=[a-zA-Z_-])/);

  const refreshCookie = setCookies.find((c) => c.trim().startsWith("refresh_token="));
  if (!refreshCookie) return undefined;
  // Value is everything between '=' and the first ';'
  return refreshCookie.split(";")[0].split("=").slice(1).join("=") || undefined;
}

export class HttpAuthGateway implements AuthGateway {
  constructor(private readonly client: AuthApiClient) {}

  async login(command: LoginCommand): Promise<AuthResult> {
    const { data, error, response } = await this.client.POST("/auth/login", {
      body: command,
    });
    if (error) throw mapHttpError(error);
    const raw = unwrap<{ accessToken: string; user: unknown }>(data);
    return {
      accessToken: raw.accessToken,
      user: UserMapper.toDomain(raw.user as Parameters<typeof UserMapper.toDomain>[0]),
      refreshToken: extractRefreshToken(response),
    };
  }

  async register(command: RegisterCommand): Promise<AuthResult> {
    const { data, error, response } = await this.client.POST("/auth/register", {
      body: command,
    });
    if (error) throw mapHttpError(error);
    const raw = unwrap<{ accessToken: string; user: unknown }>(data);
    return {
      accessToken: raw.accessToken,
      user: UserMapper.toDomain(raw.user as Parameters<typeof UserMapper.toDomain>[0]),
      refreshToken: extractRefreshToken(response),
    };
  }

  async logout(accessToken: string): Promise<void> {
    await this.client.POST("/auth/logout", {
      body: {},
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const { data, error, response } = await this.client.POST("/auth/refresh", {
      body: {},
      headers: { Cookie: `refresh_token=${refreshToken}` },
    });
    if (error) throw mapHttpError(error);
    const raw = unwrap<{ accessToken: string }>(data);
    return {
      accessToken: raw.accessToken,
      user: undefined as unknown as User,
      refreshToken: extractRefreshToken(response),
    };
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const { data, error } = await this.client.GET("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (error) throw mapHttpError(error);
    const raw = unwrap<Parameters<typeof UserMapper.toDomain>[0]>(data);
    return UserMapper.toDomain(raw);
  }
}
