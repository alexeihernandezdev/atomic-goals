export type CategoryIcon =
  | "heart"
  | "book"
  | "leaf"
  | "briefcase"
  | "users"
  | "coin";

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: CategoryIcon;
  goalCount: number;
  avgProgress: number;
  activeGoals: number;
  completedGoals: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryCommand {
  name: string;
  description?: string;
  color: string;
  icon: CategoryIcon;
}

export interface UpdateCategoryCommand {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: CategoryIcon;
}
