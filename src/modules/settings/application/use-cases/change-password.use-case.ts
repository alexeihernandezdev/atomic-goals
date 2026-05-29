import type { SettingsGateway, ChangePasswordCommand } from "../gateways/settings.gateway";

export class ChangePasswordUseCase {
  constructor(private readonly gateway: SettingsGateway) {}
  async execute(command: ChangePasswordCommand): Promise<void> {
    return this.gateway.changePassword(command);
  }
}
