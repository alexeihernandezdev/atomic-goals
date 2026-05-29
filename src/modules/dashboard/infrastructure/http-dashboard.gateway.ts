import type { DashboardGateway } from "../application/gateways/dashboard.gateway";
import type { DashboardSummary } from "../domain/summary";
import type { TimelineData, TimelineRange } from "../domain/timeline-point";
import type { UpcomingItem } from "../domain/upcoming-item";
import type { ActivityPage } from "../domain/activity-log";
import { mapHttpError } from "@/shared/infrastructure/api/http-error";
import { DashboardMapper } from "./mappers/dashboard.mapper";

interface ApiClient {
  GET(
    path: string,
    options?: { params?: Record<string, unknown> },
  ): Promise<{ data: unknown; error: unknown }>;
}

function unwrap<T>(data: unknown): T {
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export class HttpDashboardGateway implements DashboardGateway {
  constructor(private readonly client: ApiClient) {}

  async getSummary(): Promise<DashboardSummary> {
    const { data, error } = await this.client.GET("/dashboard/summary");
    if (error) throw mapHttpError(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return DashboardMapper.summaryToDomain(unwrap<any>(data));
  }

  async getTimeline(range: TimelineRange = "month"): Promise<TimelineData> {
    const { data, error } = await this.client.GET("/dashboard/timeline", {
      params: { query: { range } },
    });
    if (error) throw mapHttpError(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return DashboardMapper.timelineToDomain(unwrap<any>(data), range);
  }

  async getUpcoming(limit = 5): Promise<UpcomingItem[]> {
    const { data, error } = await this.client.GET("/dashboard/upcoming", {
      params: { query: { limit } },
    });
    if (error) throw mapHttpError(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = unwrap<any[]>(data);
    return Array.isArray(raw) ? raw.map(DashboardMapper.upcomingToDomain) : [];
  }

  async getActivity(limit = 8, cursor?: string): Promise<ActivityPage> {
    const { data, error } = await this.client.GET("/activity", {
      params: { query: { limit, ...(cursor ? { cursor } : {}) } },
    });
    if (error) throw mapHttpError(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return DashboardMapper.activityPageToDomain(unwrap<any>(data));
  }
}
