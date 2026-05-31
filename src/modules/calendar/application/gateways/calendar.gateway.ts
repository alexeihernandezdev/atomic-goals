import type { CalendarEvent } from '../../domain/calendar-event';

export interface GetCalendarEventsQuery {
  from: string; // ISO date string
  to: string;   // ISO date string
}

export interface CalendarGateway {
  getEvents(query: GetCalendarEventsQuery): Promise<CalendarEvent[]>;
}
