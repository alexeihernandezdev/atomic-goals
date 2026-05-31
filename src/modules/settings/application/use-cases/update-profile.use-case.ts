import type { SettingsGateway, UpdateProfileCommand } from "../gateways/settings.gateway";
import type { UserProfile } from "../../domain/profile";

export class UpdateProfileUseCase {
  constructor(private readonly gateway: SettingsGateway) {}
  async execute(command: UpdateProfileCommand): Promise<UserProfile> {
    return this.gateway.updateProfile(command);
  }
}
