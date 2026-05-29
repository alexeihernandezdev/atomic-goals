"use client";

import { HttpAuthGateway } from "@/modules/auth/infrastructure/http-auth.gateway";
import { BrowserSessionGateway } from "@/modules/auth/infrastructure/browser-session.gateway";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/register.use-case";
import { LogoutUseCase } from "@/modules/auth/application/use-cases/logout.use-case";
import { GetCurrentUserUseCase } from "@/modules/auth/application/use-cases/get-current-user.use-case";
import { HttpCategoryGateway } from "@/modules/categories/infrastructure/http-category.gateway";
import { ListCategoriesUseCase } from "@/modules/categories/application/use-cases/list-categories.use-case";
import { GetCategoryUseCase } from "@/modules/categories/application/use-cases/get-category.use-case";
import { CreateCategoryUseCase } from "@/modules/categories/application/use-cases/create-category.use-case";
import { UpdateCategoryUseCase } from "@/modules/categories/application/use-cases/update-category.use-case";
import { DeleteCategoryUseCase } from "@/modules/categories/application/use-cases/delete-category.use-case";
import { apiClient } from "@/shared/infrastructure/api/openapi-client";

export interface AuthUseCases {
  login: LoginUseCase;
  register: RegisterUseCase;
  logout: LogoutUseCase;
  getCurrentUser: GetCurrentUserUseCase;
}

export interface CategoryUseCases {
  list: ListCategoriesUseCase;
  get: GetCategoryUseCase;
  create: CreateCategoryUseCase;
  update: UpdateCategoryUseCase;
  delete: DeleteCategoryUseCase;
}

export interface ClientContainer {
  auth: AuthUseCases;
  categories: CategoryUseCases;
}

let _container: ClientContainer | null = null;

export function clientContainer(): ClientContainer {
  if (!_container) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = apiClient as any;
    const authGateway = new HttpAuthGateway(client);
    const sessionGateway = new BrowserSessionGateway();
    const categoryGateway = new HttpCategoryGateway(client);

    _container = {
      auth: {
        login: new LoginUseCase(authGateway, sessionGateway),
        register: new RegisterUseCase(authGateway, sessionGateway),
        logout: new LogoutUseCase(authGateway, sessionGateway),
        getCurrentUser: new GetCurrentUserUseCase(authGateway, sessionGateway),
      },
      categories: {
        list: new ListCategoriesUseCase(categoryGateway),
        get: new GetCategoryUseCase(categoryGateway),
        create: new CreateCategoryUseCase(categoryGateway),
        update: new UpdateCategoryUseCase(categoryGateway),
        delete: new DeleteCategoryUseCase(categoryGateway),
      },
    };
  }
  return _container;
}
