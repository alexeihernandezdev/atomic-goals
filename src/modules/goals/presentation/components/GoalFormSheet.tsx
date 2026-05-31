"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Goal, CategoryOption } from "@/modules/goals/domain/entities/goal";
import { goalFormSchema, type GoalFormValues, CYCLE_PERIODS } from "../schemas/goal.schema";
import type { DashPalette } from "@/shared/presentation/palette";

interface GoalFormSheetProps {
  palette: DashPalette;
  categories: CategoryOption[];
  goal?: Goal | null;
  open: boolean;
  onClose: () => void;
  action: (values: GoalFormValues) => Promise<{ ok: boolean; message?: string }>;
}

const INPUT_STYLE = (palette: DashPalette): React.CSSProperties => ({
  width: "100%",
  padding: "9px 12px",
  border: `1.5px solid ${palette.line}`,
  background: palette.bg,
  color: palette.ink,
  fontFamily: '"Space Grotesk", system-ui, sans-serif',
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
});

const SELECT_STYLE = (palette: DashPalette): React.CSSProperties => ({
  ...INPUT_STYLE(palette),
  appearance: "none",
  cursor: "pointer",
});

export function GoalFormSheet({
  palette,
  categories,
  goal,
  open,
  onClose,
  action,
}: GoalFormSheetProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<GoalFormValues, any, GoalFormValues>({
    resolver: zodResolver(goalFormSchema) as never,
    defaultValues: {
      name: goal?.name ?? "",
      description: goal?.description ?? "",
      categoryId: goal?.categoryId ?? "",
      type: goal?.type ?? "CONCLUSIVE",
      cyclePeriod: goal?.cyclePeriod ?? undefined,
      startDate: goal?.startDate
        ? goal.startDate.substring(0, 10)
        : "",
      endDate: goal?.endDate ? goal.endDate.substring(0, 10) : "",
      estimatedDurationMinutes: goal?.estimatedDurationMinutes ?? undefined,
    },
  });

  const watchType = watch("type");
  const watchCyclePeriod = watch("cyclePeriod");

  React.useEffect(() => {
    if (open) {
      reset({
        name: goal?.name ?? "",
        description: goal?.description ?? "",
        categoryId: goal?.categoryId ?? "",
        type: goal?.type ?? "CONCLUSIVE",
        cyclePeriod: goal?.cyclePeriod ?? undefined,
        startDate: goal?.startDate ? goal.startDate.substring(0, 10) : "",
        endDate: goal?.endDate ? goal.endDate.substring(0, 10) : "",
        estimatedDurationMinutes: goal?.estimatedDurationMinutes ?? undefined,
      });
    }
  }, [open, goal, reset]);

  const onSubmit = async (values: GoalFormValues) => {
    const result = await action(values);
    if (result.ok) {
      onClose();
    } else if (result.message) {
      setError("root", { message: result.message });
    }
  };

  if (!open) return null;

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 40,
        }}
      />

      {/* sheet */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(480px, 100vw)",
          background: palette.bg,
          borderLeft: `1.5px solid ${palette.line}`,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div
          style={{
            padding: "20px 24px",
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
              {goal ? "editar meta" : "nueva meta"}
            </div>
            <div
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: palette.ink,
              }}
            >
              {goal ? goal.name : "Crea tu meta"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1.5px solid ${palette.line}`,
              color: palette.ink,
              cursor: "pointer",
              width: 36,
              height: 36,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            ×
          </button>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {errors.root && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(255,61,110,0.08)",
                border: `1.5px solid #FF3D6E`,
                color: "#FF3D6E",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
              }}
            >
              {errors.root.message}
            </div>
          )}

          {/* name */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: palette.inkDim,
                marginBottom: 6,
              }}
            >
              nombre *
            </label>
            <input
              {...register("name")}
              placeholder="Correr 5km sin parar"
              style={INPUT_STYLE(palette)}
            />
            {errors.name && (
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#FF3D6E",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                }}
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* description */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: palette.inkDim,
                marginBottom: 6,
              }}
            >
              descripción
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Descripción opcional..."
              style={{
                ...INPUT_STYLE(palette),
                resize: "vertical",
                minHeight: 72,
              }}
            />
          </div>

          {/* category */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: palette.inkDim,
                marginBottom: 6,
              }}
            >
              categoría *
            </label>
            <select {...register("categoryId")} style={SELECT_STYLE(palette)}>
              <option value="">Seleccionar...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#FF3D6E",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                }}
              >
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* type */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: palette.inkDim,
                marginBottom: 10,
              }}
            >
              tipo *
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {(["CONCLUSIVE", "CYCLIC"] as const).map((t) => {
                const active = watchType === t;
                return (
                  <label
                    key={t}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 14px",
                      border: `1.5px solid ${active ? palette.line : palette.lineSoft}`,
                      background: active ? palette.line : "transparent",
                      color: active ? palette.bg : palette.ink,
                      cursor: "pointer",
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    <input
                      {...register("type")}
                      type="radio"
                      value={t}
                      style={{ display: "none" }}
                    />
                    {t === "CONCLUSIVE" ? "Conclusiva" : "Cíclica"}
                  </label>
                );
              })}
            </div>
          </div>

          {/* cyclePeriod — only for CYCLIC */}
          {watchType === "CYCLIC" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: palette.inkDim,
                  marginBottom: 6,
                }}
              >
                período *
              </label>
              <select
                {...register("cyclePeriod")}
                style={SELECT_STYLE(palette)}
              >
                <option value="">Seleccionar período...</option>
                {CYCLE_PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              {errors.cyclePeriod && (
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#FF3D6E",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                  }}
                >
                  {errors.cyclePeriod.message}
                </p>
              )}
            </div>
          )}

          {/* customCycleDays — only for CUSTOM_DAYS */}
          {watchType === "CYCLIC" && watchCyclePeriod === "CUSTOM_DAYS" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: palette.inkDim,
                  marginBottom: 6,
                }}
              >
                días del ciclo *
              </label>
              <input
                {...register("customCycleDays", { valueAsNumber: true })}
                type="number"
                min={1}
                placeholder="ej: 14"
                style={INPUT_STYLE(palette)}
              />
              {errors.customCycleDays && (
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#FF3D6E",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                  }}
                >
                  {errors.customCycleDays.message}
                </p>
              )}
            </div>
          )}

          {/* dates — only for conclusive goals */}
          {watchType !== "CYCLIC" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: palette.inkDim,
                    marginBottom: 6,
                  }}
                >
                  inicio
                </label>
                <input
                  {...register("startDate")}
                  type="date"
                  style={INPUT_STYLE(palette)}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: palette.inkDim,
                    marginBottom: 6,
                  }}
                >
                  fin
                </label>
                <input
                  {...register("endDate")}
                  type="date"
                  style={INPUT_STYLE(palette)}
                />
              </div>
            </div>
          )}

          {/* estimatedDuration */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: palette.inkDim,
                marginBottom: 6,
              }}
            >
              dedicación estimada (minutos/día)
            </label>
            <input
              {...register("estimatedDurationMinutes", { valueAsNumber: true })}
              type="number"
              min={1}
              placeholder="ej: 30"
              style={INPUT_STYLE(palette)}
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: 8,
              padding: "14px 20px",
              background: isSubmitting ? palette.lineSoft : palette.line,
              color: palette.bg,
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.005em",
              transition: "background .15s",
            }}
          >
            {isSubmitting
              ? "Guardando..."
              : goal
                ? "Guardar cambios →"
                : "Crear meta →"}
          </button>
        </form>
      </div>
    </>
  );
}
