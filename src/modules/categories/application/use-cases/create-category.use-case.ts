import type { CategoryGateway } from "../gateways/category.gateway";
import type {
  Category,
  CreateCategoryCommand,
} from "@/modules/categories/domain/entities/category";

export class CreateCategoryUseCase {
  constructor(private readonly gateway: CategoryGateway) {}
  async execute(command: CreateCategoryCommand): Promise<Category> {
    return this.gateway.create(command);
  }
}
