"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { ProgressBarStep as ProgressBarStepData } from "@/modules/steps/domain/entities/step";
import { ProgressCalculator } from "@/modules/steps/domain/services/progress-calculator";
import { StepFrame } from "../StepFrame";

interface ProgressBarStepProps {
  step: ProgressBarStepData;
  palette: DashPalette;
  accentColor: string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  cycleInfo?: string | null;
  estimatedMinutes?: number | null;
  onProgressChange: (current: number) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProgressBarStep({
  step,
  palette,
  accentColor,
  dragHandleProps,
  cycleInfo,
  estimatedMinutes,
  onProgressChange,
  onEdit,
  onDelete,
}: ProgressBarStepProps) {
  const [localCurrent, setLocalCurrent] = React.useState(step.current);

  React.useEffect(() => {
    setLocalCurrent(step.current);
  }, [step.current]);

  const percent = ProgressCalculator.forStep({ ...step, current: localCurrent });

  const handleBlur = () => {
    if (localCurrent !== step.current) {
      onProgressChange(localCurrent);
    }
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
      badge="barra de progreso"
      weight={step.weight}
      due={due}
      cycleInfo={cycleInfo}
      estimatedMinutes={estimatedMinutes}
      percent={percent}
      dragHandleProps={dragHandleProps}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="number"
          value={localCurrent}
          min={0}
          max={step.target}
          onChange={(e) =>
            setLocalCurrent(
              Math.min(step.target, Math.max(0, Number(e.target.value) || 0)),
            )
          }
          onBlur={handleBlur}
          style={{
            width: 70,
            height: 32,
            padding: "0 10px",
            border: `1.5px solid ${palette.line}`,
            background: palette.surface,
            color: palette.ink,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            outline: "none",
          }}
        />
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            color: palette.inkDim,
            letterSpacing: "0.04em",
          }}
        >
          / {step.target} {step.unit ?? ""}
        </div>
        <div
          style={{
            flex: 1,
            height: 10,
            background: palette.lineSofter,
            position: "relative",
            border: `1.5px solid ${palette.line}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${percent}%`,
              background: accentColor,
              transition: "width .25s",
            }}
          />
        </div>
      </div>
    </StepFrame>
  );
}
