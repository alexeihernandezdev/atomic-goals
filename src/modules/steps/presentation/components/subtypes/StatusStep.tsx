"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { StatusStep as StatusStepData } from "@/modules/steps/domain/entities/step";
import { ProgressCalculator } from "@/modules/steps/domain/services/progress-calculator";
import { StepFrame } from "../StepFrame";

interface StatusStepProps {
  step: StatusStepData;
  palette: DashPalette;
  accentColor: string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  cycleInfo?: string | null;
  estimatedMinutes?: number | null;
  onProgressChange: (statusId: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function StatusStep({
  step,
  palette,
  accentColor,
  dragHandleProps,
  cycleInfo,
  estimatedMinutes,
  onProgressChange,
  onEdit,
  onDelete,
}: StatusStepProps) {
  const [currentId, setCurrentId] = React.useState(step.currentStatusId);

  React.useEffect(() => {
    setCurrentId(step.currentStatusId);
  }, [step.currentStatusId]);

  const percent = ProgressCalculator.forStep({ ...step, currentStatusId: currentId });

  const handleSelect = (id: string) => {
    setCurrentId(id);
    onProgressChange(id);
  };

  const due = step.endDate
    ? new Date(step.endDate).toLocaleDateString("es", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <StepFrame
      palette={palette}
      accentColor={accentColor}
      title={step.title}
      badge="estados"
      weight={step.weight}
      due={due}
      cycleInfo={cycleInfo}
      estimatedMinutes={estimatedMinutes}
      percent={percent}
      dragHandleProps={dragHandleProps}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {step.statuses
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((s) => {
            const active = s.id === currentId;
            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s.id)}
                style={{
                  padding: "6px 12px",
                  border: `1.5px solid ${palette.line}`,
                  background: active ? accentColor : "transparent",
                  color: active ? palette.bg : palette.ink,
                  cursor: "pointer",
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "-0.005em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "background .15s, color .15s",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: active ? palette.bg : accentColor,
                    opacity: active ? 1 : 0.6,
                    flexShrink: 0,
                  }}
                />
                {s.label}
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 9,
                    opacity: 0.7,
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.percentage}%
                </span>
              </button>
            );
          })}
      </div>
    </StepFrame>
  );
}
