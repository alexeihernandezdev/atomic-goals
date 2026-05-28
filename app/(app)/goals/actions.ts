"use server";

import { revalidateTag } from "next/cache";
import { serverContainer } from "@/shared/composition/server-container";
import { goalFormSchema } from "@/modules/goals/presentation/schemas/goal.schema";
import {
  toCreateGoalCommand,
  toUpdateGoalCommand,
} from "@/modules/goals/presentation/mappers/goal-form.mapper";
import { DomainError } from "@/shared/domain/errors/domain-error";

export async function createGoalAction(
  input: unknown,
): Promise<{ ok: boolean; message?: string }> {
  const parsed = goalFormSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors,
    )[0]?.[0];
    return { ok: false, message: firstError ?? "Datos inválidos" };
  }

  try {
    const container = await serverContainer();
    const command = toCreateGoalCommand(parsed.data);
    await container.goals.create.execute(command);
    revalidateTag("goals", "max");
    return { ok: true };
  } catch (e) {
    if (e instanceof DomainError)
      return { ok: false, message: e.message };
    throw e;
  }
}

export async function updateGoalAction(
  id: string,
  input: unknown,
): Promise<{ ok: boolean; message?: string }> {
  const parsed = goalFormSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors,
    )[0]?.[0];
    return { ok: false, message: firstError ?? "Datos inválidos" };
  }

  try {
    const container = await serverContainer();
    const command = toUpdateGoalCommand(id, parsed.data);
    await container.goals.update.execute(command);
    revalidateTag("goals", "max");
    revalidateTag(`goal:${id}`, "max");
    return { ok: true };
  } catch (e) {
    if (e instanceof DomainError)
      return { ok: false, message: e.message };
    throw e;
  }
}

export async function deleteGoalAction(
  id: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    await container.goals.delete.execute(id);
    revalidateTag("goals", "max");
    revalidateTag(`goal:${id}`, "max");
    return { ok: true };
  } catch (e) {
    if (e instanceof DomainError)
      return { ok: false, message: e.message };
    throw e;
  }
}
