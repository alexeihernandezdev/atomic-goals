"use client";

import * as React from "react";
import Link from "next/link";
import type { DashPalette } from "@/shared/presentation/palette";
import type { DashboardSummary } from "@/modules/dashboard/domain/summary";

interface CategoryBreakdownProps {
  summary: DashboardSummary;
  palette: DashPalette;
}

export function CategoryBreakdown({ summary, palette }: CategoryBreakdownProps) {
  const { categories } = summary;
  const totalGoals = categories.reduce((s, c) => s + c.goalsCount, 0);

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
          marginBottom: 18,
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
            categorías
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
            {totalGoals} metas · {categories.length} categorías
          </div>
        </div>
        <Link
          href="/categories"
          style={{
            background: "transparent",
            border: `1.5px solid ${palette.line}`,
            padding: "6px 10px",
            cursor: "pointer",
            color: palette.ink,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          ver todas →
        </Link>
      </div>

      {/* Stacked bar */}
      {categories.length > 0 && (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 18,
            border: `1.5px solid ${palette.line}`,
            marginBottom: 18,
          }}
        >
          {categories.map((c, i) => (
            <div
              key={c.id}
              title={`${c.name}: ${c.goalsCount} metas`}
              style={{
                flex: c.goalsCount || 1,
                background: c.color,
                borderRight: i < categories.length - 1 ? `1.5px solid ${palette.line}` : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Category rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {categories.map((c) => (
          <div
            key={c.id}
            style={{
              display: "grid",
              gridTemplateColumns: "14px 1fr 56px 36px",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{ width: 14, height: 14, background: c.color, flexShrink: 0 }}
            />
            <div
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.005em",
                textTransform: "capitalize",
                color: palette.ink,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {c.name}
            </div>
            <div
              style={{
                height: 4,
                background: palette.lineSofter,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${c.avgProgress}%`,
                  background: c.color,
                }}
              />
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: palette.inkDim,
                textAlign: "right",
                letterSpacing: "0.04em",
              }}
            >
              {c.avgProgress}%
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
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
          Sin categorías todavía.{" "}
          <Link href="/categories" style={{ color: palette.primary }}>
            Crear una →
          </Link>
        </div>
      )}
    </div>
  );
}
