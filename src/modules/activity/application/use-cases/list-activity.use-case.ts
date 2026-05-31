import type { ActivityGateway, ListActivityQuery } from "../gateways/activity.gateway";
import type { ActivityPage } from "../../domain/activity-entry";

export class ListActivityUseCase {
  constructor(private readonly gateway: ActivityGateway) {}

  async execute(query?: ListActivityQuery): Promise<ActivityPage> {
    return this.gateway.listActivity(query);
  }
}
