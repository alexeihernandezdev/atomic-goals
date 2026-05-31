import type { TrashEntityType, TrashList } from "../../domain/trashed-item";

export interface TrashGateway {
  listAll(): Promise<TrashList>;
  restore(entityType: TrashEntityType, id: string): Promise<void>;
  permanentDelete(entityType: TrashEntityType, id: string): Promise<void>;
}
