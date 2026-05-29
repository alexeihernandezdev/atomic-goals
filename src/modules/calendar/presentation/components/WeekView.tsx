"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { CalendarEvent } from "../../domain/calendar-event";

const WEEKDAY_LABELS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const HOUR_SLOTS = [7, 9, 11, 13, 15, 17, 19, 21];

interface WeekViewProps {
  palette: DashPalette;
  year: number;
  month: number; // 0-indexed
  events: CalendarEvent[];
  anchorDay?: number; // day-of-month to anchor the visible week (default: today or 1)
}

function eventsForDay(events: CalendarEvent[], year: number, month: number, day: number) {
  return events.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date + "T00:00:00");
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
}

function eventHour(ev: CalendarEvent): number | null {
  if (!ev.time) return null;
  return parseInt(ev.time.split(":")[0], 10);
}

export function WeekView({ palette, year, month, events, anchorDay }: WeekViewProps) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const anchor =
    anchorDay ??
    (year === todayYear && month === todayMonth ? todayDay : 1);

  // Find the Monday of the week containing anchor
  const anchorDate = new Date(year, month, anchor);
  const dow = anchorDate.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(anchorDate);
  monday.setDate(anchorDate.getDate() + mondayOffset);

  // Build 7-day span
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  });

  return (
    <div
      style={{
        border: `1.5px solid ${palette.line}`,
        background: palette.surface,
        overflow: "hidden",
      }}
    >
      {/* header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px repeat(7, 1fr)",
          borderBottom: `1.5px solid ${palette.line}`,
          background: palette.surface2,
        }}
      >
        <div style={{ borderRight: `1px solid ${palette.lineSofter}` }} />
        {weekDays.map(({ year: wy, month: wm, day: wd }, i) => {
          const isToday =
            wd === todayDay && wm === todayMonth && wy === todayYear;
          return (
            <div
              key={i}
              style={{
                padding: "8px 10px",
                borderRight:
                  i < 6 ? `1px solid ${palette.lineSofter}` : "none",
                background: isToday ? palette.lime : "transparent",
                color: isToday ? palette.line : palette.ink,
              }}
            >
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                {WEEKDAY_LABELS[i]}
              </div>
              <div
                style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {wd}
              </div>
            </div>
          );
        })}
      </div>

      {/* all-day row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px repeat(7, 1fr)",
          borderBottom: `1.5px solid ${palette.line}`,
          minHeight: 44,
        }}
      >
        <div
          style={{
            borderRight: `1px solid ${palette.lineSofter}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            color: palette.inkDim,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          todo{"\n"}el día
        </div>
        {weekDays.map(({ year: wy, month: wm, day: wd }, i) => {
          const isToday =
            wd === todayDay && wm === todayMonth && wy === todayYear;
          const dayEvs = eventsForDay(events, wy, wm, wd).filter(
            (e) => !e.time,
          );
          return (
            <div
              key={i}
              style={{
                padding: 4,
                borderRight:
                  i < 6 ? `1px solid ${palette.lineSofter}` : "none",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                background: isToday ? palette.lime + "14" : "transparent",
              }}
            >
              {dayEvs.map((ev) => {
                const isMilestone =
                  ev.type === "goal-end" || ev.type === "goal-start";
                return (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "1px 4px",
                      background: isMilestone
                        ? ev.categoryColor
                        : "transparent",
                      borderLeft: isMilestone
                        ? "none"
                        : `3px solid ${ev.categoryColor}`,
                      color: isMilestone ? palette.bg : palette.ink,
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 10,
                      fontWeight: isMilestone ? 700 : 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      lineHeight: 1.3,
                    }}
                  >
                    {ev.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* hour grid */}
      <div style={{ maxHeight: 520, overflow: "auto" }}>
        {HOUR_SLOTS.map((h, hi) => (
          <div
            key={h}
            style={{
              display: "grid",
              gridTemplateColumns: "60px repeat(7, 1fr)",
              borderBottom:
                hi < HOUR_SLOTS.length - 1
                  ? `1px solid ${palette.lineSofter}`
                  : "none",
              minHeight: 60,
            }}
          >
            <div
              style={{
                borderRight: `1px solid ${palette.lineSofter}`,
                padding: "6px 8px",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: palette.inkDim,
                letterSpacing: "0.04em",
              }}
            >
              {String(h).padStart(2, "0")}:00
            </div>
            {weekDays.map(({ year: wy, month: wm, day: wd }, i) => {
              const isToday =
                wd === todayDay && wm === todayMonth && wy === todayYear;
              const slotEvs = eventsForDay(events, wy, wm, wd).filter((e) => {
                const eh = eventHour(e);
                return eh !== null && eh >= h && eh < h + 2;
              });
              return (
                <div
                  key={i}
                  style={{
                    padding: 4,
                    borderRight:
                      i < 6 ? `1px solid ${palette.lineSofter}` : "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    background: isToday
                      ? palette.lime + "10"
                      : "transparent",
                  }}
                >
                  {slotEvs.map((ev) => (
                    <div
                      key={ev.id}
                      style={{
                        padding: "4px 6px",
                        background: ev.categoryColor,
                        color: palette.bg,
                        fontFamily: '"Space Grotesk", system-ui, sans-serif',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "-0.005em",
                        lineHeight: 1.2,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: 8,
                          opacity: 0.85,
                        }}
                      >
                        {ev.time}
                      </div>
                      {ev.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
