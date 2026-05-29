"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { DashboardSummary } from "@/modules/dashboard/domain/summary";

interface StatCardProps {
  palette: DashPalette;
  label: string;
  value: string | number;
  suffix?: string;
  sub: string;
  accent: string;
  inverse?: boolean;
}

function StatCard({ palette, label, value, suffix, sub, accent, inverse }: StatCardProps) {
  return (
    <div
      style={{
        background: inverse ? palette.line : palette.surface,
        color: inverse ? palette.bg : palette.ink,
        border: `1.5px solid ${palette.line}`,
        padding: "18px 18px 16px",
        position: "relative",
        overflow: "hidden",
        boxShadow: `4px 4px 0 0 ${accent}`,
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: inverse ? "rgba(244,244,239,0.6)" : palette.inkDim,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontWeight: 700,
          letterSpacing: "-0.035em",
          lineHeight: 0.9,
        }}
      >
        <span style={{ fontSize: 40 }}>{value}</span>
        {suffix && (
          <span
            style={{
              fontSize: 14,
              color: inverse ? "rgba(244,244,239,0.6)" : palette.inkDim,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 10,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: "0.06em",
            color: inverse ? "rgba(244,244,239,0.55)" : palette.inkDim,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

interface SummaryCardsProps {
  summary: DashboardSummary;
  palette: DashPalette;
}

export function SummaryCards({ summary, palette }: SummaryCardsProps) {
  const { stats, streak } = summary;

  const stepsLabel =
    stats.stepsTodayTotal > 0
      ? `${stats.stepsTodayTotal - stats.stepsToday} te quedan por hoy`
      : "sin pasos programados hoy";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginTop: 20,
      }}
    >
      <StatCard
        palette={palette}
        label="metas activas"
        value={stats.activeGoals}
        sub="en progreso ahora"
        accent={palette.primary}
      />
      <StatCard
        palette={palette}
        label="completadas · mes"
        value={stats.completedThisMonth}
        suffix={stats.totalGoalsThisMonth > 0 ? `/ ${stats.totalGoalsThisMonth}` : undefined}
        sub={
          stats.totalGoalsThisMonth > 0
            ? `${Math.round((stats.completedThisMonth / stats.totalGoalsThisMonth) * 100)}% del objetivo`
            : "este mes"
        }
        accent={palette.lime}
      />
      <StatCard
        palette={palette}
        label="pasos · hoy"
        value={stats.stepsToday}
        suffix={stats.stepsTodayTotal > 0 ? `/ ${stats.stepsTodayTotal}` : undefined}
        sub={stepsLabel}
        accent={palette.yellow}
      />
      <StatCard
        palette={palette}
        label="récord racha"
        value={streak.record}
        suffix="días"
        sub={
          streak.current >= streak.record
            ? "¡récord actual!"
            : `superable en ${streak.record - streak.current} días`
        }
        accent={palette.magenta}
        inverse
      />
    </div>
  );
}
