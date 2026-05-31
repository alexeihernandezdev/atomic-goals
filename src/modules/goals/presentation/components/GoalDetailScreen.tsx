"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { Goal, GoalInstance } from "@/modules/goals/domain/entities/goal";
import type { CategoryOption } from "@/modules/goals/domain/entities/goal";
import type { GoalFormValues } from "../schemas/goal.schema";
import { GoalFormSheet } from "./GoalFormSheet";
import { DASH_PALETTES, type DashPalette } from "@/shared/presentation/palette";
import { StepList, ProgressCalculator } from "@/modules/steps";
import type { Step } from "@/modules/steps";
import type { CreateStepFormValues } from "@/modules/steps/presentation/schemas/step.schema";
import type { StepEditFormValues } from "@/modules/steps/presentation/components/StepEditDialog";
import { clientContainer } from "@/shared/composition/client-container";

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

interface GoalDetailScreenProps {
  goal: Goal;
  instances: GoalInstance[];
  initialSteps: Step[];
  categories: CategoryOption[];
  updateAction: (
    id: string,
    values: GoalFormValues,
  ) => Promise<{ ok: boolean; message?: string }>;
  deleteAction: (id: string) => Promise<{ ok: boolean; message?: string }>;
  createStepAction: (
    goalInstanceId: string,
    values: CreateStepFormValues,
    order: number,
  ) => Promise<{ ok: boolean; step?: Step; message?: string }>;
  updateStepMetadataAction: (
    stepId: string,
    goalId: string,
    values: StepEditFormValues,
  ) => Promise<{ ok: boolean; step?: Step; message?: string }>;
  updateStepProgressAction: (
    stepId: string,
    goalId: string,
    payload: { current?: number; done?: boolean; currentStatusId?: string },
  ) => Promise<{ ok: boolean; message?: string }>;
  reorderStepAction: (
    stepId: string,
    goalId: string,
    newOrder: number,
  ) => Promise<{ ok: boolean; message?: string }>;
  deleteStepAction: (
    stepId: string,
    goalId: string,
  ) => Promise<{ ok: boolean; message?: string }>;
}

