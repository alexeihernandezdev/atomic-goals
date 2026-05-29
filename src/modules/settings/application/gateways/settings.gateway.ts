import type { UserProfile } from "../../domain/profile";

export interface UpdateProfileCommand {
  name: string;
}

export interface ChangePasswordCommand {
  currentPassword: string;
  newPassword: string;
}

export interface SettingsGateway {
  getProfile(): Promise<UserProfile>;
  updateProfile(command: UpdateProfileCommand): Promise<UserProfile>;
  changePassword(command: ChangePasswordCommand): Promise<void>;
}
