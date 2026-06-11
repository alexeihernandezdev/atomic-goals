"use server";

import { serverContainer } from "@/shared/composition/server-container";
import { createStepSchema } from "@/modules/steps/presentation/schemas/step.schema";
import type { CreateStepFormValues } from "@/modules/steps/presentation/schemas/step.schema";
import type { Step } from "@/modules/steps/domain/entities/step";
import { DomainError } from "@/shared/domain/errors/domain-error";

// Creates a brand-new step attached to a goal instance, scheduled for an explicit
// calendar date (the day clicked in the calendar). Unlike createStepAction in the
// goals route, the scheduledDate is fixed by the calendar — not derived from cycleDay.
export async function scheduleNewStepAction(
  goalInstanceId: string,
  input: CreateStepFormValues,
  scheduledDateISO: string,
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
      startDate: values.startDate,
      endDate: values.endDate,
      scheduledDate: scheduledDateISO,
      estimatedDurationMinutes: values.estimatedDurationMinutes,
    });
    return { ok: true, step };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}

// Assigns (or moves) a step's scheduledDate. Used both to schedule an existing
// undated step and to reschedule via drag & drop.
export async function assignStepDateAction(
  stepId: string,
  scheduledDateISO: string,
): Promise<{ ok: boolean; step?: Step; message?: string }> {
  try {
    const container = await serverContainer();
    const step = await container.steps.updateMetadata.execute({
      id: stepId,
      scheduledDate: scheduledDateISO,
    });
    return { ok: true, step };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}

// Lists the steps of a goal instance so the calendar can show which ones are
// still undated (candidates to schedule) and compute the next order value.
export async function listInstanceStepsAction(
  goalInstanceId: string,
): Promise<{ ok: boolean; steps?: Step[]; message?: string }> {
  try {
    const container = await serverContainer();
    const steps = await container.steps.list.execute(goalInstanceId);
    return { ok: true, steps };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, message: e.message };
    throw e;
  }
}
