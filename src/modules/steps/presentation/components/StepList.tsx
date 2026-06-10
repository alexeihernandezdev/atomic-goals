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
import type { CyclePeriod } from "@/modules/goals/domain/enums/cycle-period";
import type { DashPalette } from "@/shared/presentation/palette";
import { useSteps } from "../hooks/use-steps";
import { ProgressBarStep } from "./subtypes/ProgressBarStep";
import { CheckStep } from "./subtypes/CheckStep";
import { StatusStep } from "./subtypes/StatusStep";
import { CounterStep } from "./subtypes/CounterStep";
import { StepFormDialog } from "./StepFormDialog";
import { StepEditDialog, type StepEditFormValues } from "./StepEditDialog";
import type { CreateStepFormValues } from "../schemas/step.schema";
import {
  formatScheduledDateLabel,
  titleWithDateSuffix,
  stripDaySuffix,
  resolveCycleDayToDate,
} from "../cycle-day";

// Resolution context forwarded to the create actions so a recurrence pattern
// can be turned into a concrete scheduledDate against the active cycle.
interface StepCycleContext {
  cycleStart?: string | null;
  cyclePeriod?: CyclePeriod;
  customCycleDays?: number | null;
}

// Metadata payload sent to the update action, with the recurrence pattern
// already resolved to a concrete scheduledDate.
export interface StepMetadataUpdate {
  title?: string;
  weight?: number;
  scheduledDate?: string;
  startDate?: string;
  endDate?: string;
  estimatedDurationMinutes?: number;
}

interface StepListProps {
  initialSteps: Step[];
  goalInstanceId: string;
  accentColor: string;
  palette: DashPalette;
  goalType?: "CONCLUSIVE" | "CYCLIC";
  cyclePeriod?: CyclePeriod;
  customCycleDays?: number | null;
  cycleStart?: string | null;
  createAction: (
    goalInstanceId: string,
    values: CreateStepFormValues,
    order: number,
    ctx?: StepCycleContext,
  ) => Promise<{ ok: boolean; step?: Step; message?: string }>;
  createBatchAction: (
    goalInstanceId: string,
    values: CreateStepFormValues,
    baseOrder: number,
    ctx?: StepCycleContext,
  ) => Promise<{ ok: boolean; steps?: Step[]; message?: string }>;
  updateProgressAction: (
    stepId: string,
    payload: { current?: number; done?: boolean; currentStatusId?: string },
  ) => Promise<{ ok: boolean; message?: string }>;
  reorderAction: (
    stepId: string,
    newOrder: number,
  ) => Promise<{ ok: boolean; message?: string }>;
  deleteAction: (stepId: string) => Promise<{ ok: boolean; message?: string }>;
  updateMetadataAction: (
    stepId: string,
    values: StepMetadataUpdate,
  ) => Promise<{ ok: boolean; step?: Step; message?: string }>;
  onStepsChange?: (steps: Step[]) => void;
}

interface SortableStepProps {
  step: Step;
  palette: DashPalette;
  accentColor: string;
  cycleInfo?: string | null;
  estimatedMinutes?: number | null;
  onProgressChange: (
    stepId: string,
    payload: { current?: number; done?: boolean; currentStatusId?: string },
  ) => void;
  onEdit: (step: Step) => void;
  onDelete: (stepId: string) => void;
}

