import type { DashboardSummary, StreakData, CategoryBreakdown, DashboardStats } from "@/modules/dashboard/domain/summary";
import type { TimelineData, TimelinePoint, TimelineRange } from "@/modules/dashboard/domain/timeline-point";
import type { UpcomingItem } from "@/modules/dashboard/domain/upcoming-item";
import type { ActivityLog, ActivityKind, ActivityPage } from "@/modules/dashboard/domain/activity-log";

// ── Raw API types (inferred from backend conventions) ─────────────────────

interface RawStreak {
  current?: number;
  currentStreak?: number;
  record?: number;
  longestStreak?: number;
  weekActivity?: boolean[];
  weeklyActivity?: (0 | 1)[];
}

interface RawCategory {
  id?: string;
  categoryId?: string;
  name?: string;
  categoryName?: string;
  color?: string;
  categoryColor?: string;
  goalsCount?: number;
  goals?: number;
  goalCount?: number;
  avgProgress?: number;
  averageProgress?: number;
  progress?: number;
}

interface RawStats {
  activeGoals?: number;
  completedThisMonth?: number;
  completedGoalsThisMonth?: number;
  totalGoalsThisMonth?: number;
  stepsToday?: number;
  completedStepsToday?: number;
  stepsTodayTotal?: number;
  totalStepsToday?: number;
}

interface RawSummary {
  streak?: RawStreak;
  stats?: RawStats;
  categories?: RawCategory[];
  categoryBreakdown?: RawCategory[];
  // flat format from backend
  totalGoals?: number;
  completedGoals?: number;
  inProgressGoals?: number;
  byCategory?: RawCategory[];
  currentStreak?: number;
}

interface RawTimelinePoint {
  date?: string;
  completedSteps?: number;
  completedCount?: number;
  count?: number;
  value?: number;
}

interface RawTimeline {
  points?: RawTimelinePoint[];
  data?: RawTimelinePoint[];
  totalCompleted?: number;
  total?: number;
  growthPercent?: number | null;
  growth?: number | null;
  activeDays?: number;
  totalDays?: number;
}

interface RawUpcoming {
  goalId?: string;
  goalName?: string;
  name?: string;
  stepTitle?: string | null;
  nextStep?: string | null;
  categoryName?: string;
  category?: string;
  categoryColor?: string;
  color?: string;
  dueDate?: string | null;
  endDate?: string | null;
  dueLabel?: string | null;
  progress?: number;
  goalType?: string;
  type?: string;
  // flat format from backend
  entityId?: string;
  entityType?: string;
  title?: string;
}

interface RawActivity {
  id?: string;
  kind?: string;
  type?: string;
  entityName?: string;
  name?: string;
  detail?: string | null;
  description?: string | null;
  color?: string | null;
  createdAt?: string;
}

interface RawActivityPage {
  items?: RawActivity[];
  data?: RawActivity[];
  nextCursor?: string | null;
  cursor?: string | null;
}

// ── Mappers ────────────────────────────────────────────────────────────────

export class DashboardMapper {
  static summaryToDomain(raw: RawSummary): DashboardSummary {
    const streakObj = raw.streak ?? {};
    const stats = raw.stats ?? {};
    const cats = raw.categories ?? raw.categoryBreakdown ?? raw.byCategory ?? [];

    const weekActivity: boolean[] = (() => {
      if (Array.isArray(streakObj.weekActivity)) return streakObj.weekActivity;
      if (Array.isArray(streakObj.weeklyActivity))
        return streakObj.weeklyActivity.map((v) => v === 1);
      return [false, false, false, false, false, false, false];
    })();

    const mappedStreak: StreakData = {
      current: streakObj.current ?? streakObj.currentStreak ?? raw.currentStreak ?? 0,
      record: streakObj.record ?? streakObj.longestStreak ?? 0,
      weekActivity: weekActivity.slice(0, 7),
    };

    const mappedStats: DashboardStats = {
      activeGoals: stats.activeGoals ?? raw.inProgressGoals ?? 0,
      completedThisMonth: stats.completedThisMonth ?? stats.completedGoalsThisMonth ?? raw.completedGoals ?? 0,
      totalGoalsThisMonth: stats.totalGoalsThisMonth ?? raw.totalGoals ?? 0,
      stepsToday: stats.stepsToday ?? stats.completedStepsToday ?? 0,
      stepsTodayTotal: stats.stepsTodayTotal ?? stats.totalStepsToday ?? 0,
    };

    const mappedCategories: CategoryBreakdown[] = cats.map((c) => ({
      id: c.id ?? c.categoryId ?? "",
      name: c.name ?? c.categoryName ?? "",
      color: c.color ?? c.categoryColor ?? "#888",
      goalsCount: c.goalsCount ?? c.goals ?? c.goalCount ?? 0,
      avgProgress: Math.round(c.avgProgress ?? c.averageProgress ?? c.progress ?? 0),
    }));

    return { streak: mappedStreak, stats: mappedStats, categories: mappedCategories };
  }

  static timelineToDomain(raw: RawTimeline | RawTimelinePoint[], range: TimelineRange): TimelineData {
    const rawPoints = Array.isArray(raw) ? raw : (raw.points ?? raw.data ?? []);
    const rawMeta: Partial<RawTimeline> = Array.isArray(raw) ? {} : raw;

    const points: TimelinePoint[] = rawPoints.map((p) => ({
      date: p.date ?? "",
      completedSteps: p.completedSteps ?? p.completedCount ?? p.count ?? p.value ?? 0,
    }));

    return {
      range,
      points,
      totalCompleted: rawMeta.totalCompleted ?? rawMeta.total ?? points.reduce((s, p) => s + p.completedSteps, 0),
      growthPercent: rawMeta.growthPercent ?? rawMeta.growth ?? null,
      activeDays: rawMeta.activeDays ?? points.filter((p) => p.completedSteps > 0).length,
      totalDays: rawMeta.totalDays ?? points.length,
    };
  }

  static upcomingToDomain(raw: RawUpcoming): UpcomingItem {
    const isStep = (raw.entityType ?? raw.type) === "step";
    return {
      goalId: raw.goalId ?? raw.entityId ?? "",
      goalName: raw.goalName ?? raw.name ?? (!isStep ? (raw.title ?? "") : ""),
      stepTitle: raw.stepTitle ?? raw.nextStep ?? (isStep ? (raw.title ?? null) : null),
      categoryName: raw.categoryName ?? raw.category ?? "",
      categoryColor: raw.categoryColor ?? raw.color ?? "#888",
      dueDate: raw.dueDate ?? raw.endDate ?? null,
      dueLabel: raw.dueLabel ?? null,
      progress: Math.round(raw.progress ?? 0),
      goalType: (raw.goalType ?? (!isStep ? "CONCLUSIVE" : "CONCLUSIVE")) as "CONCLUSIVE" | "CYCLIC",
    };
  }

  static activityToDomain(raw: RawActivity): ActivityLog {
    return {
      id: raw.id ?? Math.random().toString(),
      kind: (raw.kind ?? raw.type ?? "GOAL_UPDATED") as ActivityKind,
      entityName: raw.entityName ?? raw.name ?? "",
      detail: raw.detail ?? raw.description ?? null,
      color: raw.color ?? null,
      createdAt: raw.createdAt ?? new Date().toISOString(),
    };
  }

  static activityPageToDomain(raw: RawActivityPage): ActivityPage {
    const items = (raw.items ?? raw.data ?? []).map(DashboardMapper.activityToDomain);
    return { items, nextCursor: raw.nextCursor ?? raw.cursor ?? null };
  }
}
