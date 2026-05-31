import type {
  Step,
  ProgressBarStep,
  CheckStep,
  StatusStep,
  CounterStep,
  StatusOption,
} from "@/modules/steps/domain/entities/step";

export interface RawStatusOption {
  id: string;
  label: string;
  percentage: number;
  order: number;
}

export interface RawStep {
  id: string;
  goalInstanceId: string;
  type: string;
  title: string;
  description?: string | null;
  weight: number;
  order: number;
  unit?: string | null;
  current?: number | null;
  target?: number | null;
  max?: number | null;
  min?: number | null;
  done?: boolean | null;
  statuses?: RawStatusOption[] | null;
  currentStatusId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  cycleDay?: string | null;
  estimatedDurationMinutes?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

function mapStatusOption(raw: RawStatusOption): StatusOption {
  return {
    id: raw.id,
    label: raw.label,
    percentage: raw.percentage,
    order: raw.order,
  };
}

export class StepMapper {
  static toDomain(raw: RawStep): Step {
    const base = {
      id: raw.id,
      goalInstanceId: raw.goalInstanceId,
      title: raw.title,
      description: raw.description ?? null,
      weight: raw.weight,
      order: raw.order,
      startDate: raw.startDate ?? null,
      endDate: raw.endDate ?? null,
      cycleDay: raw.cycleDay ?? null,
      estimatedDurationMinutes: raw.estimatedDurationMinutes ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    };

    switch (raw.type) {
      case "PROGRESS_BAR":
        return {
          ...base,
          type: "PROGRESS_BAR",
          current: raw.current ?? 0,
          target: raw.target ?? 100,
          unit: raw.unit ?? null,
        } satisfies ProgressBarStep;

      case "CHECK":
        return {
          ...base,
          type: "CHECK",
          done: raw.done ?? false,
        } satisfies CheckStep;

      case "STATUS":
        return {
          ...base,
          type: "STATUS",
          statuses: (raw.statuses ?? []).map(mapStatusOption),
          currentStatusId: raw.currentStatusId ?? "",
        } satisfies StatusStep;

      case "COUNTER":
        return {
          ...base,
          type: "COUNTER",
          current: raw.current ?? 0,
          max: raw.max ?? 100,
          min: raw.min ?? 0,
          unit: raw.unit ?? null,
        } satisfies CounterStep;

      default:
        throw new Error(`Unknown step type: ${raw.type}`);
    }
  }
}
