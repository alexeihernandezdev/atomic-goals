"use client";

import * as React from "react";
import Link from "next/link";
import type { DashPalette } from "@/shared/presentation/palette";
import type { UpcomingItem } from "@/modules/dashboard/domain/upcoming-item";

interface UpcomingListProps {
  items: UpcomingItem[];
  palette: DashPalette;
}

export function UpcomingList({ items, palette }: UpcomingListProps) {
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
          marginBottom: 8,
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
            esta semana
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
            Próximos pasos
          </div>
        </div>
        <Link
          href="/goals"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            color: palette.primary,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          todos →
        </Link>
      </div>

      <div>
        {items.map((item) => (
          <div
            key={item.goalId}
            style={{
              display: "grid",
              gridTemplateColumns: "6px 1fr auto",
              gap: 14,
              alignItems: "center",
              padding: "14px 0",
              borderBottom: `1px solid ${palette.lineSofter}`,
            }}
          >
            <div style={{ width: 6, alignSelf: "stretch", background: item.categoryColor }} />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                  color: palette.ink,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.goalName}
              </div>
              {item.stepTitle && (
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
                  {item.stepTitle}
                </div>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {item.dueLabel && (
                <div
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 12,
                    fontWeight: 600,
                    color: palette.ink,
                  }}
                >
                  {item.dueLabel}
                </div>
              )}
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  color: palette.inkDim,
                  letterSpacing: "0.04em",
                  marginTop: 2,
                }}
              >
                {item.progress}%
              </div>
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
            Sin pasos próximos.{" "}
            <Link href="/goals" style={{ color: palette.primary }}>
              Ver metas →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
