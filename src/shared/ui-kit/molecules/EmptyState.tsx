"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";

interface EmptyStateProps {
  palette: DashPalette;
  title: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ palette, title, description, icon = "○" }: EmptyStateProps) {
  return (
    <div style={{ padding: "48px 20px", textAlign: "center" }}>
      <div
        style={{
          width: 56,
          height: 56,
          margin: "0 auto 14px",
          border: `1.5px dashed ${palette.lineSoft}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: palette.inkSubtle,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 22,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 16,
          fontWeight: 700,
          color: palette.ink,
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      {description && (
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            color: palette.inkDim,
            letterSpacing: "0.04em",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
