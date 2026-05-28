import type {
  AuthResult,
  LoginCommand,
  RegisterCommand,
  User,
} from "@/modules/auth/domain/entities/user";

export interface AuthGateway {
  login(command: LoginCommand): Promise<AuthResult>;
  register(command: RegisterCommand): Promise<AuthResult>;
  logout(accessToken: string): Promise<void>;
  refresh(refreshToken: string): Promise<AuthResult>;
  getCurrentUser(accessToken: string): Promise<User>;
}
