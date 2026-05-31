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
import { HttpGoalGateway } from "@/modules/goals/infrastructure/http-goal.gateway";
import { ListGoalsUseCase } from "@/modules/goals/application/use-cases/list-goals.use-case";
import { GetGoalUseCase } from "@/modules/goals/application/use-cases/get-goal.use-case";
import { CreateGoalUseCase } from "@/modules/goals/application/use-cases/create-goal.use-case";
import { UpdateGoalUseCase } from "@/modules/goals/application/use-cases/update-goal.use-case";
import { DeleteGoalUseCase } from "@/modules/goals/application/use-cases/delete-goal.use-case";
import { HttpCalendarGateway } from "@/modules/calendar/infrastructure/http-calendar.gateway";
import { GetCalendarEventsUseCase } from "@/modules/calendar/application/use-cases/get-calendar-events.use-case";
import { HttpActivityGateway } from "@/modules/activity/infrastructure/http-activity.gateway";
import { ListActivityUseCase } from "@/modules/activity/application/use-cases/list-activity.use-case";
import { HttpTrashGateway } from "@/modules/trash/infrastructure/http-trash.gateway";
import { ListTrashUseCase } from "@/modules/trash/application/use-cases/list-trash.use-case";
import { RestoreItemUseCase } from "@/modules/trash/application/use-cases/restore-item.use-case";
import { PermanentDeleteUseCase } from "@/modules/trash/application/use-cases/permanent-delete.use-case";
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

export interface GoalUseCases {
  list: ListGoalsUseCase;
  get: GetGoalUseCase;
  create: CreateGoalUseCase;
  update: UpdateGoalUseCase;
  delete: DeleteGoalUseCase;
}

export interface CalendarUseCases {
  getEvents: GetCalendarEventsUseCase;
}

export interface ActivityUseCases {
  list: ListActivityUseCase;
}

export interface TrashUseCases {
  listAll: ListTrashUseCase;
  restore: RestoreItemUseCase;
  permanentDelete: PermanentDeleteUseCase;
}

export interface ClientContainer {
  auth: AuthUseCases;
  categories: CategoryUseCases;
  goals: GoalUseCases;
  calendar: CalendarUseCases;
  activity: ActivityUseCases;
  trash: TrashUseCases;
}

let _container: ClientContainer | null = null;

export function clientContainer(): ClientContainer {
  if (!_container) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = apiClient as any;
    const authGateway = new HttpAuthGateway(client);
    const sessionGateway = new BrowserSessionGateway();
    const categoryGateway = new HttpCategoryGateway(client);
    const goalGateway = new HttpGoalGateway(client);
    const calendarGateway = new HttpCalendarGateway(client);
    const activityGateway = new HttpActivityGateway(client);
    const trashGateway = new HttpTrashGateway(client);

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
      goals: {
        list: new ListGoalsUseCase(goalGateway),
        get: new GetGoalUseCase(goalGateway),
        create: new CreateGoalUseCase(goalGateway),
        update: new UpdateGoalUseCase(goalGateway),
        delete: new DeleteGoalUseCase(goalGateway),
      },
      calendar: {
        getEvents: new GetCalendarEventsUseCase(calendarGateway),
      },
      activity: {
        list: new ListActivityUseCase(activityGateway),
      },
      trash: {
        listAll: new ListTrashUseCase(trashGateway),
        restore: new RestoreItemUseCase(trashGateway),
        permanentDelete: new PermanentDeleteUseCase(trashGateway),
      },
    };
  }
  return _container;
}
