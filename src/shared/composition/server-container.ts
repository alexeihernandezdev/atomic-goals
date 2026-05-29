import { HttpAuthGateway } from "@/modules/auth/infrastructure/http-auth.gateway";
import { NextCookieSessionGateway } from "@/modules/auth/infrastructure/next-cookie-session.gateway";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/register.use-case";
import { LogoutUseCase } from "@/modules/auth/application/use-cases/logout.use-case";
import { RefreshSessionUseCase } from "@/modules/auth/application/use-cases/refresh-session.use-case";
import { GetCurrentUserUseCase } from "@/modules/auth/application/use-cases/get-current-user.use-case";
import { createServerClient } from "@/shared/infrastructure/api/server-client";

export interface AuthUseCases {
  login: LoginUseCase;
  register: RegisterUseCase;
  logout: LogoutUseCase;
  refreshSession: RefreshSessionUseCase;
  getCurrentUser: GetCurrentUserUseCase;
}

export interface ServerContainer {
  auth: AuthUseCases;
  health: { check: () => Promise<{ ok: boolean; timestamp: string }> };
  // categories: CategoryUseCases — Phase 2
  // goals:      GoalUseCases     — Phase 3
  // steps:      StepUseCases     — Phase 4
  // dashboard:  DashboardUseCases — Phase 5
}

export async function serverContainer(): Promise<ServerContainer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const httpClient = (await createServerClient()) as any;
  const authGateway = new HttpAuthGateway(httpClient);
  const sessionGateway = new NextCookieSessionGateway();

  return {
    auth: {
      login: new LoginUseCase(authGateway, sessionGateway),
      register: new RegisterUseCase(authGateway, sessionGateway),
      logout: new LogoutUseCase(authGateway, sessionGateway),
      refreshSession: new RefreshSessionUseCase(authGateway, sessionGateway),
      getCurrentUser: new GetCurrentUserUseCase(authGateway, sessionGateway),
    },
    health: {
      check: async () => ({ ok: true, timestamp: new Date().toISOString() }),
    },
  };
}
