import type { DashboardGateway } from "../gateways/dashboard.gateway";
import type { UpcomingItem } from "../../domain/upcoming-item";

export class GetUpcomingUseCase {
  constructor(private readonly gateway: DashboardGateway) {}

  async execute(limit = 5): Promise<UpcomingItem[]> {
    return this.gateway.getUpcoming(limit);
  }
}
