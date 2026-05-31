"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { CalendarEvent } from "../../domain/calendar-event";
import { EventPopover } from "./EventPopover";

const WEEKDAY_LABELS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

interface MonthViewProps {
  palette: DashPalette;
  year: number;
  month: number; // 0-indexed
  events: CalendarEvent[];
  openDay: number | null;
  onDayClick: (day: number) => void;
  onPopoverClose: () => void;
  loading: boolean;
}

function eventsForDay(events: CalendarEvent[], year: number, month: number, day: number) {
  return events.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date + "T00:00:00");
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
}

interface EventChipProps {
  ev: CalendarEvent;
  palette: DashPalette;
  dense?: boolean;
}

function EventChip({ ev, palette, dense }: EventChipProps) {
  const isMilestone = ev.type === "goal-end" || ev.type === "goal-start";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: dense ? "1px 4px" : "3px 6px",
        background: isMilestone ? ev.categoryColor : "transparent",
        borderLeft: isMilestone ? "none" : `3px solid ${ev.categoryColor}`,
        color: isMilestone ? palette.bg : palette.ink,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: dense ? 10 : 11,
        fontWeight: isMilestone ? 700 : 600,
        letterSpacing: "-0.005em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        lineHeight: 1.3,
      }}
    >
      {ev.time && !dense && (
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            color: isMilestone ? palette.bg : palette.inkDim,
            flexShrink: 0,
            letterSpacing: "0.02em",
          }}
        >
          {ev.time}
        </span>
      )}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {ev.title}
      </span>
    </div>
  );
}

export function MonthView({
  palette, year, month, events, openDay, onDayClick, onPopoverClose, loading,
}: MonthViewProps) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (() => {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1; // Mon=0..Sun=6
  })();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div
      style={{
        border: `1.5px solid ${palette.line}`,
        background: palette.surface,
        opacity: loading ? 0.6 : 1,
        transition: "opacity .15s",
      }}
    >
      {/* weekday header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: `1.5px solid ${palette.line}`,
          background: palette.surface2,
        }}
      >
        {WEEKDAY_LABELS.map((w, i) => (
          <div
            key={w}
            style={{
              padding: "8px 10px",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: palette.inkDim,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRight:
                i < 6 ? `1px solid ${palette.lineSofter}` : "none",
              textAlign: i >= 5 ? "right" : "left",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* weeks */}
      {weeks.map((week, wi) => (
        <div
          key={wi}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderBottom:
              wi < weeks.length - 1
                ? `1px solid ${palette.lineSofter}`
                : "none",
          }}
        >
          {week.map((day, di) => {
            const isToday =
              day !== null &&
              day === todayDay &&
              month === todayMonth &&
              year === todayYear;
            const isWeekend = di >= 5;
            const dayEvents = day ? eventsForDay(events, year, month, day) : [];
            const shown = dayEvents.slice(0, 3);
            const extra = dayEvents.length - shown.length;

            return (
              <div
                key={di}
                style={{
                  minHeight: 116,
                  padding: "6px 7px",
                  borderRight:
                    di < 6 ? `1px solid ${palette.lineSofter}` : "none",
                  background:
                    day == null
                      ? palette.bg
                      : isToday
                      ? palette.lime + "20"
                      : isWeekend
                      ? palette.surface2
                      : palette.surface,
                  position: "relative",
                  cursor: day ? "pointer" : "default",
                }}
                onClick={() => day && onDayClick(day)}
              >
                {day && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"Space Grotesk", system-ui, sans-serif',
                          fontSize: 13,
                          fontWeight: isToday ? 700 : 600,
                          width: isToday ? 24 : "auto",
                          height: isToday ? 24 : "auto",
                          background: isToday ? palette.line : "transparent",
                          color: isToday ? palette.bg : palette.ink,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <span
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: 9,
                            color: palette.inkSubtle,
                          }}
                        >
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      {shown.map((ev) => (
                        <EventChip key={ev.id} ev={ev} palette={palette} />
                      ))}
                      {extra > 0 && (
                        <div
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: 9,
                            color: palette.primary,
                            letterSpacing: "0.04em",
                            paddingLeft: 4,
                            marginTop: 1,
                          }}
                        >
                          +{extra} más
                        </div>
                      )}
                    </div>

                    {openDay === day && (
                      <EventPopover
                        day={day}
                        month={month}
                        year={year}
                        isToday={isToday}
                        events={dayEvents}
                        palette={palette}
                        anchorRight={di >= 4}
                        onClose={onPopoverClose}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
