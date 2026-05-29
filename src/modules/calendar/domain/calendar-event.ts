export type CalendarEventType = 'step' | 'goal-end' | 'goal-start' | 'cyclic';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;        // YYYY-MM-DD
  time: string | null; // HH:mm
  type: CalendarEventType;
  goalId: string;
  goalName: string;
  categoryName: string;
  categoryColor: string;
}
