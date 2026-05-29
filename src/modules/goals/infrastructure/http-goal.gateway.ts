import type { GoalGateway, GoalWithInstance } from "@/modules/goals/application/gateways/goal.gateway";
import type {
  Goal,
  GoalInstance,
  CreateGoalCommand,
  UpdateGoalCommand,
  ListGoalsQuery,
} from "@/modules/goals/domain/entities/goal";
import { mapHttpError } from "@/shared/infrastructure/api/http-error";
import { GoalMapper, type RawGoal, type RawGoalInstance } from "./mappers/goal.mapper";

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

export class HttpGoalGateway implements GoalGateway {
  constructor(private readonly client: ApiClient) {}

  async list(query?: ListGoalsQuery): Promise<Goal[]> {
    const { data, error } = await this.client.GET("/goals", {
      params: query as Record<string, unknown>,
    });
    if (error) throw mapHttpError(error);
    return unwrap<RawGoal[]>(data).map(GoalMapper.toDomain);
  }

  async get(id: string): Promise<GoalWithInstance> {
    const { data, error } = await this.client.GET(`/goals/${id}`);
    if (error) throw mapHttpError(error);
    return GoalMapper.toDomain(unwrap<RawGoal>(data));
  }

  async create(command: CreateGoalCommand): Promise<GoalWithInstance> {
    const { data, error } = await this.client.POST("/goals", { body: command });
    if (error) throw mapHttpError(error);
    return GoalMapper.toDomain(unwrap<RawGoal>(data));
  }

  async update(command: UpdateGoalCommand): Promise<Goal> {
    const { id, ...body } = command;
    const { data, error } = await this.client.PATCH(`/goals/${id}`, { body });
    if (error) throw mapHttpError(error);
    return GoalMapper.toDomain(unwrap<RawGoal>(data));
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.DELETE(`/goals/${id}`);
    if (error) throw mapHttpError(error);
  }

  async restore(id: string): Promise<Goal> {
    const { data, error } = await this.client.POST(`/goals/${id}/restore`, { body: {} });
    if (error) throw mapHttpError(error);
    return GoalMapper.toDomain(unwrap<RawGoal>(data));
  }

  async listInstances(goalId: string): Promise<GoalInstance[]> {
    const { data, error } = await this.client.GET(`/goals/${goalId}/instances`);
    if (error) throw mapHttpError(error);
    return unwrap<RawGoalInstance[]>(data).map(GoalMapper.instanceToDomain);
  }
}
