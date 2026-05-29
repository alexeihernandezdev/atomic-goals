"use client";

import { HttpAuthGateway } from "@/modules/auth/infrastructure/http-auth.gateway";
import { BrowserSessionGateway } from "@/modules/auth/infrastructure/browser-session.gateway";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/register.use-case";
import { LogoutUseCase } from "@/modules/auth/application/use-cases/logout.use-case";
import { GetCurrentUserUseCase } from "@/modules/auth/application/use-cases/get-current-user.use-case";
import { apiClient } from "@/shared/infrastructure/api/openapi-client";

export interface AuthUseCases {
  login: LoginUseCase;
  register: RegisterUseCase;
  logout: LogoutUseCase;
  getCurrentUser: GetCurrentUserUseCase;
}

export interface ClientContainer {
  auth: AuthUseCases;
  // categories: CategoryUseCases — wired in Phase 2
  // goals:      GoalUseCases     — wired in Phase 3
  // steps:      StepUseCases     — wired in Phase 4
}

let _container: ClientContainer | null = null;

export function clientContainer(): ClientContainer {
  if (!_container) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authGateway = new HttpAuthGateway(apiClient as any);
    const sessionGateway = new BrowserSessionGateway();

    _container = {
      auth: {
        login: new LoginUseCase(authGateway, sessionGateway),
        register: new RegisterUseCase(authGateway, sessionGateway),
        logout: new LogoutUseCase(authGateway, sessionGateway),
        getCurrentUser: new GetCurrentUserUseCase(authGateway, sessionGateway),
      },
    };
  }
  return _container;
}
