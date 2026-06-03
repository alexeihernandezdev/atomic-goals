"use server";

import { revalidateTag } from "next/cache";
import { serverContainer } from "@/shared/composition/server-container";
import { createStepSchema } from "@/modules/steps/presentation/schemas/step.schema";
import type { CreateStepFormValues } from "@/modules/steps/presentation/schemas/step.schema";
import type { Step, CreateStepBatchItem } from "@/modules/steps/domain/entities/step";
import type { CyclePeriod } from "@/modules/goals/domain/enums/cycle-period";
import { titleWithDaySuffix } from "@/modules/steps/presentation/cycle-day";
import { DomainError } from "@/shared/domain/errors/domain-error";

export async function createStepAction(
  goalInstanceId: string,
  input: CreateStepFormValues,
  order: number,
): Promise<{ ok: boolean; step?: Step; message?: string }> {
  const parsed = createStepSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors,
    )[0]?.[0];
    return { ok: false, message: firstError ?? "Datos inválidos" };
  }

  const values = parsed.data;

  try {
    const container = await serverContainer();
    const step = await container.steps.create.execute({
      goalInstanceId,
      type: values.type,
      title: values.title,
      description: values.description,
      weight: values.weight ?? 1,
      order,
      unit: values.unit,
      target: values.target,
      current: 0,
      max: values.max,
      min: values.min ?? 0,
      done: false,
      statuses: values.statuses?.map((s, i) => ({
        label: s.label,
        percentage: s.percentage,
        order: i,
      })),
      currentStatusId: values.statuses?.[0]
        ? undefined
        : undefined,
      startDate: values.startDate,
      endDate: values.endDate,
      cycleDay: values.cycleDay,
      estimatedDurationMinutes: values.estimatedDurationMinutes,
    });
    revalidateTag(`goal:${step.goalInstanceId}`, "max");
    return { ok: true, step };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}

export async function createStepsBatchAction(
  goalInstanceId: string,
  input: CreateStepFormValues,
  baseOrder: number,
  cyclePeriod?: CyclePeriod,
): Promise<{ ok: boolean; steps?: Step[]; message?: string }> {
  const parsed = createStepSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors,
    )[0]?.[0];
    return { ok: false, message: firstError ?? "Datos inválidos" };
  }

  const values = parsed.data;
  const days = values.cycleDays ?? [];
  if (days.length === 0) {
    return { ok: false, message: "Selecciona al menos un día" };
  }

  const baseTitle = values.title;
  const item = (cycleDay: string): CreateStepBatchItem => ({
    type: values.type,
    title: titleWithDaySuffix(baseTitle, cycleDay, cyclePeriod),
    description: values.description,
    weight: values.weight ?? 1,
    unit: values.unit,
    target: values.target,
    current: 0,
    max: values.max,
    min: values.min ?? 0,
    done: false,
    statuses: values.statuses?.map((s, i) => ({
      label: s.label,
      percentage: s.percentage,
      order: i,
    })),
    startDate: values.startDate,
    endDate: values.endDate,
    cycleDay,
    estimatedDurationMinutes: values.estimatedDurationMinutes,
  });

  try {
    const container = await serverContainer();
    const steps = await container.steps.createBatch.execute({
      goalInstanceId,
      baseOrder,
      steps: days.map(item),
    });
    revalidateTag(`goal:${goalInstanceId}`, "max");
    return { ok: true, steps };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}

export async function updateStepProgressAction(
  stepId: string,
  goalId: string,
  payload: { current?: number; done?: boolean; currentStatusId?: string },
): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    await container.steps.updateProgress.execute({ id: stepId, ...payload });
    revalidateTag(`goal:${goalId}`, "max");
    return { ok: true };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}

export async function reorderStepAction(
  stepId: string,
  goalId: string,
  newOrder: number,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    await container.steps.reorder.execute(stepId, newOrder);
    revalidateTag(`goal:${goalId}`, "max");
    return { ok: true };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}

export async function updateStepMetadataAction(
  stepId: string,
  goalId: string,
  values: {
    title?: string;
    weight?: number;
    cycleDay?: string;
    startDate?: string;
    endDate?: string;
    estimatedDurationMinutes?: number;
  },
): Promise<{ ok: boolean; step?: Step; message?: string }> {
  try {
    const container = await serverContainer();
    const step = await container.steps.updateMetadata.execute({
      id: stepId,
      title: values.title,
      weight: values.weight,
      startDate: values.startDate,
      endDate: values.endDate,
      cycleDay: values.cycleDay,
      estimatedDurationMinutes: values.estimatedDurationMinutes,
    });
    revalidateTag(`goal:${goalId}`, "max");
    return { ok: true, step };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}

export async function deleteStepAction(
  stepId: string,
  goalId: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    await container.steps.delete.execute(stepId);
    revalidateTag(`goal:${goalId}`, "max");
    return { ok: true };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}
