"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { Category } from "@/modules/categories/domain/entities/category";
import type { CategoryFormValues } from "../schemas/category.schema";
import { CategoryCard } from "./CategoryCard";
import { CategoryFormSheet } from "./CategoryFormSheet";
import { CatIcon } from "./CatIcon";
import { DASH_PALETTES, type DashPalette } from "@/shared/presentation/palette";

interface CategoryListScreenProps {
  initialCategories: Category[];
  createAction: (
    values: CategoryFormValues,
  ) => Promise<{ ok: boolean; message?: string }>;
  updateAction: (
    id: string,
    values: CategoryFormValues,
  ) => Promise<{ ok: boolean; message?: string }>;
  deleteAction: (id: string) => Promise<{ ok: boolean; message?: string }>;
}

export function CategoryListScreen({
  initialCategories,
  createAction,
  updateAction,
  deleteAction,
}: CategoryListScreenProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const palette: DashPalette = mounted && resolvedTheme === "dark"
    ? DASH_PALETTES.dark
    : DASH_PALETTES.light;

  const [categories, setCategories] =
    React.useState<Category[]>(initialCategories);
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [showNew, setShowNew] = React.useState(false);

  const showSheet = showNew || !!editing;

  const totalGoals = categories.reduce((s, c) => s + c.goalCount, 0);
  const avgAll =
    categories.length > 0
      ? Math.round(
          categories.reduce((s, c) => s + c.avgProgress, 0) /
            categories.length,
        )
      : 0;
  const best = [...categories].sort((a, b) => b.avgProgress - a.avgProgress)[0];

  const handleCreate = async (values: CategoryFormValues) => {
    const result = await createAction(values);
    if (result.ok) {
      setShowNew(false);
      router.refresh();
    }
    return result;
  };

  const handleUpdate = async (values: CategoryFormValues) => {
    if (!editing) return { ok: false };
    const result = await updateAction(editing.id, values);
    if (result.ok) {
      setEditing(null);
      router.refresh();
    }
    return result;
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAction(id);
    if (result.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setEditing(null);
      router.refresh();
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
      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 0 32px" }}>
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: palette.inkDim,
                marginBottom: 4,
              }}
            >
              categorías · {categories.length} en total
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              Organiza tus metas por{" "}
              <span
                style={{
                  background: palette.magenta,
                  color: palette.bg,
                  padding: "0 8px",
                }}
              >
                tema
              </span>
              .
            </h1>
          </div>
          <button
            onClick={() => { setEditing(null); setShowNew(true); }}
            style={{
              background: palette.line,
              color: palette.bg,
              border: "none",
              padding: "10px 16px",
              cursor: "pointer",
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.005em",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: `4px 4px 0 0 ${palette.primary}`,
              flexShrink: 0,
            }}
          >
            + Nueva categoría
          </button>
        </div>

        {/* Summary strip */}
        {categories.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr",
              gap: 12,
              marginBottom: 22,
            }}
          >
            {/* Total goals — dark card */}
            <div
              style={{
                background: palette.line,
                color: palette.bg,
                padding: "16px 18px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.85,
                }}
              >
                {totalGoals}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    opacity: 0.6,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  metas en todas las categorías
                </div>
                <div
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  repartidas en {categories.length} áreas
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                {categories.map((c) => (
                  <div
                    key={c.id}
                    style={{ width: 14, height: 40, background: c.color }}
                  />
                ))}
              </div>
            </div>

            {/* Avg progress */}
            <div
              style={{
                background: palette.surface,
                border: `1.5px solid ${palette.line}`,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  color: palette.inkDim,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                promedio general
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                <span style={{ fontSize: 38, color: palette.ink }}>{avgAll}</span>
                <span
                  style={{
                    fontSize: 14,
                    color: palette.inkDim,
                    fontWeight: 500,
                  }}
                >
                  %
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  marginTop: 6,
                  background: palette.lineSofter,
                  border: `1px solid ${palette.line}`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${avgAll}%`,
                    background: palette.lime,
                  }}
                />
              </div>
            </div>

            {/* Best category */}
            {best && (
              <div
                style={{
                  background: palette.surface,
                  border: `1.5px solid ${palette.line}`,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    color: palette.inkDim,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  en mejor forma
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: best.color,
                      border: `1.5px solid ${palette.line}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CatIcon kind={best.icon} size={18} color={palette.line} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: '"Space Grotesk", system-ui, sans-serif',
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: palette.ink,
                        textTransform: "capitalize",
                      }}
                    >
                      {best.name}
                    </div>
                    <div
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 10,
                        color: palette.inkDim,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {best.avgProgress}% promedio
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              palette={palette}
              onEdit={(cat) => { setShowNew(false); setEditing(cat); }}
            />
          ))}

          {/* "New" placeholder card */}
          <button
            onClick={() => { setEditing(null); setShowNew(true); }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = palette.line;
              (e.currentTarget as HTMLButtonElement).style.color = palette.ink;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = palette.lineSoft;
              (e.currentTarget as HTMLButtonElement).style.color = palette.inkDim;
            }}
            style={{
              border: `1.5px dashed ${palette.lineSoft}`,
              background: "transparent",
              color: palette.inkDim,
              cursor: "pointer",
              padding: "40px 20px",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              transition: "border-color .15s, color .15s",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                border: "1.5px solid currentColor",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              +
            </div>
            Nueva categoría
          </button>
        </div>
      </div>

      {/* Slide-in form sheet */}
      {showSheet && (
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
            initial={editing ?? undefined}
            onClose={() => { setShowNew(false); setEditing(null); }}
            action={editing ? handleUpdate : handleCreate}
          />
          {editing && (
            <div
              style={{
                padding: "0 22px 16px",
                borderTop: `1px solid ${palette.lineSofter}`,
              }}
            >
              <button
                type="button"
                onClick={() => handleDelete(editing.id)}
                style={{
                  width: "100%",
                  height: 36,
                  background: "transparent",
                  border: `1.5px solid rgba(225,29,72,0.4)`,
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
          )}
        </div>
      )}
    </div>
  );
}
