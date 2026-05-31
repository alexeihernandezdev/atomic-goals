"use client";

import * as React from "react";
import type { Step } from "@/modules/steps/domain/entities/step";

interface StepActions {
  updateProgressAction: (
    stepId: string,
    payload: { current?: number; done?: boolean; currentStatusId?: string },
  ) => Promise<{ ok: boolean; message?: string }>;
  reorderAction: (
    stepId: string,
    newOrder: number,
  ) => Promise<{ ok: boolean; message?: string }>;
  deleteAction: (stepId: string) => Promise<{ ok: boolean; message?: string }>;
  onStepsChange?: (steps: Step[]) => void;
}

export function useSteps(initialSteps: Step[], actions: StepActions) {
  const [steps, setSteps] = React.useState<Step[]>(initialSteps);
  const [pending, setPending] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);

  const markPending = (id: string) =>
    setPending((prev) => new Set(prev).add(id));
  const clearPending = (id: string) =>
    setPending((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const applySteps = (next: Step[]) => {
    setSteps(next);
    actions.onStepsChange?.(next);
  };

  const updateProgress = async (
    stepId: string,
    payload: { current?: number; done?: boolean; currentStatusId?: string },
  ) => {
    let nextSteps: Step[] = [];
    setSteps((prev) => {
      nextSteps = prev.map((s) => {
        if (s.id !== stepId) return s;
        if (s.type === "PROGRESS_BAR" && payload.current !== undefined)
          return { ...s, current: payload.current };
        if (s.type === "CHECK" && payload.done !== undefined)
          return { ...s, done: payload.done };
        if (s.type === "STATUS" && payload.currentStatusId !== undefined)
          return { ...s, currentStatusId: payload.currentStatusId };
        if (s.type === "COUNTER" && payload.current !== undefined)
          return { ...s, current: payload.current };
        return s;
      });
      return nextSteps;
    });
    actions.onStepsChange?.(nextSteps);

    markPending(stepId);
    const result = await actions.updateProgressAction(stepId, payload);
    clearPending(stepId);

    if (!result.ok) {
      applySteps(initialSteps);
    }
  };

  const reorder = async (activeId: string, overId: string) => {
    const activeIdx = steps.findIndex((s) => s.id === activeId);
    const overIdx = steps.findIndex((s) => s.id === overId);
    if (activeIdx === -1 || overIdx === -1 || activeIdx === overIdx) return;

    const next = [...steps];
    const [moved] = next.splice(activeIdx, 1);
    next.splice(overIdx, 0, moved);
    const reordered = next.map((s, i) => ({ ...s, order: i }));
    setSteps(reordered);

    await actions.reorderAction(activeId, overIdx);
  };

  const deleteStep = async (stepId: string) => {
    const previous = steps;
    const next = steps.filter((s) => s.id !== stepId);
    applySteps(next);
    const result = await actions.deleteAction(stepId);
    if (!result.ok) applySteps(previous);
  };

  return {
    steps,
    setSteps,
    pending,
    updateProgress,
    reorder,
    deleteStep,
  };
}
