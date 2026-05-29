import type { TrashGateway } from "../gateways/trash.gateway";
import type { TrashList } from "../../domain/trashed-item";

export class ListTrashUseCase {
  constructor(private readonly gateway: TrashGateway) {}
  async execute(): Promise<TrashList> {
    return this.gateway.listAll();
  }
}
