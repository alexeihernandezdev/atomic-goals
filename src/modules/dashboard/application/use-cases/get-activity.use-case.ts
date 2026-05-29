import type { DashboardGateway } from "../gateways/dashboard.gateway";
import type { ActivityPage } from "../../domain/activity-log";

export class GetActivityUseCase {
  constructor(private readonly gateway: DashboardGateway) {}

  async execute(limit = 8, cursor?: string): Promise<ActivityPage> {
    return this.gateway.getActivity(limit, cursor);
  }
}
