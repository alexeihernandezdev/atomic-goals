export interface StreakData {
  current: number;
  record: number;
  weekActivity: boolean[];
}

export interface CategoryBreakdown {
  id: string;
  name: string;
  color: string;
  goalsCount: number;
  avgProgress: number;
}

export interface DashboardStats {
  activeGoals: number;
  completedThisMonth: number;
  totalGoalsThisMonth: number;
  stepsToday: number;
  stepsTodayTotal: number;
}

export interface DashboardSummary {
  streak: StreakData;
  stats: DashboardStats;
  categories: CategoryBreakdown[];
}
