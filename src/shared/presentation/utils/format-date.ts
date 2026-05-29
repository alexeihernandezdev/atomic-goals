import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(
  date: Date | string,
  pattern = "dd MMM yyyy",
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern, { locale: es });
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isToday(d)) return "hoy";
  if (isYesterday(d)) return "ayer";
  return formatDistanceToNow(d, { addSuffix: true, locale: es });
}