export function GoalDetailScreen({
  goal: initialGoal,
  instances,
  initialSteps,
  categories,
  updateAction,
  deleteAction,
  createStepAction,
  updateStepMetadataAction,
  updateStepProgressAction,
  reorderStepAction,
  deleteStepAction,
}: GoalDetailScreenProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const palette: DashPalette =
    mounted && resolvedTheme === "dark"
      ? DASH_PALETTES.dark
      : DASH_PALETTES.light;

  const [goal, setGoal] = React.useState(initialGoal);
  React.useEffect(() => {
    setGoal(initialGoal);
  }, [initialGoal]);

  const [tab, setTab] = React.useState<"steps" | "history" | "settings">(
    "steps",
  );
  const [editing, setEditing] = React.useState(false);

  const instance = goal.activeInstance;
  const progress = instance?.progress ?? 0;

  const syncGoalProgressFromSteps = React.useCallback((steps: Step[]) => {
    const nextProgress = ProgressCalculator.weightedAverage(steps);
    setGoal((current) => {
      if (!current.activeInstance) return current;
      if (current.activeInstance.progress === nextProgress) return current;
      return {
        ...current,
        activeInstance: {
          ...current.activeInstance,
          progress: nextProgress,
        },
      };
    });
  }, []);
  const instanceStatus = instance?.status ?? "IN_PROGRESS";
  const isCompleted = instanceStatus === "COMPLETED";

  const handleUpdate = async (values: GoalFormValues) => {
    const result = await updateAction(goal.id, values);
    if (result.ok) {
      setEditing(false);
      try {
        const updated = await clientContainer().goals.get.execute(goal.id);
        setGoal(updated);
      } catch {
        /* keep current view on fetch failure */
      }
      router.refresh();
    }
    return result;
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta meta?")) return;
    const result = await deleteAction(goal.id);
    if (result.ok) router.push("/goals");
  };

  return (
    <div
      style={{
        padding: "24px 32px 40px",
        background: palette.bg,
        minHeight: "100%",
        color: palette.ink,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
      }}
    >
      {/* Breadcrumbs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 18,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: palette.inkDim,
          letterSpacing: "0.08em",
        }}
      >
        <Link
          href="/goals"
          style={{ color: palette.inkDim, textDecoration: "none" }}
        >
          metas
        </Link>
        <span>/</span>
        <span style={{ color: palette.ink }}>{goal.name}</span>
      </div>

      {/* Hero card */}
      <div
        style={{
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          position: "relative",
          overflow: "hidden",
          marginBottom: 20,
          boxShadow: `6px 6px 0 0 ${palette.primary}`,
        }}
      >
        {/* top color strip */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 8,
            background: palette.primary,
            borderBottom: `1.5px solid ${palette.line}`,
          }}
        />

        <div
          style={{
            padding: "32px 28px 22px",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: palette.inkDim,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  background: palette.primary,
                }}
              />
              <span>{TYPE_LABEL[goal.type] ?? goal.type}</span>
              <span>·</span>
              <span
                style={{
                  marginLeft: 4,
                  padding: "2px 8px",
                  background: isCompleted ? palette.lime : palette.lineSofter,
                  color: palette.ink,
                }}
              >
                {STATUS_LABEL[instanceStatus] ?? instanceStatus}
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.0,
                color: palette.ink,
              }}
            >
              {goal.name}
            </h1>

            {goal.description && (
              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: palette.inkDim,
                  maxWidth: 460,
                }}
              >
                {goal.description}
              </p>
            )}

            <div
              style={{
                marginTop: 22,
                display: "flex",
                gap: 22,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: palette.inkDim,
                letterSpacing: "0.06em",
              }}
            >
              <div>
                <div style={{ textTransform: "uppercase", opacity: 0.6 }}>
                  inicio
                </div>
                <div
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14,
                    fontWeight: 700,
                    color: palette.ink,
                    marginTop: 2,
                  }}
                >
                  {goal.startDate
                    ? new Date(goal.startDate).toLocaleDateString("es", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—"}
                </div>
              </div>
              <div>
                <div style={{ textTransform: "uppercase", opacity: 0.6 }}>
                  fin
                </div>
                <div
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14,
                    fontWeight: 700,
                    color: palette.ink,
                    marginTop: 2,
                  }}
                >
                  {goal.endDate
                    ? new Date(goal.endDate).toLocaleDateString("es", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—"}
                </div>
              </div>
              {goal.estimatedDurationMinutes && (
                <div>
                  <div style={{ textTransform: "uppercase", opacity: 0.6 }}>
                    dedicación
                  </div>
                  <div
                    style={{
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 14,
                      fontWeight: 700,
                      color: palette.ink,
                      marginTop: 2,
                    }}
                  >
                    {goal.estimatedDurationMinutes} min / día
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Big progress */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: palette.inkDim,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              progreso · calculado por pesos
            </div>
            <div
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 112,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 0.85,
                color: palette.ink,
              }}
            >
              {progress}
              <span style={{ fontSize: 36, color: palette.inkDim }}>%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 16,
                marginTop: 12,
                border: `1.5px solid ${palette.line}`,
                background: palette.lineSofter,
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
                  background: isCompleted ? palette.lime : palette.primary,
                  transition: "width .3s",
                }}
              />
            </div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 8,
                alignSelf: "stretch",
              }}
            >
              <button
                onClick={() => setEditing(true)}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: `1.5px solid ${palette.line}`,
                  background: palette.surface,
                  color: palette.ink,
                  cursor: "pointer",
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                }}
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: `1.5px solid ${palette.line}`,
                  background: palette.line,
                  color: palette.bg,
                  cursor: "pointer",
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: `1.5px solid ${palette.line}`,
          marginBottom: 18,
        }}
      >
        {(
          [
            ["steps", "Pasos"],
            ["history", "Histórico"],
            ["settings", "Configuración"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: "10px 18px",
              background: "transparent",
              border: "none",
              borderBottom:
                tab === k
                  ? `3px solid ${palette.primary}`
                  : "3px solid transparent",
              marginBottom: -1.5,
              cursor: "pointer",
              color: tab === k ? palette.ink : palette.inkDim,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.005em",
              transition: "color .12s, border-color .12s",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Tab: Pasos */}
      {tab === "steps" && (
        <div>
          {instance ? (
            <StepList
              initialSteps={initialSteps}
              goalInstanceId={instance.id}
              accentColor={palette.primary}
              palette={palette}
              goalType={goal.type}
              cyclePeriod={goal.cyclePeriod ?? undefined}
              customCycleDays={goal.customCycleDays ?? undefined}
              createAction={createStepAction}
              updateMetadataAction={(stepId, values) =>
                updateStepMetadataAction(stepId, goal.id, values)
              }
              updateProgressAction={(stepId, payload) =>
                updateStepProgressAction(stepId, goal.id, payload)
              }
              reorderAction={(stepId, newOrder) =>
                reorderStepAction(stepId, goal.id, newOrder)
              }
              deleteAction={(stepId) => deleteStepAction(stepId, goal.id)}
              onStepsChange={syncGoalProgressFromSteps}
            />
          ) : (
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
              Esta meta no tiene una instancia activa.
              <br />
              <span style={{ opacity: 0.6 }}>
                Los pasos se muestran por instancia.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab: Histórico */}
      {tab === "history" && (
        <div>
          {goal.type === "CYCLIC" && instances.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {instances.map((inst) => (
                <div
                  key={inst.id}
                  style={{
                    background: palette.surface,
                    border: `1.5px solid ${palette.line}`,
                    padding: "16px 20px",
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
                        color: palette.inkDim,
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {new Date(inst.cycleStart).toLocaleDateString("es", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" → "}
                      {new Date(inst.cycleEnd).toLocaleDateString("es", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Space Grotesk", system-ui, sans-serif',
                        fontSize: 15,
                        fontWeight: 700,
                        color: palette.ink,
                      }}
                    >
                      {STATUS_LABEL[inst.status] ?? inst.status}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 32,
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      color: palette.ink,
                    }}
                  >
                    {inst.progress}
                    <span style={{ fontSize: 14, color: palette.inkDim }}>
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                background: palette.surface,
                border: `1.5px solid ${palette.line}`,
                color: palette.inkDim,
              }}
            >
              <div
                style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: palette.ink,
                }}
              >
                Histórico de instancias
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  letterSpacing: "0.04em",
                }}
              >
                {goal.type === "CONCLUSIVE"
                  ? "aplica solo a metas cíclicas · esta es conclusiva"
                  : "aún no hay instancias anteriores"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Configuración */}
      {tab === "settings" && (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            background: palette.surface,
            border: `1.5px solid ${palette.line}`,
            color: palette.inkDim,
          }}
        >
          <div
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 6,
              color: palette.ink,
            }}
          >
            Configuración de la meta
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.04em",
            }}
          >
            nombre, categoría, fechas, archivar...
          </div>
          <button
            onClick={() => setEditing(true)}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: palette.line,
              color: palette.bg,
              border: "none",
              cursor: "pointer",
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Editar meta →
          </button>
        </div>
      )}

      {/* Edit form sheet */}
      <GoalFormSheet
        palette={palette}
        categories={categories}
        goal={goal}
        open={editing}
        onClose={() => setEditing(false)}
        action={handleUpdate}
      />
    </div>
  );
}
