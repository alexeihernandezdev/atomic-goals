import type { ActivityEntry, ActivityKind, ActivityPage } from "../../domain/activity-entry";

const VALID_KINDS: ActivityKind[] = [
  "GOAL_CREATED", "GOAL_COMPLETED", "GOAL_UPDATED",
  "STEP_UPDATED", "STEP_COMPLETED", "STREAK_MILESTONE", "CATEGORY_CREATED",
];

interface RawEntry {
  id?: string;
  kind?: string;
  type?: string;
  entityName?: string;
  name?: string;
  detail?: string | null;
  description?: string | null;
  color?: string | null;
  categoryColor?: string | null;
  createdAt?: string;
}

interface RawPage {
  items?: RawEntry[];
  data?: RawEntry[];
  nextCursor?: string | null;
  cursor?: string | null;
}

export class ActivityMapper {
  static entryToDomain(raw: RawEntry): ActivityEntry {
    const rawKind = raw.kind ?? raw.type ?? "GOAL_UPDATED";
    const kind: ActivityKind = VALID_KINDS.includes(rawKind as ActivityKind)
      ? (rawKind as ActivityKind)
      : "GOAL_UPDATED";

    return {
      id: raw.id ?? Math.random().toString(36).slice(2),
      kind,
      entityName: raw.entityName ?? raw.name ?? "",
      detail: raw.detail ?? raw.description ?? null,
      categoryColor: raw.categoryColor ?? raw.color ?? null,
      createdAt: raw.createdAt ?? new Date().toISOString(),
    };
  }

  static pageToDomain(raw: RawPage): ActivityPage {
    const items = (raw.items ?? raw.data ?? []).map((r: unknown) =>
      ActivityMapper.entryToDomain(r as RawEntry),
    );
    return {
      items,
      nextCursor: raw.nextCursor ?? raw.cursor ?? null,
    };
  }
}
