import type { DashboardGateway } from "../gateways/dashboard.gateway";
import type { DashboardSummary } from "../../domain/summary";

export class GetSummaryUseCase {
  constructor(private readonly gateway: DashboardGateway) {}

  async execute(): Promise<DashboardSummary> {
    return this.gateway.getSummary();
  }
}
