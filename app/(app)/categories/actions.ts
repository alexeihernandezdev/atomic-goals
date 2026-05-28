"use server";

import { revalidateTag } from "next/cache";
import { serverContainer } from "@/shared/composition/server-container";
import { categorySchema } from "@/modules/categories/presentation/schemas/category.schema";
import {
  toCreateCategoryCommand,
  toUpdateCategoryCommand,
} from "@/modules/categories/presentation/mappers/category-form.mapper";
import { DomainError } from "@/shared/domain/errors/domain-error";
import type { CategoryFormValues } from "@/modules/categories/presentation/schemas/category.schema";

export async function createCategoryAction(
  values: CategoryFormValues,
): Promise<{ ok: boolean; message?: string }> {
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .join(", ");
    return { ok: false, message: msg };
  }
  try {
    const container = await serverContainer();
    const command = toCreateCategoryCommand(parsed.data);
    await container.categories.create.execute(command);
    revalidateTag("categories", "max");
    return { ok: true };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}

export async function updateCategoryAction(
  id: string,
  values: CategoryFormValues,
): Promise<{ ok: boolean; message?: string }> {
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .join(", ");
    return { ok: false, message: msg };
  }
  try {
    const container = await serverContainer();
    const command = toUpdateCategoryCommand(id, parsed.data);
    await container.categories.update.execute(command);
    revalidateTag("categories", "max");
    revalidateTag(`category:${id}`, "max");
    return { ok: true };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}

export async function deleteCategoryAction(
  id: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    await container.categories.delete.execute(id);
    revalidateTag("categories", "max");
    revalidateTag(`category:${id}`, "max");
    return { ok: true };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}
