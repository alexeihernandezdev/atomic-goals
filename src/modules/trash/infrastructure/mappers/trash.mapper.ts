import type { TrashedItem, TrashEntityType, TrashList } from "../../domain/trashed-item";

function relativeDeletedLabel(isoDate?: string): string {
  if (!isoDate) return "";
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoy";
  if (days === 1) return "hace 1 día";
  if (days < 7) return `hace ${days} días`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "hace 1 semana" : `hace ${weeks} semanas`;
}

function daysUntilExpiry(deletedAt?: string, ttlDays = 30): number | null {
  if (!deletedAt) return null;
  const elapsed = (Date.now() - new Date(deletedAt).getTime()) / 86400000;
  return Math.max(0, Math.round(ttlDays - elapsed));
}

interface RawItem {
  id?: string;
  name?: string;
  title?: string;
  entityType?: string;
  type?: string;
  color?: string | null;
  categoryColor?: string | null;
  deletedAt?: string;
  meta?: string;
  description?: string;
  goalName?: string;
  categoryName?: string;
}

function mapItem(raw: RawItem, fallbackType: TrashEntityType): TrashedItem {
  const entityType = (
    ["category", "goal", "step"].includes(raw.entityType ?? raw.type ?? "")
      ? (raw.entityType ?? raw.type)
      : fallbackType
  ) as TrashEntityType;

  const meta =
    raw.meta ??
    raw.description ??
    (raw.goalName ? `de · ${raw.goalName}` : raw.categoryName ?? "");

  return {
    id: raw.id ?? Math.random().toString(36).slice(2),
    name: raw.name ?? raw.title ?? "",
    entityType,
    color: raw.color ?? raw.categoryColor ?? null,
    deletedLabel: relativeDeletedLabel(raw.deletedAt),
    daysUntilExpiry: daysUntilExpiry(raw.deletedAt),
    meta,
  };
}

interface RawTrashList {
  goals?: RawItem[];
  categories?: RawItem[];
  steps?: RawItem[];
  items?: RawItem[];
  data?: RawItem[];
}

export class TrashMapper {
  static toDomainList(raw: RawTrashList): TrashList {
    // The API might return a structured list or a flat array
    if (raw.goals !== undefined || raw.categories !== undefined || raw.steps !== undefined) {
      return {
        goals: (raw.goals ?? []).map((r) => mapItem(r, "goal")),
        categories: (raw.categories ?? []).map((r) => mapItem(r, "category")),
        steps: (raw.steps ?? []).map((r) => mapItem(r, "step")),
      };
    }
    // Flat array with entityType discriminator
    const items = (raw.items ?? raw.data ?? []).map((r) =>
      mapItem(r, (r.entityType ?? r.type ?? "goal") as TrashEntityType),
    );
    return {
      goals: items.filter((i) => i.entityType === "goal"),
      categories: items.filter((i) => i.entityType === "category"),
      steps: items.filter((i) => i.entityType === "step"),
    };
  }
}
