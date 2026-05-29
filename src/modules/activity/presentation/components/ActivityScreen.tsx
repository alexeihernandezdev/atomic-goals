"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { DASH_PALETTES } from "@/shared/presentation/palette";
import { clientContainer } from "@/shared/composition/client-container";
import type { ActivityEntry, ActivityPage } from "../../domain/activity-entry";

const KIND_META: Record<string, { label: string; verb: string; tint: string }> = {
  GOAL_COMPLETED: { label: "Meta lista",   verb: "Terminaste la meta",  tint: "#C8FF1F" },
  STEP_COMPLETED: { label: "Completado",   verb: "Completaste el paso", tint: "#C8FF1F" },
  STEP_UPDATED:   { label: "Progreso",     verb: "Avanzaste en",        tint: "#2E5BFF" },
  GOAL_CREATED:   { label: "Creación",     verb: "Creaste",             tint: "#FFB400" },
  CATEGORY_CREATED:{ label: "Creación",    verb: "Creaste",             tint: "#FFB400" },
  STREAK_MILESTONE:{ label: "Racha",       verb: "Racha",               tint: "#FF3D6E" },
  GOAL_UPDATED:   { label: "Edición",      verb: "Editaste",            tint: "#7C5CFF" },
};

const FILTER_OPTIONS = [
  { id: "all",              label: "Todo" },
  { id: "STEP_COMPLETED",   label: "Completados" },
  { id: "STEP_UPDATED",     label: "Progreso" },
  { id: "GOAL_CREATED",     label: "Creación" },
  { id: "GOAL_COMPLETED",   label: "Metas listas" },
  { id: "STREAK_MILESTONE", label: "Rachas" },
];

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function formatDayLabel(iso: string) {
  const now = new Date();
  const d = new Date(iso);
  const diffMs = now.setHours(0,0,0,0) - d.setHours(0,0,0,0);
  const diffDays = Math.round(diffMs / 86400000);
  const locale = "es";
  const label = d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" });
  if (diffDays === 0) return `Hoy · ${label}`;
  if (diffDays === 1) return `Ayer · ${label}`;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function groupByDay(items: ActivityEntry[]): { dayLabel: string; date: string; entries: ActivityEntry[] }[] {
  const map = new Map<string, { dayLabel: string; date: string; entries: ActivityEntry[] }>();
  for (const item of items) {
    const dayKey = item.createdAt.slice(0, 10);
    if (!map.has(dayKey)) {
      map.set(dayKey, { dayLabel: formatDayLabel(item.createdAt), date: dayKey, entries: [] });
    }
    map.get(dayKey)!.entries.push(item);
  }
  return Array.from(map.values());
}

interface ActivityScreenProps {
  initialPage: ActivityPage;
}

export function ActivityScreen({ initialPage }: ActivityScreenProps) {
  const { resolvedTheme } = useTheme();
  const palette = resolvedTheme === "dark" ? DASH_PALETTES.dark : DASH_PALETTES.light;

  const [filter, setFilter] = React.useState("all");
  const [items, setItems] = React.useState<ActivityEntry[]>(initialPage.items);
  const [nextCursor, setNextCursor] = React.useState<string | null>(initialPage.nextCursor);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.kind === filter);
  const groups = groupByDay(filtered);

  const kindCounts = React.useMemo(() => {
    const c: Record<string, number> = {};
    items.forEach((i) => { c[i.kind] = (c[i.kind] ?? 0) + 1; });
    return c;
  }, [items]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await clientContainer().activity.list.execute({ limit: 20, cursor: nextCursor });
      setItems((prev) => [...prev, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch {
      /* ignore */
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
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
          actividad · historial completo
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
          Todo lo que has{" "}
          <span
            style={{
              background: palette.lime,
              padding: "0 8px",
              fontStyle: "italic",
              color: palette.line,
            }}
          >
            movido
          </span>
          .
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28 }}>
        {/* Feed column */}
        <div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {FILTER_OPTIONS.map((f) => {
              const count = f.id === "all" ? items.length : kindCounts[f.id] ?? 0;
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
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
                  {f.label}
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
                </button>
              );
            })}
          </div>

          {/* Feed */}
          {groups.length === 0 ? (
            <div
              style={{
                padding: "48px 20px",
                textAlign: "center",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: palette.inkDim,
                letterSpacing: "0.04em",
              }}
            >
              sin actividad registrada
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.date} style={{ marginBottom: 8 }}>
                {/* Day header */}
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 0 12px",
                    background: palette.bg,
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: palette.ink,
                      fontWeight: 600,
                    }}
                  >
                    {group.dayLabel}
                  </div>
                  <div
                    style={{ flex: 1, height: 1.5, background: palette.lineSoft }}
                  />
                  <div
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 10,
                      color: palette.inkDim,
                    }}
                  >
                    {group.entries.length} evento
                    {group.entries.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Items */}
                {group.entries.map((item, i) => {
                  const meta =
                    KIND_META[item.kind] ?? KIND_META.GOAL_UPDATED;
                  const isLast = i === group.entries.length - 1;
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "40px 1fr auto",
                        gap: 14,
                        position: "relative",
                      }}
                    >
                      {/* timeline node */}
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {!isLast && (
                          <div
                            style={{
                              position: "absolute",
                              top: 36,
                              bottom: -16,
                              width: 1.5,
                              background: palette.lineSoft,
                            }}
                          />
                        )}
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            background: meta.tint,
                            border: `1.5px solid ${palette.line}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: palette.line,
                            zIndex: 1,
                            flexShrink: 0,
                            fontFamily: '"Space Grotesk", system-ui, sans-serif',
                            fontWeight: 700,
                            fontSize: 15,
                          }}
                        >
                          {item.kind.startsWith("STEP_COMPLETED") || item.kind === "GOAL_COMPLETED" ? "✓" :
                           item.kind === "STREAK_MILESTONE" ? "↑" :
                           item.kind === "GOAL_CREATED" || item.kind === "CATEGORY_CREATED" ? "+" : "·"}
                        </div>
                      </div>

                      {/* body */}
                      <div style={{ paddingBottom: 18, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 3,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: 9,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              padding: "2px 6px",
                              background: meta.tint,
                              color: palette.line,
                            }}
                          >
                            {meta.label}
                          </span>
                          <span
                            style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: 10,
                              color: palette.inkDim,
                              letterSpacing: "0.04em",
                            }}
                          >
                            {meta.verb}
                          </span>
                        </div>
                        <div
                          style={{
                            fontFamily: '"Space Grotesk", system-ui, sans-serif',
                            fontSize: 15,
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            color: palette.ink,
                            lineHeight: 1.25,
                          }}
                        >
                          {item.entityName}
                        </div>
                        {item.detail && (
                          <div
                            style={{
                              fontFamily: '"Space Grotesk", system-ui, sans-serif',
                              fontSize: 12,
                              color: palette.inkDim,
                              marginTop: 2,
                            }}
                          >
                            {item.detail}
                          </div>
                        )}
                        {item.categoryColor && (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 8,
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: 10,
                              color: palette.inkDim,
                              letterSpacing: "0.04em",
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                background: item.categoryColor,
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* time */}
                      <div
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: 11,
                          color: palette.inkSubtle,
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap",
                          paddingTop: 8,
                        }}
                      >
                        {formatTime(item.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {/* Load more */}
          {nextCursor && (
            <div style={{ marginTop: 8, paddingLeft: 54 }}>
              {loadingMore ? (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    color: palette.inkDim,
                    letterSpacing: "0.06em",
                  }}
                >
                  <span style={{ display: "inline-flex", gap: 4 }}>
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        style={{
                          width: 7,
                          height: 7,
                          background: palette.primary,
                          display: "inline-block",
                        }}
                      />
                    ))}
                  </span>
                  cargando más...
                </div>
              ) : (
                <button
                  onClick={loadMore}
                  style={{
                    padding: "10px 18px",
                    border: `1.5px solid ${palette.line}`,
                    background: palette.surface,
                    color: palette.ink,
                    cursor: "pointer",
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  ↓ Cargar más actividad
                </button>
              )}
            </div>
          )}
          {!nextCursor && items.length > 0 && (
            <div
              style={{
                marginTop: 12,
                paddingLeft: 54,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: palette.inkSubtle,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              — fin del historial —
            </div>
          )}
        </div>

        {/* Right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* This week card */}
          <div
            style={{
              background: palette.line,
              color: palette.bg,
              padding: "18px 20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                opacity: 0.6,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              total cargado
            </div>
            <div
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
              }}
            >
              {items.length}
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                opacity: 0.65,
                letterSpacing: "0.06em",
                marginTop: 6,
              }}
            >
              acciones registradas
            </div>
          </div>

          {/* Breakdown by kind */}
          <div
            style={{
              background: palette.surface,
              border: `1.5px solid ${palette.line}`,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: palette.inkDim,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              por tipo
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(KIND_META).map(([k, v]) => {
                const n = kindCounts[k] ?? 0;
                const max = Math.max(...Object.values(kindCounts), 1);
                return (
                  <div
                    key={k}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "16px 1fr 20px",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        background: v.tint,
                        border: `1px solid ${palette.line}`,
                        display: "inline-block",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: '"Space Grotesk", system-ui, sans-serif',
                          fontSize: 12,
                          fontWeight: 600,
                          color: palette.ink,
                          marginBottom: 3,
                        }}
                      >
                        {v.label}
                      </div>
                      <div
                        style={{
                          height: 4,
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
                            width: `${(n / max) * 100}%`,
                            background: v.tint,
                          }}
                        />
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 11,
                        color: palette.inkDim,
                        textAlign: "right",
                      }}
                    >
                      {n}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
