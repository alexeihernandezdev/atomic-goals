"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { ActivityLog } from "@/modules/dashboard/domain/activity-log";

const KIND_TEXT: Record<string, string> = {
  GOAL_CREATED: "Nueva meta",
  GOAL_COMPLETED: "Completaste",
  GOAL_UPDATED: "Actualizaste",
  STEP_UPDATED: "Avanzaste en",
  STEP_COMPLETED: "Completaste",
  STREAK_MILESTONE: "Racha",
  CATEGORY_CREATED: "Nueva categoría",
};

function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `hace ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ayer";
  return `hace ${days} días`;
}

interface ActivityFeedProps {
  items: ActivityLog[];
  palette: DashPalette;
}

export function ActivityFeed({ items, palette }: ActivityFeedProps) {
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
          alignItems: "baseline",
          marginBottom: 12,
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
            actividad reciente
          </div>
          <div
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: palette.ink,
            }}
          >
            Últimos 7 días
          </div>
        </div>
      </div>

      <div>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "10px 1fr auto",
              gap: 12,
              alignItems: "flex-start",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                marginTop: 6,
                background: item.color ?? palette.primary,
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 13,
                  color: palette.ink,
                  lineHeight: 1.35,
                }}
              >
                {KIND_TEXT[item.kind] ?? item.kind}{" "}
                <span style={{ fontWeight: 700 }}>{item.entityName}</span>
                {item.detail && (
                  <span style={{ color: palette.inkDim }}> · {item.detail}</span>
                )}
              </div>
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: palette.inkSubtle,
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                marginTop: 4,
              }}
            >
              {relativeTime(item.createdAt)}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div
            style={{
              padding: "24px 0",
              textAlign: "center",
              color: palette.inkDim,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.06em",
            }}
          >
            Sin actividad reciente.
          </div>
        )}
      </div>
    </div>
  );
}
