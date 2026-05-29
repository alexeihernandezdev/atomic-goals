"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/modules/categories/domain/entities/category";
import { CatIcon } from "./CatIcon";
import type { DashPalette } from "./palette";

function deterministicSpark(seedStr: string): number[] {
  let s = 0;
  for (let i = 0; i < seedStr.length; i++)
    s = ((s * 31 + seedStr.charCodeAt(i)) >>> 0);
  const out: number[] = [];
  for (let i = 0; i < 8; i++) {
    s = ((s * 1664525 + 1013904223) >>> 0);
    out.push(0.3 + (s / 4294967295) * 0.7);
  }
  return out;
}

interface CategoryCardProps {
  category: Category;
  palette: DashPalette;
  onEdit?: (category: Category) => void;
}

export function CategoryCard({ category, palette, onEdit }: CategoryCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = React.useState(false);
  const sparkline = React.useMemo(
    () => deterministicSpark(category.name),
    [category.name],
  );

  const goToDetail = () => router.push(`/categories/${category.id}`);

  return (
    <div
      onClick={goToDetail}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transform: hovered ? "translate(-3px, -3px)" : "none",
        boxShadow: hovered ? `6px 6px 0 0 ${category.color}` : "none",
        transition: "transform .15s, box-shadow .15s",
      }}
    >
      {/* Color hero with icon */}
      <div
        style={{
          background: category.color,
          padding: "20px 20px 16px",
          position: "relative",
          borderBottom: `1.5px solid ${palette.line}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 50,
            height: 50,
            background: palette.surface,
            border: `1.5px solid ${palette.line}`,
            color: palette.line,
            boxShadow: `3px 3px 0 0 ${palette.line}`,
          }}
        >
          <CatIcon kind={category.icon} size={26} color={palette.line} />
        </div>
        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -10,
            width: 60,
            height: 60,
            background: palette.line,
            opacity: 0.18,
            transform: "rotate(15deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: -8,
            width: 22,
            height: 22,
            background: palette.line,
            opacity: 0.18,
          }}
        />
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 4,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: palette.ink,
              textTransform: "capitalize",
            }}
          >
            {category.name}
          </h3>
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: palette.inkDim,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {category.goalCount} meta{category.goalCount !== 1 ? "s" : ""}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: palette.inkDim,
            lineHeight: 1.4,
            minHeight: 32,
          }}
        >
          {category.description ?? ""}
        </p>

        {/* avg progress */}
        <div style={{ marginTop: 14 }}>
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
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                color: palette.inkDim,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              promedio
            </span>
            <span
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: palette.ink,
              }}
            >
              {category.avgProgress}
              <span
                style={{ fontSize: 11, color: palette.inkDim, fontWeight: 500 }}
              >
                %
              </span>
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: palette.lineSofter,
              border: `1.5px solid ${palette.line}`,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${category.avgProgress}%`,
                background: category.color,
              }}
            />
          </div>
        </div>

        {/* sparkline */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: `1px solid ${palette.lineSofter}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                color: palette.inkDim,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: 1.3,
              }}
            >
              actividad
              <br />
              <span style={{ color: palette.ink }}>8 semanas</span>
            </div>
            <div
              style={{
                flex: 1,
                maxWidth: 110,
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
                height: 28,
              }}
            >
              {sparkline.map((v, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${v * 100}%`,
                    background: category.color,
                    opacity: 0.4 + v * 0.6,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* footer counters */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: `1px solid ${palette.lineSofter}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            color: palette.inkDim,
            letterSpacing: "0.04em",
          }}
        >
          <span>
            {category.activeGoals} activa
            {category.activeGoals !== 1 ? "s" : ""} ·{" "}
            {category.completedGoals} hecha
            {category.completedGoals !== 1 ? "s" : ""}
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(category);
            }}
            style={{
              color: palette.primary,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            abrir →
          </span>
        </div>
      </div>
    </div>
  );
}
