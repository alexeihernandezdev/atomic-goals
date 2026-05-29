"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DashPalette } from "@/shared/presentation/palette";
import type { TimelineData, TimelineRange } from "@/modules/dashboard/domain/timeline-point";

const RANGES: { value: TimelineRange; label: string }[] = [
  { value: "week", label: "7d" },
  { value: "month", label: "30d" },
  { value: "year", label: "año" },
];

interface TimelineChartProps {
  data: TimelineData;
  palette: DashPalette;
}

export function TimelineChart({ data, palette }: TimelineChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = (searchParams.get("range") as TimelineRange) ?? data.range ?? "month";

  const handleRange = (range: TimelineRange) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`?${params.toString()}`);
  };

  const points = data.points;
  const maxVal = Math.max(...points.map((p) => p.completedSteps), 1);

  const periodLabel = currentRange === "week" ? "7 días" : currentRange === "month" ? "30 días" : "este año";
  const firstDate = points[0]?.date
    ? new Date(points[0].date).toLocaleDateString("es", { day: "numeric", month: "short" })
    : "";
  const lastDate = points[points.length - 1]?.date
    ? new Date(points[points.length - 1].date).toLocaleDateString("es", { day: "numeric", month: "short" })
    : "hoy";

  return (
    <div
      style={{
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        padding: "20px 22px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: palette.inkDim,
              marginBottom: 4,
            }}
          >
            progreso · {periodLabel}
          </div>
          <div
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: palette.ink,
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            + {data.totalCompleted} pasos completados
            {data.growthPercent !== null && (
              <span
                style={{
                  background: data.growthPercent >= 0 ? palette.lime : palette.magenta,
                  color: palette.line,
                  padding: "0 6px",
                  fontSize: 14,
                }}
              >
                {data.growthPercent >= 0 ? "↑" : "↓"} {Math.abs(data.growthPercent)}%
              </span>
            )}
          </div>
        </div>

        {/* Range selector */}
        <div
          style={{
            display: "inline-flex",
            border: `1.5px solid ${palette.line}`,
            overflow: "hidden",
          }}
        >
          {RANGES.map(({ value, label }, i) => (
            <button
              key={value}
              onClick={() => handleRange(value)}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                border: "none",
                background: currentRange === value ? palette.line : "transparent",
                color: currentRange === value ? palette.bg : palette.ink,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRight: i < RANGES.length - 1 ? `1.5px solid ${palette.line}` : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          height: 120,
        }}
      >
        {points.map((p, i) => {
          const pct = p.completedSteps === 0 ? 0.14 : 0.2 + (p.completedSteps / maxVal) * 0.8;
          const opacity = p.completedSteps === 0 ? 1 : p.completedSteps < maxVal * 0.33 ? 0.35 : p.completedSteps < maxVal * 0.66 ? 0.65 : 1;
          return (
            <div
              key={i}
              title={`${p.date}: ${p.completedSteps} pasos`}
              style={{
                flex: 1,
                height: `${Math.round(pct * 100)}%`,
                background: p.completedSteps === 0 ? palette.lineSofter : palette.primary,
                opacity: p.completedSteps === 0 ? 1 : opacity,
                transition: "opacity .25s, background .25s",
                cursor: "default",
              }}
            />
          );
        })}
      </div>

      {/* X axis labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          color: palette.inkDim,
          letterSpacing: "0.06em",
          marginTop: 10,
        }}
      >
        <span>{firstDate}</span>
        <span>{lastDate} · hoy</span>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 18,
          marginTop: 18,
          paddingTop: 16,
          borderTop: `1px solid ${palette.lineSofter}`,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: palette.inkDim,
          letterSpacing: "0.04em",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, background: palette.primary }} />
          días activos · {data.activeDays}/{data.totalDays}
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              background: palette.lineSofter,
              border: `1px solid ${palette.lineSoft}`,
            }}
          />
          días en blanco · {data.totalDays - data.activeDays}
        </div>
        {data.totalDays > 0 && (
          <div style={{ marginLeft: "auto", color: palette.ink, fontWeight: 600 }}>
            promedio {(data.totalCompleted / data.totalDays).toFixed(1)} pasos/día
          </div>
        )}
      </div>
    </div>
  );
}
