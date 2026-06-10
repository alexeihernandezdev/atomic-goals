import type { CyclePeriod } from "../enums/cycle-period";
import type { GoalInstanceStatus } from "../enums/goal-instance-status";
import type { GoalType } from "../enums/goal-type";

export interface GoalInstance {
  id: string;
  goalId: string;
  cycleStart: string;
  cycleEnd: string;
  status: GoalInstanceStatus;
  progress: number;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  description?: string;
  type: GoalType;
  cyclePeriod?: CyclePeriod | null;
  customCycleDays?: number | null;
  cloneStepsOnRenewal?: boolean | null;
  startDate?: string | null;
  endDate?: string | null;
  estimatedDurationMinutes?: number | null;
  activeInstance?: GoalInstance | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateGoalCommand {
  categoryId: string;
  name: string;
  description?: string;
  type: GoalType;
  cyclePeriod?: CyclePeriod;
  customCycleDays?: number;
  cloneStepsOnRenewal?: boolean;
}

export interface UpdateGoalCommand {
  id: string;
  name?: string;
  description?: string;
  categoryId?: string;
  cyclePeriod?: CyclePeriod;
  customCycleDays?: number;
  cloneStepsOnRenewal?: boolean;
}

export interface CategoryOption {
  id: string;
  name: string;
  color?: string;
}

export interface ListGoalsQuery {
  categoryId?: string;
  type?: GoalType;
  page?: number;
  limit?: number;
}
