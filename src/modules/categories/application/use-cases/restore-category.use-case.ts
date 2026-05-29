import type { CategoryGateway } from "../gateways/category.gateway";
import type { Category } from "@/modules/categories/domain/entities/category";

export class RestoreCategoryUseCase {
  constructor(private readonly gateway: CategoryGateway) {}
  async execute(id: string): Promise<Category> {
    return this.gateway.restore(id);
  }
}
