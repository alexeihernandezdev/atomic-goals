export type TimelineRange = "week" | "month" | "year";

export interface TimelinePoint {
  date: string;
  completedSteps: number;
}

export interface TimelineData {
  range: TimelineRange;
  points: TimelinePoint[];
  totalCompleted: number;
  growthPercent: number | null;
  activeDays: number;
  totalDays: number;
}
