"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { DASH_PALETTES } from "@/shared/presentation/palette";
import { ConfirmDialog } from "@/shared/ui-kit/molecules/ConfirmDialog";
import type { TrashList, TrashedItem, TrashEntityType } from "../../domain/trashed-item";
import { restoreItemAction, permanentDeleteAction, emptyTrashAction } from "@/app/(app)/trash/actions";

type TabId = "goals" | "categories" | "steps";

const TABS: { id: TabId; label: string }[] = [
  { id: "goals",      label: "Metas" },
  { id: "categories", label: "Categorías" },
  { id: "steps",      label: "Pasos" },
];

interface DialogState {
  mode: "delete" | "empty";
  ids?: string[];
}

interface TrashScreenProps {
  initialList: TrashList;
}

export function TrashScreen({ initialList }: TrashScreenProps) {
  const { resolvedTheme } = useTheme();
  const palette = resolvedTheme === "dark" ? DASH_PALETTES.dark : DASH_PALETTES.light;
  const router = useRouter();

  const [list, setList] = React.useState<TrashList>(initialList);
  const [tab, setTab] = React.useState<TabId>("goals");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [dialog, setDialog] = React.useState<DialogState | null>(null);
  const [busy, setBusy] = React.useState(false);

  const rows = list[tab];
  const totalCount = list.goals.length + list.categories.length + list.steps.length;
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const someSelected = rows.some((r) => selected.has(r.id));
  const selectedInTab = rows.filter((r) => selected.has(r.id)).map((r) => r.id);

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) rows.forEach((r) => next.delete(r.id));
      else rows.forEach((r) => next.add(r.id));
      return next;
    });
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function removeFromList(ids: string[]) {
    setList((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((r) => !ids.includes(r.id)),
    }));
    setSelected((prev) => {
      const n = new Set(prev);
      ids.forEach((i) => n.delete(i));
      return n;
    });
  }

  async function handleRestore(ids: string[]) {
    if (busy) return;
    setBusy(true);
    try {
      await Promise.all(
        ids.map((id) => restoreItemAction(tab as TrashEntityType, id)),
      );
      removeFromList(ids);
      router.refresh();
    } catch {
      /* silently ignore */
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(ids: string[]) {
    if (busy) return;
    setBusy(true);
    try {
      await Promise.all(
        ids.map((id) => permanentDeleteAction(tab as TrashEntityType, id)),
      );
      removeFromList(ids);
    } catch {
      /* silently ignore */
    } finally {
      setBusy(false);
      setDialog(null);
    }
  }

  async function handleEmptyTrash() {
    if (busy) return;
    setBusy(true);
    try {
      await emptyTrashAction();
      setList({ goals: [], categories: [], steps: [] });
      setSelected(new Set());
    } catch {
      /* silently ignore */
    } finally {
      setBusy(false);
      setDialog(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
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
            papelera · {totalCount} elemento{totalCount !== 1 ? "s" : ""}
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: palette.ink,
            }}
          >
            Lo que{" "}
            <span
              style={{
                background: palette.magenta,
                color: palette.bg,
                padding: "0 8px",
              }}
            >
              borraste
            </span>{" "}
            · aún recuperable.
          </h1>
        </div>
        <button
          onClick={() => totalCount > 0 && setDialog({ mode: "empty" })}
          disabled={totalCount === 0}
          style={{
            background: totalCount === 0 ? palette.lineSofter : palette.surface,
            color: totalCount === 0 ? palette.inkSubtle : palette.magenta,
            border: `1.5px solid ${totalCount === 0 ? palette.lineSoft : palette.magenta}`,
            padding: "10px 16px",
            cursor: totalCount === 0 ? "default" : "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            marginTop: 8,
          }}
        >
          Vaciar papelera
        </button>
      </div>

      {/* Info banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          marginBottom: 18,
          border: `1.5px solid ${palette.line}`,
          background: palette.surface2,
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            background: palette.yellow,
            border: `1.5px solid ${palette.line}`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.line,
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
          }}
        >
          i
        </span>
        <span
          style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 13,
            color: palette.inkDim,
          }}
        >
          Los elementos se eliminan{" "}
          <strong style={{ color: palette.ink }}>
            definitivamente a los 30 días
          </strong>
          . Puedes restaurarlos antes de eso.
        </span>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: `1.5px solid ${palette.line}`,
        }}
      >
        {TABS.map((t) => {
          const n = list[t.id].length;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSelected(new Set()); }}
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: active
                  ? `3px solid ${palette.magenta}`
                  : "3px solid transparent",
                marginBottom: -1.5,
                cursor: "pointer",
                color: active ? palette.ink : palette.inkDim,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "-0.005em",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {t.label}
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  padding: "2px 6px",
                  background: active ? palette.line : palette.lineSofter,
                  color: active ? palette.bg : palette.inkDim,
                  letterSpacing: "0.04em",
                }}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bulk action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 16px",
          background: someSelected ? palette.line : palette.surface,
          color: someSelected ? palette.bg : palette.ink,
          border: `1.5px solid ${palette.line}`,
          borderTop: "none",
          transition: "background .15s, color .15s",
        }}
      >
        {/* select-all checkbox */}
        <button
          onClick={toggleAll}
          aria-label="Seleccionar todo"
          style={{
            width: 20,
            height: 20,
            flexShrink: 0,
            border: `1.5px solid ${someSelected ? palette.bg : palette.line}`,
            background:
              allSelected || someSelected
                ? someSelected
                  ? palette.bg
                  : palette.line
                : palette.surface,
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .12s",
          }}
        >
          {allSelected && (
            <span
              style={{
                color: someSelected ? palette.line : palette.bg,
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              ✓
            </span>
          )}
          {!allSelected && someSelected && (
            <span
              style={{
                width: 9,
                height: 2,
                background: palette.line,
                display: "inline-block",
              }}
            />
          )}
        </button>
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: "0.06em",
          }}
        >
          {selectedInTab.length > 0
            ? `${selectedInTab.length} seleccionado${selectedInTab.length !== 1 ? "s" : ""}`
            : "seleccionar todo"}
        </span>

        {selectedInTab.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
            <button
              onClick={() => handleRestore(selectedInTab)}
              disabled={busy}
              style={{
                padding: "7px 14px",
                background: palette.lime,
                color: palette.line,
                border: `1.5px solid ${palette.line}`,
                cursor: "pointer",
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ↺ Restaurar ({selectedInTab.length})
            </button>
            <button
              onClick={() => setDialog({ mode: "delete", ids: selectedInTab })}
              disabled={busy}
              style={{
                padding: "7px 14px",
                background: palette.magenta,
                color: palette.line,
                border: `1.5px solid ${palette.line}`,
                cursor: "pointer",
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              × Eliminar ({selectedInTab.length})
            </button>
          </div>
        )}
      </div>

      {/* Column header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "20px 6px 1fr 150px 120px 140px",
          gap: 16,
          alignItems: "center",
          padding: "8px 16px",
          background: palette.surface2,
          border: `1.5px solid ${palette.line}`,
          borderTop: "none",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          color: palette.inkDim,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <div />
        <div />
        <div>elemento</div>
        <div>eliminado</div>
        <div>expira en</div>
        <div style={{ textAlign: "right" }}>acciones</div>
      </div>

      {/* Rows */}
      <div
        style={{
          border: `1.5px solid ${palette.line}`,
          borderTop: "none",
          background: palette.surface,
        }}
      >
        {rows.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 14px",
                border: `1.5px dashed ${palette.lineSoft}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette.inkSubtle,
                fontSize: 22,
              }}
            >
              ✓
            </div>
            <div
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: palette.ink,
                marginBottom: 4,
              }}
            >
              Nada por aquí
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: palette.inkDim,
                letterSpacing: "0.04em",
              }}
            >
              esta pestaña de la papelera está vacía
            </div>
          </div>
        ) : (
          rows.map((item) => (
            <TrashRow
              key={item.id}
              item={item}
              tab={tab}
              palette={palette}
              selected={selected.has(item.id)}
              onToggle={() => toggle(item.id)}
              onRestore={() => handleRestore([item.id])}
              onDelete={() => setDialog({ mode: "delete", ids: [item.id] })}
            />
          ))
        )}
      </div>

      {/* Dialogs */}
      {dialog?.mode === "delete" && dialog.ids && (
        <ConfirmDialog
          palette={palette}
          danger
          title={`Eliminar ${dialog.ids.length} elemento${dialog.ids.length !== 1 ? "s" : ""}`}
          body="Esta acción es permanente. No podrás recuperar lo que elimines aquí. ¿Seguro?"
          confirmLabel="Sí, eliminar"
          onCancel={() => setDialog(null)}
          onConfirm={() => handleDelete(dialog.ids!)}
        />
      )}
      {dialog?.mode === "empty" && (
        <ConfirmDialog
          palette={palette}
          danger
          title="Vaciar la papelera"
          body={`Vas a eliminar definitivamente los ${totalCount} elementos de la papelera. Esta acción no se puede deshacer.`}
          confirmLabel="Vaciar todo"
          onCancel={() => setDialog(null)}
          onConfirm={handleEmptyTrash}
        />
      )}
    </div>
  );
}

// ── TrashRow ──────────────────────────────────────────────────────────────────

interface TrashRowProps {
  item: TrashedItem;
  tab: TabId;
  palette: ReturnType<typeof DASH_PALETTES.light extends undefined ? never : () => typeof DASH_PALETTES.light>;
  selected: boolean;
  onToggle: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

// Use explicit type for palette prop
function TrashRow({
  item, tab, palette, selected, onToggle, onRestore, onDelete,
}: {
  item: TrashedItem;
  tab: TabId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  palette: any;
  selected: boolean;
  onToggle: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const urgent = (item.daysUntilExpiry ?? 30) <= 7;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "20px 6px 1fr 150px 120px 140px",
        gap: 16,
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: `1px solid ${palette.lineSofter}`,
        background: selected ? palette.primarySoft : palette.surface,
        transition: "background .12s",
      }}
    >
      <button
        onClick={onToggle}
        aria-label="Seleccionar"
        style={{
          width: 20,
          height: 20,
          flexShrink: 0,
          border: `1.5px solid ${palette.line}`,
          background: selected ? palette.line : palette.surface,
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background .12s",
        }}
      >
        {selected && (
          <span style={{ color: palette.bg, fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>
        )}
      </button>

      <div style={{ alignSelf: "stretch", background: item.color ?? palette.lineSoft }} />

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: palette.ink,
            textTransform: tab === "categories" ? "capitalize" : "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            color: palette.inkDim,
            marginTop: 2,
            letterSpacing: "0.02em",
          }}
        >
          {item.meta}
        </div>
      </div>

      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: palette.inkDim,
          letterSpacing: "0.04em",
        }}
      >
        {item.deletedLabel}
      </div>

      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: "0.04em",
            color: urgent ? palette.magenta : palette.inkDim,
            fontWeight: urgent ? 600 : 400,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background: urgent ? palette.magenta : palette.lineSoft,
              display: "inline-block",
            }}
          />
          {item.daysUntilExpiry != null ? `${item.daysUntilExpiry} días` : "—"}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onRestore}
          style={{
            padding: "6px 10px",
            border: `1.5px solid ${palette.line}`,
            background: palette.surface,
            color: palette.ink,
            cursor: "pointer",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          ↺ restaurar
        </button>
        <button
          onClick={onDelete}
          aria-label="Eliminar definitivamente"
          style={{
            width: 30,
            height: 30,
            border: `1.5px solid ${palette.line}`,
            background: palette.surface,
            color: palette.magenta,
            cursor: "pointer",
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
