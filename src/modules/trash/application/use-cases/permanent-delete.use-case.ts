import type { TrashGateway } from "../gateways/trash.gateway";
import type { TrashEntityType } from "../../domain/trashed-item";

export class PermanentDeleteUseCase {
  constructor(private readonly gateway: TrashGateway) {}
  async execute(entityType: TrashEntityType, id: string): Promise<void> {
    return this.gateway.permanentDelete(entityType, id);
  }
}
