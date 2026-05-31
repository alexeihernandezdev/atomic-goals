import type { CalendarGateway, GetCalendarEventsQuery } from '../application/gateways/calendar.gateway';
import type { CalendarEvent } from '../domain/calendar-event';
import { mapHttpError } from '@/shared/infrastructure/api/http-error';
import { CalendarMapper } from './mappers/calendar.mapper';

interface ApiClient {
  GET(
    path: string,
    options?: { params?: Record<string, unknown> },
  ): Promise<{ data: unknown; error: unknown }>;
}

function unwrap<T>(data: unknown): T {
  if (data && typeof data === 'object' && 'data' in data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export class HttpCalendarGateway implements CalendarGateway {
  constructor(private readonly client: ApiClient) {}

  async getEvents(query: GetCalendarEventsQuery): Promise<CalendarEvent[]> {
    const { data, error } = await this.client.GET('/dashboard/calendar', {
      params: { query: { from: query.from, to: query.to } },
    });
    if (error) throw mapHttpError(error);
    const raw = unwrap<unknown[]>(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Array.isArray(raw) ? raw.map((item: any) => CalendarMapper.toDomain(item)) : [];
  }
}
