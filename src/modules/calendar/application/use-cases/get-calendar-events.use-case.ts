import type { CalendarGateway, GetCalendarEventsQuery } from '../gateways/calendar.gateway';
import type { CalendarEvent } from '../../domain/calendar-event';

export class GetCalendarEventsUseCase {
  constructor(private readonly gateway: CalendarGateway) {}

  async execute(query: GetCalendarEventsQuery): Promise<CalendarEvent[]> {
    return this.gateway.getEvents(query);
  }
}
