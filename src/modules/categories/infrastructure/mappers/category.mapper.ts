import type {
  Category,
  CategoryIcon,
} from "@/modules/categories/domain/entities/category";

const VALID_ICONS: CategoryIcon[] = [
  "heart",
  "book",
  "leaf",
  "briefcase",
  "users",
  "coin",
];

export interface RawCategory {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  icon: string;
  goalCount?: number;
  avgProgress?: number;
  activeGoals?: number;
  completedGoals?: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export class CategoryMapper {
  static toDomain(raw: RawCategory): Category {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description ?? undefined,
      color: raw.color,
      icon: VALID_ICONS.includes(raw.icon as CategoryIcon)
        ? (raw.icon as CategoryIcon)
        : "heart",
      goalCount: raw.goalCount ?? 0,
      avgProgress: Math.round(raw.avgProgress ?? 0),
      activeGoals: raw.activeGoals ?? 0,
      completedGoals: raw.completedGoals ?? 0,
      deletedAt: raw.deletedAt ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