function SortableStep({
  step,
  palette,
  accentColor,
  cycleInfo,
  estimatedMinutes,
  onProgressChange,
  onEdit,
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
    cycleInfo,
    estimatedMinutes,
    onEdit: () => onEdit(step),
    onDelete: () => onDelete(step.id),
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
  goalType,
  cyclePeriod,
  customCycleDays,
  cycleStart,
  createAction,
  createBatchAction,
  updateProgressAction,
  updateMetadataAction,
  reorderAction,
  deleteAction,
  onStepsChange,
}: StepListProps) {
  const { steps, setSteps, updateProgress, reorder } = useSteps(initialSteps, {
    updateProgressAction,
    reorderAction,
    deleteAction,
    onStepsChange,
  });

  const [addOpen, setAddOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [editingStep, setEditingStep] = React.useState<Step | null>(null);
  const [saving, setSaving] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder(String(active.id), String(over.id));
    }
  };

  const handleEdit = async (values: StepEditFormValues) => {
    if (!editingStep) return { ok: false };
    setSaving(true);

    const groupId = editingStep.cycleGroupId;
    // Propagate to all siblings sharing the group, re-suffixing each title with
    // its own day so "Correr (Lunes)" / "Correr (Miércoles)" stay consistent.
    if (values.applyToGroup && groupId) {
      const base = stripDaySuffix(values.title);
      const siblings = steps.filter((s) => s.cycleGroupId === groupId);
      const results = await Promise.all(
        siblings.map((s) => {
          const title = s.scheduledDate
            ? titleWithDateSuffix(base, s.scheduledDate, cyclePeriod)
            : base;
          return updateMetadataAction(s.id, {
            title,
            weight: values.weight,
            estimatedDurationMinutes: values.estimatedDurationMinutes,
            startDate: values.startDate,
            endDate: values.endDate,
            // keep each sibling's own date — don't overwrite with the edited one
            scheduledDate: s.scheduledDate ?? undefined,
          });
        }),
      );
      setSaving(false);
      const failed = results.find((r) => !r.ok);
      if (!failed) {
        const updated = new Map(
          results
            .filter((r) => r.step)
            .map((r) => [r.step!.id, r.step!] as const),
        );
        const next = steps.map((s) => updated.get(s.id) ?? s);
        setSteps(next);
        onStepsChange?.(next);
        setEditingStep(null);
      }
      return failed ?? { ok: true };
    }

    const scheduledDate = resolveCycleDayToDate(
      values.cycleDay,
      cyclePeriod,
      cycleStart,
    );
    const result = await updateMetadataAction(editingStep.id, {
      title: values.title,
      weight: values.weight,
      estimatedDurationMinutes: values.estimatedDurationMinutes,
      startDate: values.startDate,
      endDate: values.endDate,
      scheduledDate,
    });
    setSaving(false);
    if (result.ok && result.step) {
      const next = steps.map((s) =>
        s.id === result.step!.id ? result.step! : s,
      );
      setSteps(next);
      onStepsChange?.(next);
      setEditingStep(null);
    }
    return result;
  };

  const handleDelete = async (stepId: string) => {
    const target = steps.find((s) => s.id === stepId);
    if (!target) return;
    const groupId = target.cycleGroupId;
    const siblings = groupId
      ? steps.filter((s) => s.cycleGroupId === groupId)
      : [target];

    if (groupId && siblings.length > 1) {
      const ok = window.confirm(
        `Esto eliminará los ${siblings.length} pasos del grupo. ¿Continuar?`,
      );
      if (!ok) return;
    }

    const previous = steps;
    const removeIds = new Set(siblings.map((s) => s.id));
    const next = steps.filter((s) => !removeIds.has(s.id));
    setSteps(next);
    onStepsChange?.(next);

    // Backend cascades the deletion to the whole group by cycleGroupId.
    const result = await deleteAction(stepId);
    if (!result.ok) {
      setSteps(previous);
      onStepsChange?.(previous);
    }
  };

  const cycleCtx: StepCycleContext = {
    cycleStart,
    cyclePeriod,
    customCycleDays,
  };

  const handleCreate = async (values: CreateStepFormValues) => {
    setCreating(true);
    const days = values.cycleDays ?? [];

    // Multiple days → fan-out into a linked group via the batch endpoint.
    if (days.length >= 2) {
      const result = await createBatchAction(
        goalInstanceId,
        values,
        steps.length,
        cycleCtx,
      );
      setCreating(false);
      if (result.ok && result.steps) {
        const next = [...steps, ...result.steps];
        setSteps(next);
        onStepsChange?.(next);
        setAddOpen(false);
      }
      return { ok: result.ok, message: result.message };
    }

    // 0 or 1 day → a single step (fold the lone selected day into cycleDay).
    const single =
      days.length === 1 ? { ...values, cycleDay: days[0] } : values;
    const result = await createAction(
      goalInstanceId,
      single,
      steps.length,
      cycleCtx,
    );
    setCreating(false);
    if (result.ok && result.step) {
      const next = [...steps, result.step!];
      setSteps(next);
      onStepsChange?.(next);
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
          id="step-list-dnd"
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
                  cycleInfo={formatScheduledDateLabel(step.scheduledDate, cyclePeriod)}
                  estimatedMinutes={step.estimatedDurationMinutes ?? null}
                  onProgressChange={(id, payload) =>
                    updateProgress(id, payload)
                  }
                  onEdit={setEditingStep}
                  onDelete={handleDelete}
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

      {/* Create dialog */}
      <StepFormDialog
        open={addOpen}
        palette={palette}
        accentColor={accentColor}
        loading={creating}
        goalType={goalType}
        cyclePeriod={cyclePeriod}
        customCycleDays={customCycleDays}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit dialog */}
      {editingStep && (
        <StepEditDialog
          step={editingStep}
          open={!!editingStep}
          palette={palette}
          accentColor={accentColor}
          loading={saving}
          goalType={goalType}
          cyclePeriod={cyclePeriod}
          customCycleDays={customCycleDays}
          cycleStart={cycleStart}
          onClose={() => setEditingStep(null)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}
