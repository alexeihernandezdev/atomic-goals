import type { TrashGateway } from "../application/gateways/trash.gateway";
import type { TrashEntityType, TrashList } from "../domain/trashed-item";
import { mapHttpError } from "@/shared/infrastructure/api/http-error";
import { TrashMapper } from "./mappers/trash.mapper";

interface ApiClient {
  GET(path: string, options?: { params?: Record<string, unknown> }): Promise<{ data: unknown; error: unknown }>;
  POST(path: string, options?: { params?: Record<string, unknown> }): Promise<{ data: unknown; error: unknown }>;
  DELETE(path: string, options?: { params?: Record<string, unknown> }): Promise<{ data: unknown; error: unknown }>;
}

function unwrap<T>(data: unknown): T {
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export class HttpTrashGateway implements TrashGateway {
  constructor(private readonly client: ApiClient) {}

  async listAll(): Promise<TrashList> {
    const { data, error } = await this.client.GET("/trash");
    if (error) throw mapHttpError(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return TrashMapper.toDomainList(unwrap<any>(data) ?? {});
  }

  async restore(entityType: TrashEntityType, id: string): Promise<void> {
    const { error } = await this.client.POST(`/trash/restore/${entityType}/${id}`);
    if (error) throw mapHttpError(error);
  }

  async permanentDelete(entityType: TrashEntityType, id: string): Promise<void> {
    const { error } = await this.client.DELETE(`/trash/${entityType}/${id}/permanent`);
    if (error) throw mapHttpError(error);
  }
}
