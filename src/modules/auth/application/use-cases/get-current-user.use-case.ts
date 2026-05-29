import type { AuthGateway } from "../gateways/auth.gateway";
import type { SessionGateway } from "../gateways/session.gateway";
import type { User } from "@/modules/auth/domain/entities/user";
import { UnauthorizedError } from "@/shared/domain/errors/unauthorized.error";

export class GetCurrentUserUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly sessionGateway: SessionGateway,
  ) {}

  async execute(): Promise<User | null> {
    const token = await this.sessionGateway.getAccessToken();
    if (!token) return null;
    try {
      return await this.authGateway.getCurrentUser(token);
    } catch (e) {
      if (e instanceof UnauthorizedError) return null;
      throw e;
    }
  }
}
