import { HttpAuthGateway } from "@/modules/auth/infrastructure/http-auth.gateway";
import { NextCookieSessionGateway } from "@/modules/auth/infrastructure/next-cookie-session.gateway";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/register.use-case";
import { LogoutUseCase } from "@/modules/auth/application/use-cases/logout.use-case";
import { RefreshSessionUseCase } from "@/modules/auth/application/use-cases/refresh-session.use-case";
import { GetCurrentUserUseCase } from "@/modules/auth/application/use-cases/get-current-user.use-case";
import { HttpCategoryGateway } from "@/modules/categories/infrastructure/http-category.gateway";
import { ListCategoriesUseCase } from "@/modules/categories/application/use-cases/list-categories.use-case";
import { GetCategoryUseCase } from "@/modules/categories/application/use-cases/get-category.use-case";
import { CreateCategoryUseCase } from "@/modules/categories/application/use-cases/create-category.use-case";
import { UpdateCategoryUseCase } from "@/modules/categories/application/use-cases/update-category.use-case";
import { DeleteCategoryUseCase } from "@/modules/categories/application/use-cases/delete-category.use-case";
import { RestoreCategoryUseCase } from "@/modules/categories/application/use-cases/restore-category.use-case";
import { HttpGoalGateway } from "@/modules/goals/infrastructure/http-goal.gateway";
import { ListGoalsUseCase } from "@/modules/goals/application/use-cases/list-goals.use-case";
import { GetGoalUseCase } from "@/modules/goals/application/use-cases/get-goal.use-case";
import { CreateGoalUseCase } from "@/modules/goals/application/use-cases/create-goal.use-case";
import { UpdateGoalUseCase } from "@/modules/goals/application/use-cases/update-goal.use-case";
import { DeleteGoalUseCase } from "@/modules/goals/application/use-cases/delete-goal.use-case";
import { RestoreGoalUseCase } from "@/modules/goals/application/use-cases/restore-goal.use-case";
import { ListGoalInstancesUseCase } from "@/modules/goals/application/use-cases/list-goal-instances.use-case";
import { createServerClient } from "@/shared/infrastructure/api/server-client";

export interface AuthUseCases {
  login: LoginUseCase;
  register: RegisterUseCase;
  logout: LogoutUseCase;
  refreshSession: RefreshSessionUseCase;
  getCurrentUser: GetCurrentUserUseCase;
}

export interface CategoryUseCases {
  list: ListCategoriesUseCase;
  get: GetCategoryUseCase;
  create: CreateCategoryUseCase;
  update: UpdateCategoryUseCase;
  delete: DeleteCategoryUseCase;
  restore: RestoreCategoryUseCase;
}

export interface GoalUseCases {
  list: ListGoalsUseCase;
  get: GetGoalUseCase;
  create: CreateGoalUseCase;
  update: UpdateGoalUseCase;
  delete: DeleteGoalUseCase;
  restore: RestoreGoalUseCase;
  listInstances: ListGoalInstancesUseCase;
}

export interface ServerContainer {
  auth: AuthUseCases;
  categories: CategoryUseCases;
  goals: GoalUseCases;
  health: { check: () => Promise<{ ok: boolean; timestamp: string }> };
}

export async function serverContainer(): Promise<ServerContainer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const httpClient = (await createServerClient()) as any;

  const authGateway = new HttpAuthGateway(httpClient);
  const sessionGateway = new NextCookieSessionGateway();

  const categoryGateway = new HttpCategoryGateway(httpClient);
  const goalGateway = new HttpGoalGateway(httpClient);

  return {
    auth: {
      login: new LoginUseCase(authGateway, sessionGateway),
      register: new RegisterUseCase(authGateway, sessionGateway),
      logout: new LogoutUseCase(authGateway, sessionGateway),
      refreshSession: new RefreshSessionUseCase(authGateway, sessionGateway),
      getCurrentUser: new GetCurrentUserUseCase(authGateway, sessionGateway),
    },
    categories: {
      list: new ListCategoriesUseCase(categoryGateway),
      get: new GetCategoryUseCase(categoryGateway),
      create: new CreateCategoryUseCase(categoryGateway),
      update: new UpdateCategoryUseCase(categoryGateway),
      delete: new DeleteCategoryUseCase(categoryGateway),
      restore: new RestoreCategoryUseCase(categoryGateway),
    },
    goals: {
      list: new ListGoalsUseCase(goalGateway),
      get: new GetGoalUseCase(goalGateway),
      create: new CreateGoalUseCase(goalGateway),
      update: new UpdateGoalUseCase(goalGateway),
      delete: new DeleteGoalUseCase(goalGateway),
      restore: new RestoreGoalUseCase(goalGateway),
      listInstances: new ListGoalInstancesUseCase(goalGateway),
    },
    health: {
      check: async () => ({ ok: true, timestamp: new Date().toISOString() }),
    },
  };
}
