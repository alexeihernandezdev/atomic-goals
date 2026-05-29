import type {
  Category,
  CreateCategoryCommand,
  UpdateCategoryCommand,
} from "@/modules/categories/domain/entities/category";

export interface CategoryGateway {
  list(): Promise<Category[]>;
  get(id: string): Promise<Category>;
  create(command: CreateCategoryCommand): Promise<Category>;
  update(command: UpdateCategoryCommand): Promise<Category>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<Category>;
}
