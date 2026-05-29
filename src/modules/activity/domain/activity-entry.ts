export type ActivityKind =
  | "GOAL_CREATED"
  | "GOAL_COMPLETED"
  | "GOAL_UPDATED"
  | "STEP_UPDATED"
  | "STEP_COMPLETED"
  | "STREAK_MILESTONE"
  | "CATEGORY_CREATED";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  entityName: string;
  detail: string | null;
  categoryColor: string | null;
  createdAt: string; // ISO
}

export interface ActivityPage {
  items: ActivityEntry[];
  nextCursor: string | null;
}
