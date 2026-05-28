export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface LoginCommand {
  email: string;
  password: string;
}

export interface RegisterCommand {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
}
