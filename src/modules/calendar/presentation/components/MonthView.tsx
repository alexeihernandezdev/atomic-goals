"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
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
  onSchedule: (day: number) => void;
  onReschedule: (stepId: string, target: Date) => Promise<boolean>;
  loading: boolean;
}

function eventsForDay(events: CalendarEvent[], year: number, month: number, day: number) {
  return events.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date + "T00:00:00");
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
}

// Step-backed events can be dragged to another day to reschedule them;
// goal milestones (start/end) are anchored and not draggable.
function isDraggable(ev: CalendarEvent): boolean {
  return !!ev.stepId && (ev.type === "step" || ev.type === "cyclic");
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

interface DraggableChipProps {
  ev: CalendarEvent;
  day: number;
  palette: DashPalette;
}

function DraggableChip({ ev, day, palette }: DraggableChipProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `step-${ev.stepId}`,
    data: { stepId: ev.stepId, sourceDay: day },
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
        touchAction: "none",
      }}
    >
      <EventChip ev={ev} palette={palette} />
    </div>
  );
}

interface DayCellProps {
  day: number | null;
  di: number;
  index: number; // unique grid position, for stable empty-cell droppable ids
  year: number;
  month: number;
  isToday: boolean;
  isWeekend: boolean;
  dayEvents: CalendarEvent[];
  palette: DashPalette;
  openDay: number | null;
  onDayClick: (day: number) => void;
  onPopoverClose: () => void;
  onSchedule: (day: number) => void;
}

function DayCell({
  day, di, index, year, month, isToday, isWeekend, dayEvents, palette,
  openDay, onDayClick, onPopoverClose, onSchedule,
}: DayCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day != null ? `day-${day}` : `empty-${index}`,
    disabled: day == null,
  });

  const shown = dayEvents.slice(0, 3);
  const extra = dayEvents.length - shown.length;

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 116,
        padding: "6px 7px",
        borderRight: di < 6 ? `1px solid ${palette.lineSofter}` : "none",
        background:
          day == null
            ? palette.bg
            : isOver
            ? palette.primary + "22"
            : isToday
            ? palette.lime + "20"
            : isWeekend
            ? palette.surface2
            : palette.surface,
        position: "relative",
        cursor: day ? "pointer" : "default",
        outline: isOver ? `1.5px dashed ${palette.primary}` : "none",
        outlineOffset: -2,
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
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {shown.map((ev) =>
              isDraggable(ev) ? (
                <DraggableChip key={ev.id} ev={ev} day={day} palette={palette} />
              ) : (
                <EventChip key={ev.id} ev={ev} palette={palette} />
              ),
            )}
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
              onSchedule={() => onSchedule(day)}
            />
          )}
        </>
      )}
    </div>
  );
}

export function MonthView({
  palette, year, month, events, openDay, onDayClick, onPopoverClose,
  onSchedule, onReschedule, loading,
}: MonthViewProps) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  // Require a small drag distance so clicking a chip still opens the day popover.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

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

  function handleDragEnd(e: DragEndEvent) {
    const stepId = e.active.data.current?.stepId as string | undefined;
    const sourceDay = e.active.data.current?.sourceDay as number | undefined;
    const overId = e.over?.id;
    if (!stepId || typeof overId !== "string" || !overId.startsWith("day-")) {
      return;
    }
    const targetDay = Number(overId.slice("day-".length));
    if (!Number.isFinite(targetDay) || targetDay === sourceDay) return;
    void onReschedule(stepId, new Date(year, month, targetDay));
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
                borderRight: i < 6 ? `1px solid ${palette.lineSofter}` : "none",
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
              const dayEvents = day
                ? eventsForDay(events, year, month, day)
                : [];

              return (
                <DayCell
                  key={di}
                  day={day}
                  di={di}
                  index={wi * 7 + di}
                  year={year}
                  month={month}
                  isToday={isToday}
                  isWeekend={isWeekend}
                  dayEvents={dayEvents}
                  palette={palette}
                  openDay={openDay}
                  onDayClick={onDayClick}
                  onPopoverClose={onPopoverClose}
                  onSchedule={onSchedule}
                />
              );
            })}
          </div>
        ))}
      </div>
    </DndContext>
  );
}
