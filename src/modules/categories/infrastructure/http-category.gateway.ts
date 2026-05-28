import type { CategoryGateway } from "@/modules/categories/application/gateways/category.gateway";
import type {
  Category,
  CreateCategoryCommand,
  UpdateCategoryCommand,
} from "@/modules/categories/domain/entities/category";
import { mapHttpError } from "@/shared/infrastructure/api/http-error";
import {
  CategoryMapper,
  type RawCategory,
} from "./mappers/category.mapper";

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

// All responses are wrapped by TransformInterceptor: { data: T }
function unwrap<T>(data: unknown): T {
  return (data as { data: T }).data;
}

export class HttpCategoryGateway implements CategoryGateway {
  constructor(private readonly client: ApiClient) {}

  async list(): Promise<Category[]> {
    const { data, error } = await this.client.GET("/categories");
    if (error) throw mapHttpError(error);
    return unwrap<RawCategory[]>(data).map(CategoryMapper.toDomain);
  }

  async get(id: string): Promise<Category> {
    const { data, error } = await this.client.GET(`/categories/${id}`);
    if (error) throw mapHttpError(error);
    return CategoryMapper.toDomain(unwrap<RawCategory>(data));
  }

  async create(command: CreateCategoryCommand): Promise<Category> {
    const { data, error } = await this.client.POST("/categories", {
      body: command,
    });
    if (error) throw mapHttpError(error);
    return CategoryMapper.toDomain(unwrap<RawCategory>(data));
  }

  async update(command: UpdateCategoryCommand): Promise<Category> {
    const { id, ...body } = command;
    const { data, error } = await this.client.PATCH(`/categories/${id}`, {
      body,
    });
    if (error) throw mapHttpError(error);
    return CategoryMapper.toDomain(unwrap<RawCategory>(data));
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.DELETE(`/categories/${id}`);
    if (error) throw mapHttpError(error);
  }

  async restore(id: string): Promise<Category> {
    const { data, error } = await this.client.POST(
      `/categories/${id}/restore`,
      { body: {} },
    );
    if (error) throw mapHttpError(error);
    return CategoryMapper.toDomain(unwrap<RawCategory>(data));
  }
}
