import type { AuthGateway } from "../gateways/auth.gateway";
import type { SessionGateway } from "../gateways/session.gateway";
import type { AuthResult, RegisterCommand } from "@/modules/auth/domain/entities/user";

export class RegisterUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly sessionGateway: SessionGateway,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthResult> {
    const result = await this.authGateway.register(command);
    await this.sessionGateway.setSession(result.accessToken, result.user, result.refreshToken);
    return result;
  }
}
