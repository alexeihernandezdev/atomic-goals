import type { ActivityGateway, ListActivityQuery } from "../application/gateways/activity.gateway";
import type { ActivityPage } from "../domain/activity-entry";
import { mapHttpError } from "@/shared/infrastructure/api/http-error";
import { ActivityMapper } from "./mappers/activity.mapper";

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

export class HttpActivityGateway implements ActivityGateway {
  constructor(private readonly client: ApiClient) {}

  async listActivity(query?: ListActivityQuery): Promise<ActivityPage> {
    const params: Record<string, unknown> = {};
    if (query?.limit != null) params.limit = query.limit;
    if (query?.cursor) params.cursor = query.cursor;

    const { data, error } = await this.client.GET("/activity", {
      params: Object.keys(params).length ? { query: params } : undefined,
    });
    if (error) throw mapHttpError(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ActivityMapper.pageToDomain(unwrap<any>(data));
  }
}
