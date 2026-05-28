"use client";

import * as React from "react";
import type { Goal } from "@/modules/goals/domain/entities/goal";
import type { DashPalette } from "@/shared/presentation/palette";

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: "En curso",
  COMPLETED: "Completada",
  FAILED: "Fallida",
  ARCHIVED: "Archivada",
};

interface GoalRowProps {
  goal: Goal;
  palette: DashPalette;
  onClick?: () => void;
}

export function GoalRow({ goal, palette, onClick }: GoalRowProps) {
  const instance = goal.activeInstance;
  const progress = instance?.progress ?? 0;
  const status = instance?.status ?? "IN_PROGRESS";
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "6px 1.6fr 1fr 90px 36px",
        gap: 16,
        alignItems: "center",
        padding: "14px 16px 14px 0",
        borderBottom: `1px solid ${palette.lineSofter}`,
        background: hovered ? palette.surface2 : palette.surface,
        cursor: "pointer",
        transition: "background .12s",
      }}
    >
      <div style={{ alignSelf: "stretch", background: palette.primary }} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: palette.ink,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {goal.name}
        </div>
        {goal.description && (
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              color: palette.inkDim,
              marginTop: 2,
              letterSpacing: "0.02em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {goal.description}
          </div>
        )}
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              color: palette.ink,
            }}
          >
            {progress}
            <span style={{ color: palette.inkDim, fontWeight: 500 }}>%</span>
          </span>
        </div>
        <div
          style={{
            height: 5,
            background: palette.lineSofter,
            position: "relative",
            border: `1px solid ${palette.line}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress}%`,
              background: palette.primary,
            }}
          />
        </div>
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          color: palette.inkDim,
          letterSpacing: "0.04em",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        {STATUS_LABEL[status] ?? status}
      </div>
      <button
        aria-label="Más acciones"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: palette.inkDim,
          padding: 4,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 14,
        }}
      >
        ···
      </button>
    </div>
  );
}
