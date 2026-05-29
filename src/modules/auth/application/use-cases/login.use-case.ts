import type { AuthGateway } from "../gateways/auth.gateway";
import type { SessionGateway } from "../gateways/session.gateway";
import type { AuthResult, LoginCommand } from "@/modules/auth/domain/entities/user";

export class LoginUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly sessionGateway: SessionGateway,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResult> {
    const result = await this.authGateway.login(command);
    await this.sessionGateway.setSession(result.accessToken, result.user, result.refreshToken);
    return result;
  }
}
