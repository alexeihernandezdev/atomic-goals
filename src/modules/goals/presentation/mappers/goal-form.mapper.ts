import type { CreateGoalCommand, UpdateGoalCommand } from "@/modules/goals/domain/entities/goal";
import type { GoalFormValues } from "../schemas/goal.schema";

export function toCreateGoalCommand(values: GoalFormValues): CreateGoalCommand {
  return {
    categoryId: values.categoryId,
    name: values.name,
    description: values.description,
    type: values.type,
    cyclePeriod: values.type === "CYCLIC" ? values.cyclePeriod : undefined,
    customCycleDays:
      values.cyclePeriod === "CUSTOM_DAYS" ? values.customCycleDays : undefined,
    startDate: values.startDate || undefined,
    endDate: values.endDate || undefined,
    estimatedDurationMinutes: values.estimatedDurationMinutes,
  };
}

export function toUpdateGoalCommand(
  id: string,
  values: Partial<GoalFormValues>,
): UpdateGoalCommand {
  return {
    id,
    name: values.name,
    description: values.description,
    categoryId: values.categoryId,
    cyclePeriod: values.cyclePeriod,
    customCycleDays: values.customCycleDays,
    startDate: values.startDate || undefined,
    endDate: values.endDate || undefined,
    estimatedDurationMinutes: values.estimatedDurationMinutes,
  };
}
