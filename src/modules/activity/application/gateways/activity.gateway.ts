import type { ActivityPage } from "../../domain/activity-entry";

export interface ListActivityQuery {
  limit?: number;
  cursor?: string;
}

export interface ActivityGateway {
  listActivity(query?: ListActivityQuery): Promise<ActivityPage>;
}
