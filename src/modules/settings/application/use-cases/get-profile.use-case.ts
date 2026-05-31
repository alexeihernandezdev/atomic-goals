import type { SettingsGateway } from "../gateways/settings.gateway";
import type { UserProfile } from "../../domain/profile";

export class GetProfileUseCase {
  constructor(private readonly gateway: SettingsGateway) {}
  async execute(): Promise<UserProfile> {
    return this.gateway.getProfile();
  }
}
