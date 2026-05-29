import type { CategoryGateway } from "../gateways/category.gateway";

export class DeleteCategoryUseCase {
  constructor(private readonly gateway: CategoryGateway) {}
  async execute(id: string): Promise<void> {
    return this.gateway.delete(id);
  }
}
