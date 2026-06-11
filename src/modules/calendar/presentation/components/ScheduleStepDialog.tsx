"use client";

import * as React from "react";
import { toast } from "sonner";
import type { DashPalette } from "@/shared/presentation/palette";
import { clientContainer } from "@/shared/composition/client-container";
import type { Goal } from "@/modules/goals";
import type { Step, CreateStepFormValues } from "@/modules/steps";
import { StepFormDialog } from "@/modules/steps";
import { useOverlayDismiss } from "@/shared/presentation/hooks/use-overlay-dismiss";

export interface ScheduleStepActions {
  scheduleNew: (
    goalInstanceId: string,
    values: CreateStepFormValues,
    scheduledDateISO: string,
    order: number,
  ) => Promise<{ ok: boolean; step?: Step; message?: string }>;
  assignDate: (
    stepId: string,
    scheduledDateISO: string,
  ) => Promise<{ ok: boolean; step?: Step; message?: string }>;
  listSteps: (
    goalInstanceId: string,
  ) => Promise<{ ok: boolean; steps?: Step[]; message?: string }>;
}

interface ScheduleStepDialogProps {
  date: Date; // day the new/assigned step will be scheduled for
  palette: DashPalette;
  actions: ScheduleStepActions;
  onClose: () => void;
  onScheduled: () => void;
}

const MONTH_NAMES_GEN = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function ScheduleStepDialog({
  date,
  palette,
  actions,
  onClose,
  onScheduled,
}: ScheduleStepDialogProps) {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [loadingGoals, setLoadingGoals] = React.useState(true);
  const [selectedGoalId, setSelectedGoalId] = React.useState<string>("");
  const [steps, setSteps] = React.useState<Step[]>([]);
  const [loadingSteps, setLoadingSteps] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [assigningId, setAssigningId] = React.useState<string | null>(null);

  // Local midnight → ISO, matching how steps are scheduled elsewhere
  // (see resolveCycleDayToDate in modules/steps/presentation/cycle-day.ts).
  const scheduledDateISO = React.useMemo(() => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, [date]);

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) ?? null;
  const instanceId = selectedGoal?.activeInstance?.id ?? null;
  const undatedSteps = steps.filter((s) => !s.scheduledDate);

  // Load goals on mount (only those with an active instance can receive steps).
  React.useEffect(() => {
    let alive = true;
    clientContainer()
      .goals.list.execute()
      .then((list) => {
        if (alive) setGoals(list.filter((g) => g.activeInstance));
      })
      .catch(() => {
        if (alive) toast.error("No se pudieron cargar las metas");
      })
      .finally(() => {
        if (alive) setLoadingGoals(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const handleSelectGoal = async (goalId: string) => {
    setSelectedGoalId(goalId);
    setSteps([]);
    const goal = goals.find((g) => g.id === goalId);
    const inst = goal?.activeInstance?.id;
    if (!inst) return;
    setLoadingSteps(true);
    const res = await actions.listSteps(inst);
    setLoadingSteps(false);
    setSteps(res.ok && res.steps ? res.steps : []);
  };

  const handleAssign = async (step: Step) => {
    if (assigningId) return;
    setAssigningId(step.id);
    const res = await actions.assignDate(step.id, scheduledDateISO);
    setAssigningId(null);
    if (res.ok) {
      toast.success(`"${step.title}" agendado`);
      onScheduled();
      onClose();
    } else {
      toast.error(res.message ?? "No se pudo agendar el paso");
    }
  };

  const handleCreate = async (values: CreateStepFormValues) => {
    if (!instanceId) {
      return { ok: false, message: "Selecciona una meta primero" };
    }
    setSubmitting(true);
    const res = await actions.scheduleNew(
      instanceId,
      values,
      scheduledDateISO,
      steps.length,
    );
    setSubmitting(false);
    if (res.ok) {
      toast.success("Paso creado y agendado");
      setShowCreate(false);
      onScheduled();
      onClose();
    }
    return res;
  };

  const { overlayProps } = useOverlayDismiss(onClose);

  const labelStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10,
    color: palette.inkDim,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 6,
  };
  const selectStyle: React.CSSProperties = {
    width: "100%",
    height: 38,
    padding: "0 10px",
    border: `1.5px solid ${palette.line}`,
    background: palette.surface,
    color: palette.ink,
    fontFamily: '"Space Grotesk", system-ui, sans-serif',
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.45)",
        }}
        {...overlayProps}
      >
        <div
          style={{
            background: palette.bg,
            border: `1.5px solid ${palette.line}`,
            width: "100%",
            maxWidth: 460,
            maxHeight: "90dvh",
            display: "flex",
            flexDirection: "column",
            boxShadow: `6px 6px 0 0 ${palette.primary}`,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 22px",
              borderBottom: `1.5px solid ${palette.line}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: palette.inkDim,
                  marginBottom: 4,
                }}
              >
                agendar
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
                {date.getDate()} de {MONTH_NAMES_GEN[date.getMonth()]}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: palette.inkDim,
                fontSize: 20,
                lineHeight: 1,
                padding: 4,
              }}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div style={{ overflowY: "auto", flex: 1, padding: "20px 22px" }}>
            {/* Goal selector */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>meta</label>
              <select
                value={selectedGoalId}
                onChange={(e) => handleSelectGoal(e.target.value)}
                disabled={loadingGoals}
                style={selectStyle}
              >
                <option value="">
                  {loadingGoals ? "Cargando metas…" : "Selecciona una meta"}
                </option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {!loadingGoals && goals.length === 0 && (
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    color: palette.inkDim,
                  }}
                >
                  No hay metas activas. Crea una meta primero.
                </div>
              )}
            </div>

            {selectedGoal && (
              <>
                {/* Schedule an existing undated step */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>agendar un paso existente</label>
                  {loadingSteps ? (
                    <div
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 11,
                        color: palette.inkDim,
                        padding: "8px 0",
                      }}
                    >
                      cargando pasos…
                    </div>
                  ) : undatedSteps.length === 0 ? (
                    <div
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 11,
                        color: palette.inkDim,
                        padding: "8px 0",
                      }}
                    >
                      no hay pasos sin fecha en esta meta
                    </div>
                  ) : (
                    <div
                      style={{ display: "flex", flexDirection: "column", gap: 6 }}
                    >
                      {undatedSteps.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleAssign(s)}
                          disabled={assigningId !== null}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                            padding: "9px 12px",
                            border: `1.5px solid ${palette.lineSoft}`,
                            background: "transparent",
                            color: palette.ink,
                            cursor: assigningId ? "default" : "pointer",
                            opacity:
                              assigningId && assigningId !== s.id ? 0.5 : 1,
                            textAlign: "left",
                            fontFamily: '"Space Grotesk", system-ui, sans-serif',
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.title}
                          </span>
                          <span
                            style={{
                              flexShrink: 0,
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: 10,
                              color: palette.primary,
                              letterSpacing: "0.04em",
                            }}
                          >
                            {assigningId === s.id ? "…" : "agendar →"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Create a brand-new step */}
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1.5px dashed ${palette.line}`,
                    background: "transparent",
                    color: palette.ink,
                    cursor: "pointer",
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  + Crear un paso nuevo
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nested step creation form (renders above this dialog, zIndex 100). */}
      {selectedGoal && (
        <StepFormDialog
          open={showCreate}
          palette={palette}
          accentColor={palette.primary}
          loading={submitting}
          goalType={selectedGoal.type}
          cyclePeriod={selectedGoal.cyclePeriod ?? undefined}
          customCycleDays={selectedGoal.customCycleDays}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}
    </>
  );
}
