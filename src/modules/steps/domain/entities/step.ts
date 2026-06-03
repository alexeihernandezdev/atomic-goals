export type StepType = "PROGRESS_BAR" | "CHECK" | "STATUS" | "COUNTER";

export interface StatusOption {
  id: string;
  label: string;
  percentage: number;
  order: number;
}

interface StepBase {
  id: string;
  goalInstanceId: string;
  title: string;
  description?: string | null;
  weight: number;
  order: number;
  startDate?: string | null;
  endDate?: string | null;
  cycleDay?: string | null;
  cycleGroupId?: string | null;
  estimatedDurationMinutes?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ProgressBarStep extends StepBase {
  type: "PROGRESS_BAR";
  current: number;
  target: number;
  unit?: string | null;
}

export interface CheckStep extends StepBase {
  type: "CHECK";
  done: boolean;
}

export interface StatusStep extends StepBase {
  type: "STATUS";
  statuses: StatusOption[];
  currentStatusId: string;
}

export interface CounterStep extends StepBase {
  type: "COUNTER";
  current: number;
  max: number;
  min: number;
  unit?: string | null;
}

export type Step = ProgressBarStep | CheckStep | StatusStep | CounterStep;

export interface CreateStepCommand {
  goalInstanceId: string;
  type: StepType;
  title: string;
  description?: string;
  weight?: number;
  order: number;
  unit?: string;
  current?: number;
  target?: number;
  max?: number;
  min?: number;
  done?: boolean;
  statuses?: Omit<StatusOption, "id">[];
  currentStatusId?: string;
  startDate?: string;
  endDate?: string;
  cycleDay?: string;
  estimatedDurationMinutes?: number;
}

export type CreateStepBatchItem = Omit<
  CreateStepCommand,
  "goalInstanceId" | "order"
>;

export interface CreateStepsBatchCommand {
  goalInstanceId: string;
  baseOrder: number;
  steps: CreateStepBatchItem[];
}

export interface UpdateStepMetadataCommand {
  id: string;
  title?: string;
  description?: string | null;
  weight?: number;
  order?: number;
  startDate?: string;
  endDate?: string;
  cycleDay?: string;
  estimatedDurationMinutes?: number;
}

export interface UpdateStepProgressCommand {
  id: string;
  current?: number;
  done?: boolean;
  currentStatusId?: string;
}
