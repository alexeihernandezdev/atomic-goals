"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";
import type { CheckStep as CheckStepData } from "@/modules/steps/domain/entities/step";
import { StepFrame } from "../StepFrame";

interface CheckStepProps {
  step: CheckStepData;
  palette: DashPalette;
  accentColor: string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onProgressChange: (done: boolean) => void;
  onMoreClick?: () => void;
}

export function CheckStep({
  step,
  palette,
  accentColor,
  dragHandleProps,
  onProgressChange,
  onMoreClick,
}: CheckStepProps) {
  const [done, setDone] = React.useState(step.done);

  React.useEffect(() => {
    setDone(step.done);
  }, [step.done]);

  const handleToggle = () => {
    const next = !done;
    setDone(next);
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
      badge="check"
      weight={step.weight}
      due={due}
      percent={done ? 100 : 0}
      dragHandleProps={dragHandleProps}
      onMoreClick={onMoreClick}
    >
      <button
        onClick={handleToggle}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: palette.ink,
          padding: 0,
        }}
      >
        <span
          style={{
            width: 30,
            height: 30,
            border: `1.5px solid ${palette.line}`,
            background: done ? accentColor : "transparent",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .15s",
            flexShrink: 0,
          }}
        >
          {done && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke={palette.bg}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3,9 7,13 15,5" />
            </svg>
          )}
        </span>
        <span
          style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.005em",
            color: done ? palette.inkDim : palette.ink,
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {done ? "¡Hecho!" : "Marcar como hecho"}
        </span>
      </button>
    </StepFrame>
  );
}
