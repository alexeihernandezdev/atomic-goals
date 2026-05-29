export type ActivityKind =
  | "GOAL_CREATED"
  | "GOAL_COMPLETED"
  | "GOAL_UPDATED"
  | "STEP_UPDATED"
  | "STEP_COMPLETED"
  | "STREAK_MILESTONE"
  | "CATEGORY_CREATED";

export interface ActivityLog {
  id: string;
  kind: ActivityKind;
  entityName: string;
  detail?: string | null;
  color?: string | null;
  createdAt: string;
}

export interface ActivityPage {
  items: ActivityLog[];
  nextCursor?: string | null;
}
