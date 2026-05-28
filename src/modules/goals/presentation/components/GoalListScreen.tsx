"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { Goal, CategoryOption } from "@/modules/goals/domain/entities/goal";
import type { GoalFormValues } from "../schemas/goal.schema";
import { useGoalFilters } from "../stores/goal-filters-store";
import { GoalCard } from "./GoalCard";
import { GoalRow } from "./GoalRow";
import { GoalFormSheet } from "./GoalFormSheet";
import { DASH_PALETTES, type DashPalette } from "@/shared/presentation/palette";

interface GoalListScreenProps {
  initialGoals: Goal[];
  categories: CategoryOption[];
  createAction: (values: GoalFormValues) => Promise<{ ok: boolean; message?: string }>;
  updateAction: (id: string, values: GoalFormValues) => Promise<{ ok: boolean; message?: string }>;
  deleteAction: (id: string) => Promise<{ ok: boolean; message?: string }>;
}

function FilterChip({
  label,
  active,
  color,
  onClick,
  palette,
  count,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
  palette: DashPalette;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        border: `1.5px solid ${palette.line}`,
        background: active ? palette.line : palette.surface,
        color: active ? palette.bg : palette.ink,
        cursor: "pointer",
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        transition: "background .12s, color .12s",
      }}
    >
      {color && <span style={{ width: 8, height: 8, background: color }} />}
      {label}
      {count !== undefined && (
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            padding: "1px 5px",
            background: active ? "rgba(244,244,239,0.2)" : palette.lineSofter,
            color: active ? palette.bg : palette.inkDim,
            letterSpacing: "0.04em",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function GoalListScreen({
  initialGoals,
  categories,
  createAction,
  updateAction,
  deleteAction,
}: GoalListScreenProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const palette: DashPalette =
    mounted && resolvedTheme === "dark"
      ? DASH_PALETTES.dark
      : DASH_PALETTES.light;

  const [goals, setGoals] = React.useState<Goal[]>(initialGoals);
  const [editing, setEditing] = React.useState<Goal | null>(null);
  const [showNew, setShowNew] = React.useState(false);

  const {
    query,
    type,
    status,
    view,
    setQuery,
    setType,
    setStatus,
    setView,
    clearFilters,
  } = useGoalFilters();

  const hasActiveFilters = query || type !== "all";

  const filtered = React.useMemo(() => {
    return goals.filter((g) => {
      if (type !== "all" && g.type !== type) return false;
      const instanceStatus = g.activeInstance?.status ?? "IN_PROGRESS";
      if (status === "completed" && instanceStatus !== "COMPLETED") return false;
      if (status === "active" && instanceStatus === "COMPLETED") return false;
      if (query && !g.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [goals, type, status, query]);

  const counts = {
    active: goals.filter(
      (g) => (g.activeInstance?.status ?? "IN_PROGRESS") !== "COMPLETED",
    ).length,
    completed: goals.filter(
      (g) => g.activeInstance?.status === "COMPLETED",
    ).length,
    all: goals.length,
  };

  const handleCreate = async (values: GoalFormValues) => {
    const result = await createAction(values);
    if (result.ok) {
      router.refresh();
      setGoals(initialGoals);
    }
    return result;
  };

  const handleUpdate = async (values: GoalFormValues) => {
    if (!editing) return { ok: false };
    const result = await updateAction(editing.id, values);
    if (result.ok) router.refresh();
    return result;
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAction(id);
    if (result.ok) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
    return result;
  };

  void handleDelete;

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
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
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
            metas · {filtered.length} de {goals.length}
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
            Tus{" "}
            <span
              style={{
                background: palette.lime,
                padding: "0 8px",
                fontStyle: "italic",
              }}
            >
              metas
            </span>{" "}
            · esta es la lista.
          </h1>
        </div>

        <button
          onClick={() => setShowNew(true)}
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
            transition: "box-shadow .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `6px 6px 0 0 ${palette.primary}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `4px 4px 0 0 ${palette.primary}`;
          }}
        >
          + Nueva meta
        </button>
      </div>

      {/* Filter bar */}
      <div
        style={{
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {/* Row 1: search + status + view toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* search */}
          <div
            style={{
              position: "relative",
              flex: 1,
              maxWidth: 360,
              display: "flex",
              alignItems: "center",
              border: `1.5px solid ${palette.line}`,
              background: palette.bg,
              padding: "7px 12px 7px 36px",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: palette.inkDim,
                fontSize: 14,
              }}
            >
              ⌕
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="buscar metas..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 13,
                color: palette.ink,
                padding: 0,
              }}
            />
          </div>

          {/* status chips */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginLeft: "auto",
            }}
          >
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: palette.inkDim,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginRight: 4,
              }}
            >
              estado
            </span>
            {(
              [
                ["active", "Activas", counts.active],
                ["completed", "Completadas", counts.completed],
                ["all", "Todas", counts.all],
              ] as const
            ).map(([k, l, c]) => (
              <FilterChip
                key={k}
                label={l}
                active={status === k}
                onClick={() => setStatus(k)}
                palette={palette}
                count={c}
              />
            ))}
          </div>

          {/* view toggle */}
          <div
            style={{
              display: "inline-flex",
              border: `1.5px solid ${palette.line}`,
              overflow: "hidden",
              marginLeft: 4,
            }}
          >
            {(
              [
                ["grid", "grid"],
                ["list", "lista"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                style={{
                  padding: "7px 10px",
                  border: "none",
                  cursor: "pointer",
                  background: view === k ? palette.line : "transparent",
                  color: view === k ? palette.bg : palette.ink,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  borderRight:
                    k === "grid"
                      ? `1.5px solid ${palette.line}`
                      : "none",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: type filter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: palette.inkDim,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginRight: 4,
              }}
            >
              tipo
            </span>
            {(
              [
                ["all", "Todas"],
                ["CONCLUSIVE", "Conclusiva"],
                ["CYCLIC", "Cíclica"],
              ] as const
            ).map(([k, l]) => (
              <FilterChip
                key={k}
                label={l}
                active={type === k}
                onClick={() => setType(k)}
                palette={palette}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Active filters note */}
      {hasActiveFilters && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            color: palette.inkDim,
            letterSpacing: "0.04em",
          }}
        >
          mostrando {filtered.length} meta{filtered.length !== 1 ? "s" : ""}
          <button
            onClick={clearFilters}
            style={{
              background: "transparent",
              border: `1px solid ${palette.lineSoft}`,
              color: palette.primary,
              padding: "2px 8px",
              cursor: "pointer",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            limpiar filtros
          </button>
        </div>
      )}

      {/* Goals grid or list */}
      {view === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              palette={palette}
              onClick={() => router.push(`/goals/${g.id}`)}
            />
          ))}

          {/* new goal placeholder */}
          <button
            onClick={() => setShowNew(true)}
            style={{
              border: `1.5px dashed ${palette.lineSoft}`,
              background: "transparent",
              color: palette.inkDim,
              cursor: "pointer",
              padding: "40px 20px",
              minHeight: 200,
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
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = palette.line;
              e.currentTarget.style.color = palette.ink;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = palette.lineSoft;
              e.currentTarget.style.color = palette.inkDim;
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                border: "1.5px solid currentColor",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              +
            </div>
            Nueva meta
          </button>
        </div>
      ) : (
        <div
          style={{
            background: palette.surface,
            border: `1.5px solid ${palette.line}`,
          }}
        >
          {/* list header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "6px 1.6fr 1fr 90px 36px",
              gap: 16,
              alignItems: "center",
              padding: "10px 16px 10px 0",
              borderBottom: `1.5px solid ${palette.line}`,
              background: palette.surface2,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: palette.inkDim,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <div />
            <div>meta</div>
            <div>progreso</div>
            <div style={{ textAlign: "center" }}>estado</div>
            <div />
          </div>
          {filtered.map((g) => (
            <GoalRow
              key={g.id}
              goal={g}
              palette={palette}
              onClick={() => router.push(`/goals/${g.id}`)}
            />
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: palette.inkDim,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 13,
              }}
            >
              nada por aquí · prueba otros filtros
            </div>
          )}
        </div>
      )}

      {/* Form sheet */}
      <GoalFormSheet
        palette={palette}
        categories={categories}
        goal={editing}
        open={showNew || !!editing}
        onClose={() => {
          setShowNew(false);
          setEditing(null);
        }}
        action={editing ? handleUpdate : handleCreate}
      />
    </div>
  );
}
