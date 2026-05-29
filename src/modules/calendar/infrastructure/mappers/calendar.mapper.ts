import type { CalendarEvent, CalendarEventType } from '../../domain/calendar-event';

interface RawCalendarEvent {
  id?: string;
  title?: string;
  name?: string;
  date?: string;
  time?: string | null;
  type?: string;
  kind?: string;
  goalId?: string;
  goalName?: string;
  goal?: string;
  goalTitle?: string;
  categoryName?: string;
  category?: string;
  categoryColor?: string;
  color?: string;
}

const VALID_TYPES: CalendarEventType[] = ['step', 'goal-end', 'goal-start', 'cyclic'];

export class CalendarMapper {
  static toDomain(raw: RawCalendarEvent): CalendarEvent {
    const rawType = raw.type ?? raw.kind ?? 'step';
    const type: CalendarEventType = VALID_TYPES.includes(rawType as CalendarEventType)
      ? (rawType as CalendarEventType)
      : 'step';

    return {
      id: raw.id ?? Math.random().toString(36).slice(2),
      title: raw.title ?? raw.name ?? '',
      date: raw.date ?? '',
      time: raw.time ?? null,
      type,
      goalId: raw.goalId ?? '',
      goalName: raw.goalName ?? raw.goal ?? raw.goalTitle ?? '',
      categoryName: raw.categoryName ?? raw.category ?? '',
      categoryColor: raw.categoryColor ?? raw.color ?? '#888',
    };
  }
}
