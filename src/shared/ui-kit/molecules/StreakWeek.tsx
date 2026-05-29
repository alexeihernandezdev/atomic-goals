import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";
import {
  StreakDot,
  type StreakDotState,
} from "@/shared/ui-kit/atoms/StreakDot";

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"] as const;

export interface StreakDay {
  label?: string;
  state: StreakDotState;
}

export interface StreakWeekProps extends React.HTMLAttributes<HTMLDivElement> {
  days?: StreakDay[];
  currentStreak?: number;
  record?: number;
}

function buildDefaultDays(): StreakDay[] {
  return DAY_LABELS.map((_, i) => ({
    label: DAY_LABELS[i],
    state: "future" as StreakDotState,
  }));
}

export function StreakWeek({
  days,
  currentStreak,
  record,
  className,
  ...props
}: StreakWeekProps) {
  const weekDays = days ?? buildDefaultDays();

  return (
    <div
      className={cn(
        "rounded-[--ag-radius-lg] p-5 bg-[--ag-surface] border border-[--ag-border]",
        className,
      )}
      {...props}
    >
      <p className="text-xs font-mono uppercase tracking-[--ag-tracking-wider] text-[--ag-fg-muted] mb-3">
        tu racha · semana actual
      </p>

      {currentStreak !== undefined && (
        <p className="font-mono font-semibold text-3xl text-[--ag-fg] mb-1 tabular-nums">
          {currentStreak}{" "}
          <span className="text-sm font-normal text-[--ag-fg-muted]">
            días seguidos
          </span>
        </p>
      )}

      <div
        className="flex items-center gap-2 mt-3"
        role="list"
        aria-label="Días de la semana"
      >
        {weekDays.map((day, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5"
            role="listitem"
          >
            <StreakDot
              state={day.state}
              size="md"
              label={day.label ?? DAY_LABELS[i] ?? String(i)}
            />
            <span className="text-[10px] font-mono uppercase text-[--ag-fg-subtle]">
              {day.label ?? DAY_LABELS[i]}
            </span>
          </div>
        ))}
      </div>

      {record !== undefined && (
        <p className="text-xs font-mono text-[--ag-fg-muted] mt-3">
          récord personal ·{" "}
          <span className="text-[--ag-fg] font-medium">{record} días</span>
        </p>
      )}
    </div>
  );
}
