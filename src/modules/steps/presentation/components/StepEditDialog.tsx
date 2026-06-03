"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Step } from "@/modules/steps/domain/entities/step";
import type { DashPalette } from "@/shared/presentation/palette";
import type { CyclePeriod } from "@/modules/goals/domain/enums/cycle-period";
import { useOverlayDismiss } from "@/shared/presentation/hooks/use-overlay-dismiss";

const nanToUndefined = (v: unknown) =>
  typeof v === "number" && isNaN(v) ? undefined : v;

const editSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200),
  weight: z.number().min(0.1).max(100),
  cycleDay: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedDurationMinutes: z.preprocess(
    nanToUndefined,
    z.number().int().min(1).optional(),
  ),
  // propagate this edit to every step in the recurring group
  applyToGroup: z.boolean().optional(),
});

export type StepEditFormValues = z.infer<typeof editSchema>;

const WEEK_DAYS = [
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
  { value: "7", label: "Domingo" },
];

interface StepEditDialogProps {
  step: Step;
  open: boolean;
  palette: DashPalette;
  accentColor: string;
  loading: boolean;
  goalType?: "CONCLUSIVE" | "CYCLIC";
  cyclePeriod?: CyclePeriod;
  customCycleDays?: number | null;
  onClose: () => void;
  onSubmit: (values: StepEditFormValues) => Promise<{ ok: boolean; message?: string }>;
}

export function StepEditDialog({
  step,
  open,
  palette,
  accentColor,
  loading,
  goalType,
  cyclePeriod,
  customCycleDays,
  onClose,
  onSubmit,
}: StepEditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StepEditFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editSchema) as any,
    defaultValues: {
      title: step.title,
      weight: step.weight,
      cycleDay: step.cycleDay ?? undefined,
      startDate: step.startDate ? step.startDate.substring(0, 10) : undefined,
      endDate: step.endDate ? step.endDate.substring(0, 10) : undefined,
      estimatedDurationMinutes: step.estimatedDurationMinutes ?? undefined,
      applyToGroup: false,
    },
  });

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      reset({
        title: step.title,
        weight: step.weight,
        cycleDay: step.cycleDay ?? undefined,
        startDate: step.startDate ? step.startDate.substring(0, 10) : undefined,
        endDate: step.endDate ? step.endDate.substring(0, 10) : undefined,
        estimatedDurationMinutes: step.estimatedDurationMinutes ?? undefined,
        applyToGroup: false,
      });
      setError(null);
    }
  }, [open, step, reset]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const { overlayProps } = useOverlayDismiss(handleClose);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doSubmit = async (values: any) => {
    setError(null);
    const result = await onSubmit(values);
    if (!result.ok) setError(result.message ?? "Error al guardar");
  };

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 36,
    padding: "0 10px",
    border: `1.5px solid ${palette.line}`,
    background: palette.surface,
    color: palette.ink,
    fontFamily: '"Space Grotesk", system-ui, sans-serif',
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10,
    color: palette.inkDim,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 6,
  };

  const fieldStyle: React.CSSProperties = { marginBottom: 16 };

  const errorStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10,
    color: palette.magenta,
    marginTop: 4,
  };

  const isCyclic = goalType === "CYCLIC";
  const showCycleDay = isCyclic && cyclePeriod && cyclePeriod !== "DAILY";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
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
          boxShadow: `6px 6px 0 0 ${accentColor}`,
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
              editar paso
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
              {step.title}
            </div>
          </div>
          <button
            onClick={handleClose}
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
          <form id="step-edit-form" onSubmit={handleSubmit(doSubmit)}>
            {/* Title */}
            <div style={fieldStyle}>
              <label style={labelStyle}>título</label>
              <input {...register("title")} style={inputStyle} />
              {errors.title && (
                <div style={errorStyle}>{errors.title.message}</div>
              )}
            </div>

            {/* Weight + Duration */}
            <div style={{ ...fieldStyle, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>peso</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  {...register("weight", { valueAsNumber: true })}
                  style={inputStyle}
                />
                {errors.weight && (
                  <div style={errorStyle}>{errors.weight.message}</div>
                )}
              </div>
              <div>
                <label style={labelStyle}>duración (min)</label>
                <input
                  type="number"
                  min="1"
                  {...register("estimatedDurationMinutes", { valueAsNumber: true })}
                  placeholder="opcional"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Cyclic: day-within-cycle */}
            {showCycleDay && (
              <div style={fieldStyle}>
                {cyclePeriod === "WEEKLY" && (
                  <>
                    <label style={labelStyle}>día de la semana</label>
                    <select {...register("cycleDay")} style={inputStyle as React.CSSProperties}>
                      <option value="">Sin día específico</option>
                      {WEEK_DAYS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </>
                )}
                {cyclePeriod === "MONTHLY" && (
                  <>
                    <label style={labelStyle}>día del mes</label>
                    <input type="number" min={1} max={31} placeholder="ej. 15" {...register("cycleDay")} style={inputStyle} />
                  </>
                )}
                {cyclePeriod === "YEARLY" && (
                  <>
                    <label style={labelStyle}>fecha anual (mes y día)</label>
                    <input type="date" {...register("cycleDay")} style={inputStyle} />
                  </>
                )}
                {cyclePeriod === "CUSTOM_DAYS" && (
                  <>
                    <label style={labelStyle}>
                      día del ciclo{customCycleDays ? ` (1–${customCycleDays})` : ""}
                    </label>
                    <input type="number" min={1} max={customCycleDays ?? undefined} placeholder="ej. 1" {...register("cycleDay")} style={inputStyle} />
                  </>
                )}
              </div>
            )}

            {/* Conclusive: start/end dates */}
            {!isCyclic && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>fecha inicio</label>
                  <input type="date" {...register("startDate")} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>fecha fin</label>
                  <input type="date" {...register("endDate")} style={inputStyle} />
                </div>
              </div>
            )}

            {step.cycleGroupId && (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  {...register("applyToGroup")}
                  style={{ accentColor }}
                />
                <span
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 13,
                    fontWeight: 600,
                    color: palette.ink,
                  }}
                >
                  Aplicar a todos los días del grupo
                </span>
              </label>
            )}

            {error && (
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 14px",
                  background: `${palette.magenta}18`,
                  border: `1.5px solid ${palette.magenta}`,
                  color: palette.magenta,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  letterSpacing: "0.04em",
                }}
              >
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 22px",
            borderTop: `1.5px solid ${palette.line}`,
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: "9px 18px",
              border: `1.5px solid ${palette.line}`,
              background: "transparent",
              color: palette.ink,
              cursor: "pointer",
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="step-edit-form"
            disabled={loading}
            style={{
              padding: "9px 20px",
              border: `1.5px solid ${palette.line}`,
              background: loading ? palette.lineSofter : palette.line,
              color: palette.bg,
              cursor: loading ? "default" : "pointer",
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Guardando…" : "Guardar cambios →"}
          </button>
        </div>
      </div>
    </div>
  );
}
