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
}

interface RawTimelinePoint {
  date?: string;
  completedSteps?: number;
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
    const streak = raw.streak ?? {};
    const stats = raw.stats ?? {};
    const cats = raw.categories ?? raw.categoryBreakdown ?? [];

    const weekActivity: boolean[] = (() => {
      if (Array.isArray(streak.weekActivity)) return streak.weekActivity;
      if (Array.isArray(streak.weeklyActivity))
        return streak.weeklyActivity.map((v) => v === 1);
      return [false, false, false, false, false, false, false];
    })();

    const mappedStreak: StreakData = {
      current: streak.current ?? streak.currentStreak ?? 0,
      record: streak.record ?? streak.longestStreak ?? 0,
      weekActivity: weekActivity.slice(0, 7),
    };

    const mappedStats: DashboardStats = {
      activeGoals: stats.activeGoals ?? 0,
      completedThisMonth: stats.completedThisMonth ?? stats.completedGoalsThisMonth ?? 0,
      totalGoalsThisMonth: stats.totalGoalsThisMonth ?? 0,
      stepsToday: stats.stepsToday ?? stats.completedStepsToday ?? 0,
      stepsTodayTotal: stats.stepsTodayTotal ?? stats.totalStepsToday ?? 0,
    };

    const mappedCategories: CategoryBreakdown[] = cats.map((c) => ({
      id: c.id ?? c.categoryId ?? "",
      name: c.name ?? c.categoryName ?? "",
      color: c.color ?? c.categoryColor ?? "#888",
      goalsCount: c.goalsCount ?? c.goals ?? 0,
      avgProgress: Math.round(c.avgProgress ?? c.averageProgress ?? c.progress ?? 0),
    }));

    return { streak: mappedStreak, stats: mappedStats, categories: mappedCategories };
  }

  static timelineToDomain(raw: RawTimeline, range: TimelineRange): TimelineData {
    const points: TimelinePoint[] = (raw.points ?? raw.data ?? []).map((p) => ({
      date: p.date ?? "",
      completedSteps: p.completedSteps ?? p.count ?? p.value ?? 0,
    }));

    return {
      range,
      points,
      totalCompleted: raw.totalCompleted ?? raw.total ?? 0,
      growthPercent: raw.growthPercent ?? raw.growth ?? null,
      activeDays: raw.activeDays ?? points.filter((p) => p.completedSteps > 0).length,
      totalDays: raw.totalDays ?? points.length,
    };
  }

  static upcomingToDomain(raw: RawUpcoming): UpcomingItem {
    return {
      goalId: raw.goalId ?? "",
      goalName: raw.goalName ?? raw.name ?? "",
      stepTitle: raw.stepTitle ?? raw.nextStep ?? null,
      categoryName: raw.categoryName ?? raw.category ?? "",
      categoryColor: raw.categoryColor ?? raw.color ?? "#888",
      dueDate: raw.dueDate ?? raw.endDate ?? null,
      dueLabel: raw.dueLabel ?? null,
      progress: Math.round(raw.progress ?? 0),
      goalType: (raw.goalType ?? raw.type ?? "CONCLUSIVE") as "CONCLUSIVE" | "CYCLIC",
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
