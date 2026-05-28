import type { AuthGateway } from "../gateways/auth.gateway";
import type { SessionGateway } from "../gateways/session.gateway";
import type { AuthResult } from "@/modules/auth/domain/entities/user";

export class RefreshSessionUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly sessionGateway: SessionGateway,
  ) {}

  async execute(refreshToken: string): Promise<AuthResult> {
    const result = await this.authGateway.refresh(refreshToken);
    await this.sessionGateway.setSession(result.accessToken, result.user);
    return result;
  }
}
