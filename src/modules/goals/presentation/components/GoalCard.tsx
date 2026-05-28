"use client";

import * as React from "react";
import type { Goal } from "@/modules/goals/domain/entities/goal";
import type { DashPalette } from "@/shared/presentation/palette";

const TYPE_LABEL: Record<string, string> = {
  CONCLUSIVE: "Conclusiva",
  CYCLIC: "Cíclica",
};

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: "En curso",
  COMPLETED: "Completada",
  FAILED: "Fallida",
  ARCHIVED: "Archivada",
};

const CYCLE_PERIOD_LABEL: Record<string, string> = {
  DAILY: "diaria",
  WEEKLY: "semanal",
  MONTHLY: "mensual",
  YEARLY: "anual",
  CUSTOM_DAYS: "personalizada",
};

interface GoalCardProps {
  goal: Goal;
  palette: DashPalette;
  compact?: boolean;
  onClick?: () => void;
}

export function GoalCard({ goal, palette, compact, onClick }: GoalCardProps) {
  const instance = goal.activeInstance;
  const progress = instance?.progress ?? 0;
  const status = instance?.status ?? "IN_PROGRESS";
  const isCompleted = status === "COMPLETED";
  const isArchived = status === "ARCHIVED";
  const isFailed = status === "FAILED";

  const typeLabel =
    TYPE_LABEL[goal.type] +
    (goal.type === "CYCLIC" && goal.cyclePeriod
      ? ` · ${CYCLE_PERIOD_LABEL[goal.cyclePeriod] ?? goal.cyclePeriod}`
      : "");

  const progressColor = isCompleted ? palette.lime : goal.categoryId ? palette.primary : palette.primary;

  return (
    <div
      onClick={onClick}
      style={{
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        position: "relative",
        overflow: "hidden",
        transition: "transform .15s, box-shadow .15s",
        cursor: "pointer",
        opacity: isArchived || isFailed ? 0.75 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-2px, -2px)";
        e.currentTarget.style.boxShadow = `4px 4px 0 0 ${palette.primary}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* color strip */}
      <div
        style={{
          height: 8,
          background: palette.primary,
          borderBottom: `1.5px solid ${palette.line}`,
        }}
      />

      <div style={{ padding: compact ? "14px 14px 12px" : "18px 18px 16px" }}>
        {/* top row: type + actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: palette.inkDim,
            }}
          >
            <span
              style={{ width: 8, height: 8, background: palette.primary }}
            />
            {typeLabel}
          </div>
          <button
            aria-label="Más acciones"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: palette.inkDim,
              padding: 2,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
            }}
          >
            ···
          </button>
        </div>

        {/* title */}
        <h3
          style={{
            margin: 0,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: compact ? 16 : 18,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: palette.ink,
            lineHeight: 1.2,
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {goal.name}
        </h3>

        {/* progress */}
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: palette.ink,
              }}
            >
              {progress}
              <span
                style={{
                  fontSize: 12,
                  color: palette.inkDim,
                  fontWeight: 500,
                }}
              >
                %
              </span>
            </span>
          </div>
          <div
            style={{
              height: 8,
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
                width: `${progress}%`,
                background: progressColor,
                transition: "width .25s",
              }}
            />
          </div>
        </div>

        {/* footer: dates + status */}
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
            letterSpacing: "0.06em",
          }}
        >
          <span>
            {goal.startDate
              ? new Date(goal.startDate).toLocaleDateString("es", {
                  day: "numeric",
                  month: "short",
                })
              : "—"}
            {" → "}
            {goal.endDate
              ? new Date(goal.endDate).toLocaleDateString("es", {
                  day: "numeric",
                  month: "short",
                })
              : "—"}
          </span>
          <span
            style={{
              padding: "2px 6px",
              background: isCompleted
                ? palette.lime
                : isArchived
                  ? palette.lineSofter
                  : palette.surface,
              border: `1px solid ${isCompleted ? palette.line : palette.lineSoft}`,
              color: isCompleted ? palette.line : palette.inkDim,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {STATUS_LABEL[status] ?? status}
          </span>
        </div>
      </div>
    </div>
  );
}
