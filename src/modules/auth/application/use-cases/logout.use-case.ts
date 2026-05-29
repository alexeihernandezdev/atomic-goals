import type { AuthGateway } from "../gateways/auth.gateway";
import type { SessionGateway } from "../gateways/session.gateway";

export class LogoutUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly sessionGateway: SessionGateway,
  ) {}

  async execute(): Promise<void> {
    const token = await this.sessionGateway.getAccessToken();
    if (token) {
      try {
        await this.authGateway.logout(token);
      } catch {
        // best-effort — always clear local session
      }
    }
    await this.sessionGateway.clearSession();
  }
}
