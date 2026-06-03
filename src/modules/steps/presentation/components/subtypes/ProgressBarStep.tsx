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

  const handleChange = (value: number) => {
    setLocalCurrent(value);
    onProgressChange(value);
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
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          type="range"
          value={localCurrent}
          min={0}
          max={step.target}
          step={1}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor,
            cursor: "pointer",
            height: 6,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            color: palette.inkDim,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ color: palette.ink, fontWeight: 700 }}>
            {localCurrent}{step.unit ? ` ${step.unit}` : ""}
          </span>
          <span>
            {step.target}{step.unit ? ` ${step.unit}` : ""}
          </span>
        </div>
      </div>
    </StepFrame>
  );
}
