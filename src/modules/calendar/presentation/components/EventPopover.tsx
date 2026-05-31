"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { CalendarEvent } from "../../domain/calendar-event";

interface EventPopoverProps {
  day: number;
  month: number; // 0-indexed
  year: number;
  isToday: boolean;
  events: CalendarEvent[];
  palette: DashPalette;
  anchorRight: boolean;
  onClose: () => void;
}

const MONTH_NAMES_GEN = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];

export function EventPopover({
  day, month, year, isToday, events, palette, anchorRight, onClose,
}: EventPopoverProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 8,
        ...(anchorRight ? { right: 8 } : { left: 8 }),
        width: 268,
        zIndex: 30,
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        boxShadow: `6px 6px 0 0 ${palette.line}`,
      }}
    >
      {/* header */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: `1.5px solid ${palette.line}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: isToday ? palette.lime : palette.surface,
          color: palette.line,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            {isToday ? "hoy" : MONTH_NAMES_GEN[month]}
          </div>
          <div
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {day} de {MONTH_NAMES_GEN[month]}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 24,
            height: 24,
            border: `1.5px solid ${palette.line}`,
            background: "transparent",
            color: palette.line,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* event list */}
      <div style={{ padding: "10px 14px", maxHeight: 280, overflow: "auto" }}>
        {events.length === 0 ? (
          <div
            style={{
              padding: "16px 0",
              textAlign: "center",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              color: palette.inkDim,
              letterSpacing: "0.04em",
            }}
          >
            nada agendado · día libre
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {events.map((ev, i) => (
              <div
                key={ev.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "4px 1fr",
                  gap: 10,
                  paddingBottom: 8,
                  borderBottom:
                    i < events.length - 1
                      ? `1px solid ${palette.lineSofter}`
                      : "none",
                }}
              >
                <div style={{ background: ev.categoryColor }} />
                <div>
                  <div
                    style={{
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      color: palette.ink,
                    }}
                  >
                    {ev.title}
                  </div>
                  <div
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 10,
                      color: palette.inkDim,
                      marginTop: 2,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {ev.time ? `${ev.time} · ` : ""}
                    {ev.goalName}
                  </div>
                  {(ev.type === "goal-end" || ev.type === "goal-start") && (
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 4,
                        padding: "1px 6px",
                        background: ev.categoryColor,
                        color: palette.line,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 8,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {ev.type === "goal-end" ? "fecha límite" : "inicio"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          style={{
            width: "100%",
            marginTop: 10,
            padding: "8px",
            border: `1.5px dashed ${palette.lineSoft}`,
            background: "transparent",
            color: palette.inkDim,
            cursor: "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          + Agendar paso
        </button>
      </div>
    </div>
  );
}
