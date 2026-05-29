import type { CategoryGateway } from "../gateways/category.gateway";
import type {
  Category,
  UpdateCategoryCommand,
} from "@/modules/categories/domain/entities/category";

export class UpdateCategoryUseCase {
  constructor(private readonly gateway: CategoryGateway) {}
  async execute(command: UpdateCategoryCommand): Promise<Category> {
    return this.gateway.update(command);
  }
}
