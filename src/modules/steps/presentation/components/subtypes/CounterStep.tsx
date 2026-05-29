"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { CounterStep as CounterStepData } from "@/modules/steps/domain/entities/step";
import { ProgressCalculator } from "@/modules/steps/domain/services/progress-calculator";
import { StepFrame } from "../StepFrame";

interface CounterStepProps {
  step: CounterStepData;
  palette: DashPalette;
  accentColor: string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onProgressChange: (current: number) => void;
  onMoreClick?: () => void;
}

export function CounterStep({
  step,
  palette,
  accentColor,
  dragHandleProps,
  onProgressChange,
  onMoreClick,
}: CounterStepProps) {
  const [current, setCurrent] = React.useState(step.current);

  React.useEffect(() => {
    setCurrent(step.current);
  }, [step.current]);

  const percent = ProgressCalculator.forStep({ ...step, current });

  const adjust = (delta: number) => {
    const next = Math.min(step.max, Math.max(step.min, current + delta));
    setCurrent(next);
    onProgressChange(next);
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
      badge="contador"
      weight={step.weight}
      due={due}
      percent={percent}
      dragHandleProps={dragHandleProps}
      onMoreClick={onMoreClick}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => adjust(-1)}
          style={{
            width: 32,
            height: 32,
            border: `1.5px solid ${palette.line}`,
            background: palette.surface,
            color: palette.ink,
            cursor: "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          −
        </button>
        <div
          style={{
            minWidth: 90,
            height: 32,
            padding: "0 12px",
            border: `1.5px solid ${palette.line}`,
            background: accentColor,
            color: palette.bg,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {current}
          </span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>/ {step.max}</span>
          {step.unit && (
            <span
              style={{
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                marginLeft: 4,
                opacity: 0.8,
                letterSpacing: "0.04em",
              }}
            >
              {step.unit}
            </span>
          )}
        </div>
        <button
          onClick={() => adjust(1)}
          style={{
            width: 32,
            height: 32,
            border: `1.5px solid ${palette.line}`,
            background: palette.ink,
            color: palette.bg,
            cursor: "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          +
        </button>
      </div>
    </StepFrame>
  );
}
