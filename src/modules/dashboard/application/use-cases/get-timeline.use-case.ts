import type { DashboardGateway } from "../gateways/dashboard.gateway";
import type { TimelineData, TimelineRange } from "../../domain/timeline-point";

export class GetTimelineUseCase {
  constructor(private readonly gateway: DashboardGateway) {}

  async execute(range: TimelineRange = "month"): Promise<TimelineData> {
    return this.gateway.getTimeline(range);
  }
}
