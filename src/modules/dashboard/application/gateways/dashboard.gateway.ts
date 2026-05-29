import type { DashboardSummary } from "@/modules/dashboard/domain/summary";
import type { TimelineData, TimelineRange } from "@/modules/dashboard/domain/timeline-point";
import type { UpcomingItem } from "@/modules/dashboard/domain/upcoming-item";
import type { ActivityPage } from "@/modules/dashboard/domain/activity-log";

export interface DashboardGateway {
  getSummary(): Promise<DashboardSummary>;
  getTimeline(range: TimelineRange): Promise<TimelineData>;
  getUpcoming(limit?: number): Promise<UpcomingItem[]>;
  getActivity(limit?: number, cursor?: string): Promise<ActivityPage>;
}
