"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";

interface StepFrameProps {
  palette: DashPalette;
  accentColor: string;
  title: string;
  badge: string;
  weight: number;
  due?: string | null;
  percent: number;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onMoreClick?: () => void;
  children: React.ReactNode;
}

export function StepFrame({
  palette,
  accentColor,
  title,
  badge,
  weight,
  due,
  percent,
  dragHandleProps,
  onMoreClick,
  children,
}: StepFrameProps) {
  return (
    <div
      style={{
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        padding: "14px 16px",
        display: "grid",
        gridTemplateColumns: "20px 1fr 70px",
        gap: 14,
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      {/* color bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: accentColor,
        }}
      />

      {/* drag handle */}
      <div
        {...dragHandleProps}
        style={{
          marginTop: 4,
          cursor: "grab",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          color: palette.inkSubtle,
          touchAction: "none",
        }}
        title="Arrastrar para reordenar"
      >
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ display: "flex", gap: 2 }}>
            <span style={{ width: 3, height: 3, background: "currentColor" }} />
            <span style={{ width: 3, height: 3, background: "currentColor" }} />
          </div>
        ))}
      </div>

      {/* content */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: palette.ink,
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "2px 6px",
              background: palette.lineSofter,
              color: palette.inkDim,
            }}
          >
            {badge}
          </span>
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            color: palette.inkDim,
            letterSpacing: "0.06em",
            marginBottom: 10,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span>peso · {weight}</span>
          {due && <span>vence · {due}</span>}
        </div>
        {children}
      </div>

      {/* percent + menu */}
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: palette.ink,
            lineHeight: 1,
          }}
        >
          {percent}
          <span style={{ fontSize: 13, color: palette.inkDim }}>%</span>
        </div>
        <button
          aria-label="Más acciones"
          onClick={onMoreClick}
          style={{
            marginTop: 6,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: palette.inkDim,
            padding: 2,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            letterSpacing: "0.06em",
          }}
        >
          ···
        </button>
      </div>
    </div>
  );
}
