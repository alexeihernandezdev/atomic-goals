import type { CategoryGateway } from "../gateways/category.gateway";
import type { Category } from "@/modules/categories/domain/entities/category";

export class ListCategoriesUseCase {
  constructor(private readonly gateway: CategoryGateway) {}
  async execute(): Promise<Category[]> {
    return this.gateway.list();
  }
}
