import type { StepGateway } from "../application/gateways/step.gateway";
import type {
  Step,
  CreateStepCommand,
  UpdateStepMetadataCommand,
  UpdateStepProgressCommand,
} from "../domain/entities/step";
import { mapHttpError } from "@/shared/infrastructure/api/http-error";
import { StepMapper, type RawStep } from "./mappers/step.mapper";

interface ApiClient {
  GET(
    path: string,
    options?: { params?: Record<string, unknown> },
  ): Promise<{ data: unknown; error: unknown }>;
  POST(
    path: string,
    options: { body: unknown },
  ): Promise<{ data: unknown; error: unknown }>;
  PATCH(
    path: string,
    options: { body: unknown },
  ): Promise<{ data: unknown; error: unknown }>;
  DELETE(
    path: string,
    options?: Record<string, unknown>,
  ): Promise<{ data: unknown; error: unknown }>;
}

function unwrap<T>(data: unknown): T {
  return (data as { data: T }).data;
}

export class HttpStepGateway implements StepGateway {
  constructor(private readonly client: ApiClient) {}

  async listByInstance(goalInstanceId: string): Promise<Step[]> {
    const { data, error } = await this.client.GET(
      `/goal-instances/${goalInstanceId}`,
    );
    if (error) throw mapHttpError(error);
    const raw = unwrap<{ steps?: RawStep[] }>(data);
    return (raw.steps ?? []).map(StepMapper.toDomain);
  }

  async get(id: string): Promise<Step> {
    const { data, error } = await this.client.GET(`/steps/${id}`);
    if (error) throw mapHttpError(error);
    return StepMapper.toDomain(unwrap<RawStep>(data));
  }

  async create(command: CreateStepCommand): Promise<Step> {
    const { data, error } = await this.client.POST("/steps", {
      body: command,
    });
    if (error) throw mapHttpError(error);
    return StepMapper.toDomain(unwrap<RawStep>(data));
  }

  async updateMetadata(command: UpdateStepMetadataCommand): Promise<Step> {
    const { id, ...body } = command;
    const { data, error } = await this.client.PATCH(`/steps/${id}/metadata`, {
      body,
    });
    if (error) throw mapHttpError(error);
    return StepMapper.toDomain(unwrap<RawStep>(data));
  }

  async updateProgress(command: UpdateStepProgressCommand): Promise<Step> {
    const { id, ...body } = command;
    const { data, error } = await this.client.PATCH(`/steps/${id}`, { body });
    if (error) throw mapHttpError(error);
    return StepMapper.toDomain(unwrap<RawStep>(data));
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.DELETE(`/steps/${id}`);
    if (error) throw mapHttpError(error);
  }

  async restore(id: string): Promise<Step> {
    const { data, error } = await this.client.POST(`/steps/${id}/restore`, {
      body: {},
    });
    if (error) throw mapHttpError(error);
    return StepMapper.toDomain(unwrap<RawStep>(data));
  }

  async reorder(id: string, newOrder: number): Promise<void> {
    const { error } = await this.client.POST(`/steps/${id}/reorder`, {
      body: { newOrder },
    });
    if (error) throw mapHttpError(error);
  }
}
