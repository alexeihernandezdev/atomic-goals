"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { DASH_PALETTES } from "@/shared/presentation/palette";
import { clientContainer } from "@/shared/composition/client-container";
import type { CalendarEvent } from "../../domain/calendar-event";
import { CalendarFilters } from "./CalendarFilters";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";

interface CalendarScreenProps {
  initialEvents: CalendarEvent[];
  initialYear: number;
  initialMonth: number; // 0-indexed
}

function monthBounds(year: number, month: number) {
  const from = new Date(year, month, 1).toISOString();
  const to = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();
  return { from, to };
}

export function CalendarScreen({
  initialEvents,
  initialYear,
  initialMonth,
}: CalendarScreenProps) {
  const { resolvedTheme } = useTheme();
  const palette =
    resolvedTheme === "dark" ? DASH_PALETTES.dark : DASH_PALETTES.light;

  const [view, setView] = React.useState<"month" | "week">("month");
  const [year, setYear] = React.useState(initialYear);
  const [month, setMonth] = React.useState(initialMonth);
  const [filterCat, setFilterCat] = React.useState<string>("all");
  const [openDay, setOpenDay] = React.useState<number | null>(null);
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);
  const [loading, setLoading] = React.useState(false);

  const categories = React.useMemo(() => {
    const map = new Map<string, { name: string; color: string }>();
    events.forEach((e) => {
      if (e.categoryName && !map.has(e.categoryName)) {
        map.set(e.categoryName, { name: e.categoryName, color: e.categoryColor });
      }
    });
    return Array.from(map.values());
  }, [events]);

  const filteredEvents =
    filterCat === "all"
      ? events
      : events.filter((e) => e.categoryName === filterCat);

  async function loadMonth(newYear: number, newMonth: number) {
    setLoading(true);
    try {
      const { from, to } = monthBounds(newYear, newMonth);
      const container = clientContainer();
      const data = await container.calendar.getEvents.execute({ from, to });
      setEvents(data);
    } catch {
      // keep existing events on error
    } finally {
      setLoading(false);
    }
  }

  async function handleNavigate(dir: -1 | 1) {
    let newYear = year;
    let newMonth = month + dir;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setYear(newYear);
    setMonth(newMonth);
    setOpenDay(null);
    await loadMonth(newYear, newMonth);
  }

  async function handleToday() {
    const now = new Date();
    const newYear = now.getFullYear();
    const newMonth = now.getMonth();
    if (newYear === year && newMonth === month) {
      setOpenDay(now.getDate());
      return;
    }
    setYear(newYear);
    setMonth(newMonth);
    setOpenDay(null);
    await loadMonth(newYear, newMonth);
  }

  const today = new Date();
  const todayStr =
    year === today.getFullYear() && month === today.getMonth()
      ? `hoy ${today.getDate()} may`
      : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: palette.inkDim,
              marginBottom: 4,
            }}
          >
            calendario · {filteredEvents.length} eventos este mes
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: palette.ink,
            }}
          >
            Tu mes,{" "}
            <span
              style={{
                background: palette.primary,
                color: palette.bg,
                padding: "0 8px",
              }}
            >
              paso a paso
            </span>
            .
          </h1>
        </div>
        <button
          style={{
            background: palette.line,
            color: palette.bg,
            border: "none",
            padding: "10px 16px",
            cursor: "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            boxShadow: `4px 4px 0 0 ${palette.primary}`,
            marginTop: 8,
          }}
        >
          + Agendar
        </button>
      </div>

      <CalendarFilters
        palette={palette}
        view={view}
        onViewChange={setView}
        year={year}
        month={month}
        filterCat={filterCat}
        onFilterCatChange={(c) => {
          setFilterCat(c);
          setOpenDay(null);
        }}
        categories={categories}
        onNavigate={handleNavigate}
        onToday={handleToday}
      />

      {view === "month" ? (
        <MonthView
          palette={palette}
          year={year}
          month={month}
          events={filteredEvents}
          openDay={openDay}
          onDayClick={(d) => setOpenDay(openDay === d ? null : d)}
          onPopoverClose={() => setOpenDay(null)}
          loading={loading}
        />
      ) : (
        <WeekView
          palette={palette}
          year={year}
          month={month}
          events={filteredEvents}
        />
      )}

      {/* legend */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          color: palette.inkDim,
          letterSpacing: "0.06em",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 18,
              height: 10,
              borderLeft: `3px solid ${palette.primary}`,
              display: "inline-block",
            }}
          />
          paso agendado
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 18,
              height: 10,
              background: palette.magenta,
              display: "inline-block",
            }}
          />
          fecha límite / inicio de meta
        </span>
        {todayStr && (
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                background: palette.lime,
                display: "inline-block",
              }}
            />
            {todayStr}
          </span>
        )}
      </div>
    </div>
  );
}
