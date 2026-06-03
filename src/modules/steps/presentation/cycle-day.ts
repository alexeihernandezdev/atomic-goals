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

/** Human label for a step's cycleDay, shown as a chip in the step list. */
export function formatCycleDayLabel(
  cycleDay: string | null | undefined,
  cyclePeriod?: CyclePeriod,
  customCycleDays?: number | null,
): string | null {
  if (!cycleDay || !cyclePeriod) return null;
  if (cyclePeriod === "WEEKLY") return WEEK_DAYS_ES[Number(cycleDay) - 1] ?? cycleDay;
  if (cyclePeriod === "MONTHLY") return `Día ${cycleDay}`;
  if (cyclePeriod === "YEARLY") {
    try {
      return new Date(cycleDay).toLocaleDateString("es", { day: "numeric", month: "short" });
    } catch {
      return cycleDay;
    }
  }
  if (cyclePeriod === "CUSTOM_DAYS") {
    return `Día ${cycleDay}${customCycleDays ? `/${customCycleDays}` : ""}`;
  }
  return null;
}

/**
 * Short label used to suffix the title of grouped recurring steps,
 * e.g. "Correr (Lunes)" weekly or "Correr (Día 15)" monthly.
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

/**
 * Removes a trailing " (…)" suffix from a title so it can be re-applied per day.
 * Used when editing a grouped step and propagating the title to siblings.
 */
export function stripDaySuffix(title: string): string {
  return title.replace(/\s*\([^()]*\)\s*$/, "").trim();
}
