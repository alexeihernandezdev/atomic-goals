"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Step } from "@/modules/steps/domain/entities/step";
import type { DashPalette } from "@/shared/presentation/palette";
import { useSteps } from "../hooks/use-steps";
import { ProgressBarStep } from "./subtypes/ProgressBarStep";
import { CheckStep } from "./subtypes/CheckStep";
import { StatusStep } from "./subtypes/StatusStep";
import { CounterStep } from "./subtypes/CounterStep";
import { StepFormDialog } from "./StepFormDialog";
import type { CreateStepFormValues } from "../schemas/step.schema";

interface StepListProps {
  initialSteps: Step[];
  goalInstanceId: string;
  accentColor: string;
  palette: DashPalette;
  createAction: (
    goalInstanceId: string,
    values: CreateStepFormValues,
    order: number,
  ) => Promise<{ ok: boolean; step?: Step; message?: string }>;
  updateProgressAction: (
    stepId: string,
    payload: { current?: number; done?: boolean; currentStatusId?: string },
  ) => Promise<{ ok: boolean; message?: string }>;
  reorderAction: (
    stepId: string,
    newOrder: number,
  ) => Promise<{ ok: boolean; message?: string }>;
  deleteAction: (stepId: string) => Promise<{ ok: boolean; message?: string }>;
}

interface SortableStepProps {
  step: Step;
  palette: DashPalette;
  accentColor: string;
  onProgressChange: (
    stepId: string,
    payload: { current?: number; done?: boolean; currentStatusId?: string },
  ) => void;
  onDelete: (stepId: string) => void;
}

function SortableStep({
  step,
  palette,
  accentColor,
  onProgressChange,
  onDelete,
}: SortableStepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 10 : undefined,
  };

  const dragHandleProps = { ...attributes, ...listeners };

  const commonProps = {
    palette,
    accentColor,
    dragHandleProps,
    onMoreClick: () => onDelete(step.id),
  };

  const renderStep = () => {
    switch (step.type) {
      case "PROGRESS_BAR":
        return (
          <ProgressBarStep
            step={step}
            {...commonProps}
            onProgressChange={(current) =>
              onProgressChange(step.id, { current })
            }
          />
        );
      case "CHECK":
        return (
          <CheckStep
            step={step}
            {...commonProps}
            onProgressChange={(done) => onProgressChange(step.id, { done })}
          />
        );
      case "STATUS":
        return (
          <StatusStep
            step={step}
            {...commonProps}
            onProgressChange={(currentStatusId) =>
              onProgressChange(step.id, { currentStatusId })
            }
          />
        );
      case "COUNTER":
        return (
          <CounterStep
            step={step}
            {...commonProps}
            onProgressChange={(current) =>
              onProgressChange(step.id, { current })
            }
          />
        );
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderStep()}
    </div>
  );
}

export function StepList({
  initialSteps,
  goalInstanceId,
  accentColor,
  palette,
  createAction,
  updateProgressAction,
  reorderAction,
  deleteAction,
}: StepListProps) {
  const { steps, setSteps, updateProgress, reorder, deleteStep } = useSteps(
    initialSteps,
    { updateProgressAction, reorderAction, deleteAction },
  );

  const [addOpen, setAddOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder(String(active.id), String(over.id));
    }
  };

  const handleCreate = async (values: CreateStepFormValues) => {
    setCreating(true);
    const result = await createAction(goalInstanceId, values, steps.length);
    setCreating(false);
    if (result.ok && result.step) {
      setSteps((prev) => [...prev, result.step!]);
      setAddOpen(false);
    }
    return result;
  };

  const STEP_TYPE_LEGEND = [
    { label: "barra", desc: "numérico → meta", color: palette.primary },
    { label: "check", desc: "hecho o no", color: palette.lime },
    { label: "estados", desc: "múltiples niveles", color: palette.magenta },
    { label: "contador", desc: "sumar / restar", color: palette.yellow },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: palette.inkDim,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            pasos · arrástralos para reordenar
          </div>
          <div
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: palette.ink,
            }}
          >
            {steps.length} paso{steps.length !== 1 ? "s" : ""}, todos editables
          </div>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          style={{
            background: palette.line,
            color: palette.bg,
            border: "none",
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            boxShadow: `3px 3px 0 0 ${accentColor}`,
          }}
        >
          + Añadir paso
        </button>
      </div>

      {/* Type legend */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 14,
          flexWrap: "wrap",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {STEP_TYPE_LEGEND.map(({ label, desc, color }) => (
          <span
            key={label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 8px",
              border: `1px solid ${palette.lineSoft}`,
              color: palette.inkDim,
            }}
          >
            <span style={{ width: 8, height: 8, background: color }} />
            {label}
            <span
              style={{
                opacity: 0.6,
                textTransform: "lowercase",
                letterSpacing: "0.02em",
              }}
            >
              · {desc}
            </span>
          </span>
        ))}
      </div>

      {/* Sortable steps */}
      {steps.length === 0 ? (
        <div
          style={{
            padding: "40px 24px",
            border: `1.5px dashed ${palette.lineSoft}`,
            textAlign: "center",
            color: palette.inkDim,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            letterSpacing: "0.04em",
          }}
        >
          Aún no hay pasos.
          <br />
          <span style={{ opacity: 0.6 }}>Añade el primero con el botón de arriba.</span>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={steps.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {steps.map((step) => (
                <SortableStep
                  key={step.id}
                  step={step}
                  palette={palette}
                  accentColor={accentColor}
                  onProgressChange={(id, payload) =>
                    updateProgress(id, payload)
                  }
                  onDelete={deleteStep}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add another button */}
      <button
        onClick={() => setAddOpen(true)}
        style={{
          marginTop: steps.length > 0 ? 12 : 14,
          width: "100%",
          padding: "14px 16px",
          border: `1.5px dashed ${palette.lineSoft}`,
          background: "transparent",
          color: palette.inkDim,
          cursor: "pointer",
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>+</span> Añadir otro paso
      </button>

      {/* Dialog */}
      <StepFormDialog
        open={addOpen}
        palette={palette}
        accentColor={accentColor}
        loading={creating}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
