export interface UpcomingItem {
  goalId: string;
  goalName: string;
  stepTitle?: string | null;
  categoryName: string;
  categoryColor: string;
  dueDate?: string | null;
  dueLabel?: string | null;
  progress: number;
  goalType: "CONCLUSIVE" | "CYCLIC";
}
