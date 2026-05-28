"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  CATEGORY_PRESET_COLORS,
  CATEGORY_ICONS,
  type CategoryFormValues,
} from "../schemas/category.schema";
import type { Category } from "@/modules/categories/domain/entities/category";
import { CatIcon } from "./CatIcon";
import type { DashPalette } from "@/shared/presentation/palette";

interface CategoryFormSheetProps {
  palette: DashPalette;
  initial?: Category;
  onClose: () => void;
  action: (values: CategoryFormValues) => Promise<{ ok: boolean; message?: string }>;
}

export function CategoryFormSheet({
  palette,
  initial,
  onClose,
  action,
}: CategoryFormSheetProps) {
  const isEdit = !!initial;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      color: initial?.color ?? "#7C5CFF",
      icon: initial?.icon ?? "heart",
    },
  });

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const nameVal = watch("name");
  const descVal = watch("description");
  const colorVal = watch("color");
  const iconVal = watch("icon");

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    const result = await action(data);
    if (!result.ok) {
      setSubmitError(result.message ?? "Error al guardar.");
      return;
    }
    onClose();
  });

  return (
    <div
      style={{
        width: 380,
        height: "100%",
        background: palette.surface,
        borderLeft: `1.5px solid ${palette.line}`,
        display: "flex",
        flexDirection: "column",
        boxShadow: `-6px 0 0 0 ${colorVal}`,
        transition: "box-shadow .2s",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 22px 14px",
          borderBottom: `1.5px solid ${palette.line}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: palette.inkDim,
              marginBottom: 4,
            }}
          >
            {isEdit ? "editar" : "nueva"}
          </div>
          <div
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: palette.ink,
            }}
          >
            Categoría
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            border: `1.5px solid ${palette.line}`,
            background: palette.surface,
            color: palette.ink,
            cursor: "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Live preview */}
      <div
        style={{
          margin: "18px 22px",
          background: colorVal,
          padding: 18,
          border: `1.5px solid ${palette.line}`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            background: palette.surface,
            border: `1.5px solid ${palette.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `3px 3px 0 0 ${palette.line}`,
            color: palette.line,
            flexShrink: 0,
          }}
        >
          <CatIcon kind={iconVal} size={22} color={palette.line} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: palette.line,
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {nameVal || "Nombre de la categoría"}
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: palette.line,
              opacity: 0.7,
              letterSpacing: "0.04em",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {descVal || "descripción opcional"}
          </div>
        </div>
      </div>

      {/* Form body */}
      <form
        onSubmit={onSubmit}
        style={{
          padding: "6px 22px",
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {submitError && (
          <div
            style={{
              padding: "8px 12px",
              background: "rgba(225,29,72,0.08)",
              border: "1.5px solid #E11D48",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              color: "#E11D48",
            }}
          >
            ▲ {submitError}
          </div>
        )}

        {/* Name */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: errors.name ? "#E11D48" : palette.inkDim,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            nombre
          </label>
          <input
            {...register("name")}
            placeholder="ej. lectura"
            style={{
              width: "100%",
              boxSizing: "border-box",
              height: 40,
              padding: "0 12px",
              border: `1.5px solid ${errors.name ? "#E11D48" : palette.line}`,
              background: palette.bg,
              color: palette.ink,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              outline: "none",
            }}
          />
          {errors.name && (
            <div
              style={{
                marginTop: 4,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: "#E11D48",
              }}
            >
              ▲ {errors.name.message}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: palette.inkDim,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            descripción{" "}
            <span style={{ opacity: 0.5 }}>· opcional</span>
          </label>
          <textarea
            {...register("description")}
            placeholder="¿de qué trata?"
            rows={2}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              minHeight: 64,
              border: `1.5px solid ${palette.line}`,
              background: palette.bg,
              color: palette.ink,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13,
              lineHeight: 1.4,
              outline: "none",
              resize: "none",
            }}
          />
        </div>

        {/* Color picker */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: palette.inkDim,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            color
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 8,
            }}
          >
            {CATEGORY_PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setValue("color", c)}
                aria-label={c}
                style={{
                  height: 34,
                  background: c,
                  border: `1.5px solid ${palette.line}`,
                  cursor: "pointer",
                  position: "relative",
                  boxShadow:
                    colorVal === c
                      ? `3px 3px 0 0 ${palette.line}`
                      : "none",
                  transform:
                    colorVal === c ? "translate(-1px,-1px)" : "none",
                  transition: "transform .12s, box-shadow .12s",
                }}
              >
                {colorVal === c && (
                  <span
                    style={{
                      position: "absolute",
                      inset: 4,
                      border: `1.5px solid ${palette.line}`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Icon picker */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: palette.inkDim,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            icono
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 8,
            }}
          >
            {CATEGORY_ICONS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setValue("icon", k)}
                aria-label={k}
                style={{
                  height: 40,
                  background: iconVal === k ? palette.line : palette.bg,
                  color: iconVal === k ? palette.bg : palette.ink,
                  border: `1.5px solid ${palette.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background .12s, color .12s",
                }}
              >
                <CatIcon
                  kind={k}
                  size={20}
                  color={iconVal === k ? palette.bg : palette.ink}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Spacer to push footer */}
        <div style={{ flex: 1 }} />
      </form>

      {/* Footer actions */}
      <div
        style={{
          padding: "16px 22px",
          borderTop: `1.5px solid ${palette.line}`,
          display: "flex",
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            height: 42,
            background: palette.surface,
            color: palette.ink,
            border: `1.5px solid ${palette.line}`,
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
          form="cat-form"
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{
            flex: 2,
            height: 42,
            background: isSubmitting ? palette.inkDim : palette.line,
            color: palette.bg,
            border: "none",
            cursor: isSubmitting ? "default" : "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            boxShadow: `4px 4px 0 0 ${colorVal}`,
            transition: "box-shadow .15s",
          }}
        >
          {isSubmitting ? "…" : isEdit ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </div>
  );
}
