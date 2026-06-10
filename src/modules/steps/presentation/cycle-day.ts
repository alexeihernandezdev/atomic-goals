import type { CyclePeriod } from "@/modules/goals/domain/enums/cycle-period";

export const WEEK_DAYS: { value: string; label: string }[] = [
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
  { value: "7", label: "Domingo" },
];

const WEEK_DAYS_ES = WEEK_DAYS.map((d) => d.label);

/** JS getDay() is 0=Sun..6=Sat; convert to ISO 1=Mon..7=Sun. */
function isoWeekday(d: Date): number {
  const wd = d.getDay();
  return wd === 0 ? 7 : wd;
}

function atStartOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * Resolves a recurrence pattern (the form's cycleDay) to a concrete calendar
 * date within the given cycle, anchored on the instance's cycleStart. Returns an
 * ISO string, or undefined when there is nothing to resolve. The persisted model
 * stores only this concrete date; cycleDay is an input-time convenience.
 */
export function resolveCycleDayToDate(
  cycleDay: string | null | undefined,
  cyclePeriod: CyclePeriod | undefined,
  cycleStart: string | Date | undefined | null,
): string | undefined {
  if (!cycleDay || !cyclePeriod || !cycleStart) return undefined;
  const start = atStartOfDay(new Date(cycleStart));
  if (isNaN(start.getTime())) return undefined;

  switch (cyclePeriod) {
    case "WEEKLY": {
      const target = Number(cycleDay); // 1..7 ISO (Mon..Sun)
      if (!Number.isFinite(target)) return undefined;
      const delta = (target - isoWeekday(start) + 7) % 7;
      const d = new Date(start);
      d.setDate(d.getDate() + delta);
      return d.toISOString();
    }
    case "MONTHLY": {
      const day = Number(cycleDay); // 1..31
      if (!Number.isFinite(day)) return undefined;
      const d = new Date(start);
      d.setDate(day);
      if (d < start) d.setMonth(d.getMonth() + 1);
      return d.toISOString();
    }
    case "YEARLY": {
      // cycleDay is "YYYY-MM-DD"; only month/day matter.
      const parsed = new Date(cycleDay);
      if (isNaN(parsed.getTime())) return undefined;
      const d = new Date(start);
      d.setMonth(parsed.getMonth(), parsed.getDate());
      if (d < start) d.setFullYear(d.getFullYear() + 1);
      return d.toISOString();
    }
    case "CUSTOM_DAYS": {
      const n = Number(cycleDay); // 1..N (position within the cycle)
      if (!Number.isFinite(n)) return undefined;
      const d = new Date(start);
      d.setDate(d.getDate() + (n - 1));
      return d.toISOString();
    }
    case "DAILY":
    default:
      return undefined;
  }
}

/**
 * Inverse of resolveCycleDayToDate: derives the recurrence pattern (cycleDay)
 * from a stored concrete date, so the edit form can pre-select the right option.
 * cycleStart is only needed to recover the position for CUSTOM_DAYS.
 */
export function dateToCycleDay(
  scheduledDate: string | null | undefined,
  cyclePeriod: CyclePeriod | undefined,
  cycleStart?: string | Date | null,
): string | undefined {
  if (!scheduledDate || !cyclePeriod) return undefined;
  const d = atStartOfDay(new Date(scheduledDate));
  if (isNaN(d.getTime())) return undefined;

  switch (cyclePeriod) {
    case "WEEKLY":
      return String(isoWeekday(d));
    case "MONTHLY":
      return String(d.getDate());
    case "YEARLY": {
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${d.getFullYear()}-${m}-${day}`;
    }
    case "CUSTOM_DAYS": {
      if (!cycleStart) return undefined;
      const start = atStartOfDay(new Date(cycleStart));
      if (isNaN(start.getTime())) return undefined;
      const diffDays = Math.round((d.getTime() - start.getTime()) / 86400000);
      return String(diffDays + 1);
    }
    default:
      return undefined;
  }
}

/** Human label for a step's concrete scheduledDate, shown as a chip in the list. */
export function formatScheduledDateLabel(
  scheduledDate: string | null | undefined,
  cyclePeriod?: CyclePeriod,
): string | null {
  if (!scheduledDate) return null;
  const d = new Date(scheduledDate);
  if (isNaN(d.getTime())) return null;
  if (cyclePeriod === "WEEKLY") {
    return d.toLocaleDateString("es", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
  return d.toLocaleDateString("es", { day: "numeric", month: "short" });
}

/**
 * Day label derived from a concrete scheduledDate, used to re-suffix grouped
 * step titles, e.g. "Correr (Lunes)" weekly or "Correr (Día 15)" monthly.
 */
export function dayLabelFromDate(
  scheduledDate: string | null | undefined,
  cyclePeriod?: CyclePeriod,
): string | null {
  if (!scheduledDate) return null;
  const d = new Date(scheduledDate);
  if (isNaN(d.getTime())) return null;
  if (cyclePeriod === "WEEKLY") return WEEK_DAYS_ES[isoWeekday(d) - 1] ?? null;
  if (cyclePeriod === "MONTHLY") return `Día ${d.getDate()}`;
  return d.toLocaleDateString("es", { day: "numeric", month: "short" });
}

/**
 * Short label used to suffix the title of grouped recurring steps at creation
 * time, when only the cycleDay pattern is known (before resolving to a date).
 */
export function dayLabelForSuffix(
  cycleDay: string,
  cyclePeriod?: CyclePeriod,
): string {
  if (cyclePeriod === "WEEKLY") return WEEK_DAYS_ES[Number(cycleDay) - 1] ?? cycleDay;
  if (cyclePeriod === "MONTHLY") return `Día ${cycleDay}`;
  return cycleDay;
}

/** Applies the day suffix to a base title: "Correr" -> "Correr (Lunes)". */
export function titleWithDaySuffix(
  baseTitle: string,
  cycleDay: string,
  cyclePeriod?: CyclePeriod,
): string {
  return `${baseTitle} (${dayLabelForSuffix(cycleDay, cyclePeriod)})`;
}

/** Like titleWithDaySuffix but derives the day label from a concrete date. */
export function titleWithDateSuffix(
  baseTitle: string,
  scheduledDate: string | null | undefined,
  cyclePeriod?: CyclePeriod,
): string {
  const label = dayLabelFromDate(scheduledDate, cyclePeriod);
  return label ? `${baseTitle} (${label})` : baseTitle;
}

/**
 * Removes a trailing " (…)" suffix from a title so it can be re-applied per day.
 * Used when editing a grouped step and propagating the title to siblings.
 */
export function stripDaySuffix(title: string): string {
  return title.replace(/\s*\([^()]*\)\s*$/, "").trim();
}
