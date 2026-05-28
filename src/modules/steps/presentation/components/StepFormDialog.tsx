"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DashPalette } from "@/shared/presentation/palette";
import {
  createStepSchema,
  type CreateStepFormValues,
} from "../schemas/step.schema";
import type { StepType } from "@/modules/steps/domain/entities/step";

interface StepFormDialogProps {
  open: boolean;
  palette: DashPalette;
  accentColor: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: CreateStepFormValues) => Promise<{ ok: boolean; message?: string }>;
}

const STEP_TYPES: { value: StepType; label: string; desc: string }[] = [
  { value: "PROGRESS_BAR", label: "Barra de progreso", desc: "Numérico: alcanza un objetivo" },
  { value: "CHECK", label: "Check", desc: "Hecho o no hecho" },
  { value: "STATUS", label: "Estados", desc: "Múltiples niveles personalizados" },
  { value: "COUNTER", label: "Contador", desc: "Suma o resta unidades" },
];

export function StepFormDialog({
  open,
  palette,
  accentColor,
  loading,
  onClose,
  onSubmit,
}: StepFormDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateStepFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createStepSchema) as any,
    defaultValues: {
      type: "PROGRESS_BAR",
      weight: 1,
      min: 0,
      statuses: [
        { label: "pendiente", percentage: 0, order: 0 },
        { label: "en curso", percentage: 50, order: 1 },
        { label: "listo", percentage: 100, order: 2 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "statuses",
  });

  const type = watch("type");
  const [error, setError] = React.useState<string | null>(null);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doSubmit = async (values: any) => {
    setError(null);
    const result = await onSubmit(values);
    if (!result.ok) setError(result.message ?? "Error al crear el paso");
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
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        style={{
          background: palette.bg,
          border: `1.5px solid ${palette.line}`,
          width: "100%",
          maxWidth: 520,
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
          <div
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: palette.ink,
            }}
          >
            Nuevo paso
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
          <form id="step-form" onSubmit={handleSubmit(doSubmit)}>
            {/* Type selector */}
            <div style={fieldStyle}>
              <label style={labelStyle}>tipo de paso</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {STEP_TYPES.map((t) => {
                  const active = type === t.value;
                  return (
                    <label
                      key={t.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        border: `1.5px solid ${active ? palette.line : palette.lineSoft}`,
                        background: active ? palette.lineSofter : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        value={t.value}
                        {...register("type")}
                        style={{ accentColor }}
                      />
                      <div>
                        <div
                          style={{
                            fontFamily: '"Space Grotesk", system-ui, sans-serif',
                            fontSize: 14,
                            fontWeight: 700,
                            color: palette.ink,
                          }}
                        >
                          {t.label}
                        </div>
                        <div
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: 10,
                            color: palette.inkDim,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {t.desc}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div style={fieldStyle}>
              <label style={labelStyle}>título</label>
              <input
                {...register("title")}
                placeholder="ej. Correr 3 km"
                style={inputStyle}
              />
              {errors.title && (
                <div style={errorStyle}>{errors.title.message}</div>
              )}
            </div>

            {/* Weight */}
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

            {/* PROGRESS_BAR fields */}
            {type === "PROGRESS_BAR" && (
              <div style={{ ...fieldStyle, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>objetivo (target)</label>
                  <input
                    type="number"
                    min="1"
                    {...register("target", { valueAsNumber: true })}
                    placeholder="ej. 100"
                    style={inputStyle}
                  />
                  {errors.target && (
                    <div style={errorStyle}>{errors.target.message}</div>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>unidad</label>
                  <input
                    {...register("unit")}
                    placeholder="ej. km, páginas"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* COUNTER fields */}
            {type === "COUNTER" && (
              <div style={{ ...fieldStyle, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>mínimo</label>
                  <input
                    type="number"
                    min="0"
                    {...register("min", { valueAsNumber: true })}
                    defaultValue={0}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>máximo</label>
                  <input
                    type="number"
                    min="1"
                    {...register("max", { valueAsNumber: true })}
                    placeholder="ej. 10"
                    style={inputStyle}
                  />
                  {errors.max && (
                    <div style={errorStyle}>{errors.max.message}</div>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>unidad</label>
                  <input
                    {...register("unit")}
                    placeholder="ej. ses"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* STATUS fields */}
            {type === "STATUS" && (
              <div style={fieldStyle}>
                <label style={labelStyle}>estados</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {fields.map((field, idx) => (
                    <div key={field.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 32px", gap: 8 }}>
                      <input
                        {...register(`statuses.${idx}.label`)}
                        placeholder={`Estado ${idx + 1}`}
                        style={inputStyle}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        {...register(`statuses.${idx}.percentage`, { valueAsNumber: true })}
                        placeholder="%"
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        disabled={fields.length <= 2}
                        style={{
                          border: `1.5px solid ${palette.lineSoft}`,
                          background: "transparent",
                          color: palette.inkDim,
                          cursor: fields.length > 2 ? "pointer" : "default",
                          opacity: fields.length <= 2 ? 0.4 : 1,
                          fontSize: 14,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      append({ label: "", percentage: 0, order: fields.length })
                    }
                    style={{
                      padding: "6px 12px",
                      border: `1.5px dashed ${palette.lineSoft}`,
                      background: "transparent",
                      color: palette.inkDim,
                      cursor: "pointer",
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    + Añadir estado
                  </button>
                </div>
                {errors.statuses && (
                  <div style={errorStyle}>Se necesitan al menos 2 estados</div>
                )}
              </div>
            )}

            {/* Dates */}
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
            form="step-form"
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
              letterSpacing: "-0.005em",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Creando…" : "Crear paso →"}
          </button>
        </div>
      </div>
    </div>
  );
}
