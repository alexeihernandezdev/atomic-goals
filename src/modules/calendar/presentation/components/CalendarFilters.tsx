"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

interface Category {
  name: string;
  color: string;
}

interface FilterChipProps {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
  palette: DashPalette;
}

function FilterChip({ label, active, color, onClick, palette }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        border: `1.5px solid ${palette.line}`,
        background: active ? palette.line : palette.surface,
        color: active ? palette.bg : palette.ink,
        cursor: "pointer",
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        transition: "background .12s, color .12s",
        whiteSpace: "nowrap",
      }}
    >
      {color && (
        <span style={{ width: 8, height: 8, background: color, flexShrink: 0 }} />
      )}
      {label}
    </button>
  );
}

interface CalendarFiltersProps {
  palette: DashPalette;
  view: "month" | "week";
  onViewChange: (v: "month" | "week") => void;
  year: number;
  month: number;
  filterCat: string;
  onFilterCatChange: (c: string) => void;
  categories: Category[];
  onNavigate: (dir: -1 | 1) => void;
  onToday: () => void;
}

export function CalendarFilters({
  palette, view, onViewChange, year, month,
  filterCat, onFilterCatChange, categories,
  onNavigate, onToday,
}: CalendarFiltersProps) {
  return (
    <div
      style={{
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
        marginBottom: 16,
      }}
    >
      {/* month nav */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => onNavigate(-1)}
          style={{
            width: 30,
            height: 30,
            border: `1.5px solid ${palette.line}`,
            background: palette.surface,
            color: palette.ink,
            cursor: "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ←
        </button>
        <div
          style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: palette.ink,
            minWidth: 160,
            textAlign: "center",
          }}
        >
          {MONTH_NAMES[month]}{" "}
          <span style={{ color: palette.inkDim, fontWeight: 500 }}>{year}</span>
        </div>
        <button
          onClick={() => onNavigate(1)}
          style={{
            width: 30,
            height: 30,
            border: `1.5px solid ${palette.line}`,
            background: palette.surface,
            color: palette.ink,
            cursor: "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          →
        </button>
        <button
          onClick={onToday}
          style={{
            marginLeft: 4,
            padding: "7px 12px",
            border: `1.5px solid ${palette.line}`,
            background: palette.bg,
            color: palette.ink,
            cursor: "pointer",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          hoy
        </button>
      </div>

      {/* category filters */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
          marginLeft: 8,
          flex: 1,
          minWidth: 0,
        }}
      >
        <FilterChip
          label="todas"
          active={filterCat === "all"}
          onClick={() => onFilterCatChange("all")}
          palette={palette}
        />
        {categories.map((c) => (
          <FilterChip
            key={c.name}
            label={c.name}
            color={c.color}
            active={filterCat === c.name}
            onClick={() => onFilterCatChange(c.name)}
            palette={palette}
          />
        ))}
      </div>

      {/* view toggle */}
      <div
        style={{
          display: "inline-flex",
          border: `1.5px solid ${palette.line}`,
          overflow: "hidden",
          marginLeft: "auto",
          flexShrink: 0,
        }}
      >
        {(
          [
            ["month", "mes"],
            ["week", "semana"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => onViewChange(k)}
            style={{
              padding: "7px 14px",
              border: "none",
              cursor: "pointer",
              background: view === k ? palette.line : "transparent",
              color: view === k ? palette.bg : palette.ink,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRight:
                k === "month" ? `1.5px solid ${palette.line}` : "none",
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
