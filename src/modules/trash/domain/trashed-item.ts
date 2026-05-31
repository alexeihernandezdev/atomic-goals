export type TrashEntityType = "category" | "goal" | "step";

export interface TrashedItem {
  id: string;
  name: string;
  entityType: TrashEntityType;
  color: string | null;
  deletedLabel: string; // relative time, e.g. "hace 2 días"
  daysUntilExpiry: number | null;
  meta: string; // description text shown below the name
}

export interface TrashList {
  goals: TrashedItem[];
  categories: TrashedItem[];
  steps: TrashedItem[];
}
