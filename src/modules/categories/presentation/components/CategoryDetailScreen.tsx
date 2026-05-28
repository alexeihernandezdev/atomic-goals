"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { Category } from "@/modules/categories/domain/entities/category";
import type { CategoryFormValues } from "../schemas/category.schema";
import { CategoryFormSheet } from "./CategoryFormSheet";
import { CatIcon } from "./CatIcon";
import { DASH_PALETTES, type DashPalette } from "@/shared/presentation/palette";

interface CategoryDetailScreenProps {
  category: Category;
  updateAction: (
    id: string,
    values: CategoryFormValues,
  ) => Promise<{ ok: boolean; message?: string }>;
  deleteAction: (id: string) => Promise<{ ok: boolean; message?: string }>;
}

export function CategoryDetailScreen({
  category,
  updateAction,
  deleteAction,
}: CategoryDetailScreenProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const palette: DashPalette =
    mounted && resolvedTheme === "dark"
      ? DASH_PALETTES.dark
      : DASH_PALETTES.light;

  const [showEdit, setShowEdit] = React.useState(false);

  const handleUpdate = async (values: CategoryFormValues) => {
    const result = await updateAction(category.id, values);
    if (result.ok) {
      setShowEdit(false);
      router.refresh();
    }
    return result;
  };

  const handleDelete = async () => {
    const result = await deleteAction(category.id);
    if (result.ok) {
      router.push("/categories");
    }
    return result;
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        background: palette.bg,
        color: palette.ink,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
      }}
    >
      <div style={{ flex: 1, overflow: "auto", paddingBottom: 32 }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            color: palette.inkDim,
            letterSpacing: "0.08em",
          }}
        >
          <div
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Link
              href="/categories"
              style={{ color: palette.inkDim, textDecoration: "none" }}
            >
              categorías
            </Link>
            <span>/</span>
            <span
              style={{ color: palette.ink, textTransform: "capitalize" }}
            >
              {category.name}
            </span>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            background: category.color,
            border: `1.5px solid ${palette.line}`,
            padding: "32px 32px 28px",
            position: "relative",
            overflow: "hidden",
            marginBottom: 22,
            boxShadow: `6px 6px 0 0 ${palette.line}`,
          }}
        >
          {/* Decorative shapes */}
          <div
            style={{
              position: "absolute",
              right: -30,
              top: -40,
              width: 160,
              height: 160,
              background: palette.line,
              opacity: 0.16,
              transform: "rotate(12deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 80,
              bottom: -20,
              width: 50,
              height: 50,
              background: palette.line,
              opacity: 0.16,
            }}
          />

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "flex-start",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                background: palette.surface,
                border: `1.5px solid ${palette.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `4px 4px 0 0 ${palette.line}`,
                flexShrink: 0,
              }}
            >
              <CatIcon kind={category.icon} size={36} color={palette.line} />
            </div>

            <div style={{ flex: 1, color: palette.line }}>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                  marginBottom: 6,
                }}
              >
                categoría
              </div>
              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  textTransform: "capitalize",
                }}
              >
                {category.name}
              </h1>
              {category.description && (
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 15,
                    lineHeight: 1.4,
                    maxWidth: 460,
                    opacity: 0.85,
                  }}
                >
                  {category.description}
                </p>
              )}
            </div>

            <div style={{ textAlign: "right", color: palette.line }}>
              <div
                style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 88,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.85,
                }}
              >
                {category.avgProgress}
                <span style={{ fontSize: 28, opacity: 0.7 }}>%</span>
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  opacity: 0.75,
                  marginTop: 4,
                }}
              >
                promedio de la categoría
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setShowEdit(true)}
                  style={{
                    padding: "6px 10px",
                    background: palette.surface,
                    color: palette.line,
                    border: `1.5px solid ${palette.line}`,
                    cursor: "pointer",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  editar
                </button>
                <Link
                  href="/goals"
                  style={{
                    padding: "6px 10px",
                    background: palette.line,
                    color: palette.bg,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  + meta
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 22,
          }}
        >
          {[
            { label: "metas totales", value: category.goalCount },
            { label: "en curso", value: category.activeGoals },
            { label: "completadas", value: category.completedGoals },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: palette.surface,
                border: `1.5px solid ${palette.line}`,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  color: palette.inkDim,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: palette.ink,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Goals placeholder — Phase 3 will add real GoalList */}
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
              metas en esta categoría
            </div>
            <div
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.015em",
              }}
            >
              {category.goalCount} meta{category.goalCount !== 1 ? "s" : ""}
            </div>
          </div>
          <Link
            href="/goals"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: palette.primary,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            ver en /metas →
          </Link>
        </div>

        {category.goalCount === 0 && (
          <div
            style={{
              border: `1.5px dashed ${palette.lineSoft}`,
              padding: "48px 24px",
              textAlign: "center",
              color: palette.inkDim,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            sin metas aún · añade una desde /metas
          </div>
        )}
      </div>

      {/* Edit sheet */}
      {showEdit && (
        <div
          style={{
            width: 380,
            flexShrink: 0,
            borderLeft: `1.5px solid ${palette.line}`,
            overflow: "auto",
            height: "100%",
          }}
        >
          <CategoryFormSheet
            palette={palette}
            initial={category}
            onClose={() => setShowEdit(false)}
            action={handleUpdate}
          />
          <div
            style={{
              padding: "0 22px 16px",
            }}
          >
            <button
              type="button"
              onClick={handleDelete}
              style={{
                width: "100%",
                height: 36,
                background: "transparent",
                border: "1.5px solid rgba(225,29,72,0.4)",
                color: "#E11D48",
                cursor: "pointer",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              eliminar categoría
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
