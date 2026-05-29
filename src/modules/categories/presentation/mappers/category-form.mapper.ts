import type { CreateCategoryCommand, UpdateCategoryCommand } from "@/modules/categories/domain/entities/category";
import type { CategoryFormValues } from "../schemas/category.schema";

export function toCreateCategoryCommand(
  values: CategoryFormValues,
): CreateCategoryCommand {
  return {
    name: values.name.trim(),
    description: values.description?.trim() || undefined,
    color: values.color,
    icon: values.icon,
  };
}

export function toUpdateCategoryCommand(
  id: string,
  values: CategoryFormValues,
): UpdateCategoryCommand {
  return {
    id,
    name: values.name.trim(),
    description: values.description?.trim() || undefined,
    color: values.color,
    icon: values.icon,
  };
}
