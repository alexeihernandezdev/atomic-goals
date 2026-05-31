import type { Goal, GoalInstance } from "@/modules/goals/domain/entities/goal";
import type { CyclePeriod } from "@/modules/goals/domain/enums/cycle-period";
import type { GoalInstanceStatus } from "@/modules/goals/domain/enums/goal-instance-status";
import type { GoalType } from "@/modules/goals/domain/enums/goal-type";

export interface RawGoalInstance {
  id: string;
  goalId: string;
  cycleStart: string;
  cycleEnd: string;
  status: string;
  progress: number;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RawGoal {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  description?: string;
  type: string;
  cyclePeriod?: string | null;
  customCycleDays?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  estimatedDurationMinutes?: number | null;
  activeInstance?: RawGoalInstance | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export class GoalMapper {
  static instanceToDomain(raw: RawGoalInstance): GoalInstance {
    return {
      id: raw.id,
      goalId: raw.goalId,
      cycleStart: raw.cycleStart,
      cycleEnd: raw.cycleEnd,
      status: raw.status as GoalInstanceStatus,
      progress: Math.round(raw.progress ?? 0),
      completedAt: raw.completedAt ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomain(raw: RawGoal): Goal {
    return {
      id: raw.id,
      userId: raw.userId,
      categoryId: raw.categoryId,
      name: raw.name,
      description: raw.description,
      type: raw.type as GoalType,
      cyclePeriod: (raw.cyclePeriod as CyclePeriod) ?? null,
      customCycleDays: raw.customCycleDays ?? null,
      startDate: raw.startDate ?? null,
      endDate: raw.endDate ?? null,
      estimatedDurationMinutes: raw.estimatedDurationMinutes ?? null,
      activeInstance: raw.activeInstance
        ? GoalMapper.instanceToDomain(raw.activeInstance)
        : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    };
  }
}
