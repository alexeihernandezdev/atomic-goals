"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { DashboardSummary } from "@/modules/dashboard/domain/summary";

const DAY_LABELS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

interface StreakHeroProps {
  summary: DashboardSummary;
  palette: DashPalette;
  userName: string;
}

export function StreakHero({ summary, palette, userName }: StreakHeroProps) {
  const { streak } = summary;
  const today = new Date().toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <div
      style={{
        position: "relative",
        background: palette.line,
        color: palette.bg,
        padding: "28px 32px",
        overflow: "hidden",
        border: `1.5px solid ${palette.line}`,
      }}
    >
      {/* Decorative color blocks */}
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 200,
          height: 200,
          background: palette.magenta,
          opacity: 0.9,
          transform: "rotate(8deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 140,
          bottom: -20,
          width: 80,
          height: 80,
          background: palette.yellow,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 50,
          top: 30,
          width: 36,
          height: 36,
          background: palette.lime,
        }}
      />

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        {/* Left — streak + week bars */}
        <div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.55,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: palette.lime,
                animation: "dash-pulse 1.8s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            tu racha · semana actual · {today}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
            }}
          >
            <div
              style={{
                fontSize: 128,
                fontWeight: 700,
                lineHeight: 0.82,
                letterSpacing: "-0.045em",
              }}
            >
              {streak.current}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>
                días seguidos
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 12,
                  opacity: 0.6,
                  marginTop: 4,
                  letterSpacing: "0.06em",
                }}
              >
                récord personal · {streak.record} días
              </div>
            </div>
          </div>

          {/* Week activity bars */}
          <div style={{ marginTop: 22, maxWidth: 420 }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
              {(streak.weekActivity.length === 7
                ? streak.weekActivity
                : Array(7).fill(false)
              ).map((on, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 14,
                    background: on
                      ? palette.lime
                      : "rgba(255,255,255,0.18)",
                    transition: "background .25s",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.55,
              }}
            >
              {DAY_LABELS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — quote */}
        <div
          style={{
            position: "relative",
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 200,
          }}
        >
          <blockquote
            style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 19,
              lineHeight: 1.3,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              maxWidth: 320,
            }}
          >
            "Pequeños cambios, resultados extraordinarios."
          </blockquote>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: "0.06em",
              opacity: 0.6,
            }}
          >
            — hábitos atómicos
          </div>
        </div>
      </div>

      <style>{`@keyframes dash-pulse { 0%, 100% { opacity: 1 } 50% { opacity: .3 } }`}</style>
    </div>
  );
}
