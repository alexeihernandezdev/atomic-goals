// Activity — feed grouped by day, type filters, simulated infinite scroll.
// Reuses dashPalettes, DashIcon, DASH_NAV, DASH_CATEGORIES, DashLogo,
// DashThemeToggle, DashMobileTabBar, CategoriesSidebar, CatIcon.
// "Today" is May 28, 2026.

// ── Event kinds ──
const ACT_KINDS = {
  completed: { label: 'Completado', verb: 'Completaste el paso', glyph: 'check', tint: '#C8FF1F' },
  progress:  { label: 'Progreso',   verb: 'Avanzaste en',        glyph: 'arrow', tint: '#2E5BFF' },
  created:   { label: 'Creación',   verb: 'Creaste',             glyph: 'plus',  tint: '#FFB400' },
  streak:    { label: 'Racha',      verb: 'Racha',               glyph: 'flame', tint: '#FF3D6E' },
  goal_done: { label: 'Meta lista', verb: 'Terminaste la meta',  glyph: 'check', tint: '#C8FF1F' },
  edited:    { label: 'Edición',    verb: 'Editaste',            glyph: 'square', tint: '#7C5CFF' },
};

// ── Feed data, grouped by day buckets ──
const ACT_FEED = [
  { day: 'Hoy · 28 may', items: [
    { kind: 'streak',    title: '23 días seguidos', detail: 'récord personal superado', goal: null, cat: 'mente', color: '#C8FF1F', time: '21:14' },
    { kind: 'completed', title: 'Meditar · 10 min', detail: null, goal: 'Meditar todos los días', cat: 'mente', color: '#C8FF1F', time: '21:02' },
    { kind: 'progress',  title: 'Correr 5km', detail: '3 / 5 km · sesión de 30 min', goal: 'Correr 5km sin parar', cat: 'salud', color: '#FF3D6E', time: '18:34' },
    { kind: 'created',   title: 'Leer · cap. 7', detail: 'nuevo paso en una meta', goal: 'Leer 12 libros este año', cat: 'mente', color: '#C8FF1F', time: '09:12' },
  ]},
  { day: 'Ayer · 27 may', items: [
    { kind: 'completed', title: 'Validar datos · reporte', detail: null, goal: 'Entregar reporte Q2', cat: 'trabajo', color: '#FFB400', time: '15:48' },
    { kind: 'progress',  title: 'Ahorrar $5.000', detail: '$1.650 acumulados · +$300', goal: 'Ahorrar $5.000', cat: 'finanzas', color: '#1FD1F9', time: '12:20' },
    { kind: 'edited',    title: 'Curso de inglés B2', detail: 'cambiaste la fecha límite', goal: 'Curso de inglés B2', cat: 'estudio', color: '#2E5BFF', time: '08:05' },
  ]},
  { day: 'Lunes · 26 may', items: [
    { kind: 'completed', title: 'Lección 12 — Past perfect', detail: null, goal: 'Curso de inglés B2', cat: 'estudio', color: '#2E5BFF', time: '07:41' },
    { kind: 'completed', title: 'Yoga · Vinyasa', detail: null, goal: 'Yoga 3x por semana', cat: 'salud', color: '#FF3D6E', time: '19:30' },
  ]},
  { day: 'Jueves · 22 may', items: [
    { kind: 'goal_done', title: 'Aprender SwiftUI', detail: '10 / 10 pasos · ¡felicidades!', goal: 'Aprender SwiftUI', cat: 'trabajo', color: '#FFB400', time: '16:00' },
    { kind: 'completed', title: 'Llamar a mamá', detail: null, goal: 'Llamar a mamá los domingos', cat: 'familia', color: '#7C5CFF', time: '11:10' },
    { kind: 'progress',  title: 'Plan de entrenamiento', detail: 'estado → en curso', goal: 'Correr 5km sin parar', cat: 'salud', color: '#FF3D6E', time: '09:00' },
  ]},
];

// Extra batch revealed by "infinite scroll"
const ACT_FEED_MORE = [
  { day: 'Lunes · 19 may', items: [
    { kind: 'completed', title: 'Lección 11 — Inglés', detail: null, goal: 'Curso de inglés B2', cat: 'estudio', color: '#2E5BFF', time: '07:30' },
    { kind: 'created',   title: 'Depósito mensual · mayo', detail: 'nuevo paso programado', goal: 'Ahorrar $5.000', cat: 'finanzas', color: '#1FD1F9', time: '10:00' },
  ]},
  { day: 'Martes · 13 may', items: [
    { kind: 'completed', title: 'Yoga · Vinyasa', detail: null, goal: 'Yoga 3x por semana', cat: 'salud', color: '#FF3D6E', time: '19:00' },
    { kind: 'edited',    title: 'Meditar todos los días', detail: 'cambiaste el horario', goal: 'Meditar todos los días', cat: 'mente', color: '#C8FF1F', time: '08:20' },
  ]},
  { day: 'Lunes · 12 may', items: [
    { kind: 'created',   title: 'Correr 5km sin parar', detail: 'nueva meta · categoría salud', goal: 'Correr 5km sin parar', cat: 'salud', color: '#FF3D6E', time: '07:00' },
  ]},
];

const ACT_FILTERS = [
  { id: 'all',       label: 'Todo' },
  { id: 'completed', label: 'Completados' },
  { id: 'progress',  label: 'Progreso' },
  { id: 'created',   label: 'Creación' },
  { id: 'goal_done', label: 'Metas listas' },
  { id: 'streak',    label: 'Rachas' },
];

// ── Single feed row ──
function ActivityItem({ item, palette, isLast }) {
  const kind = ACT_KINDS[item.kind];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 14,
      position: 'relative',
    }}>
      {/* timeline rail + node */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        {!isLast && (
          <div style={{
            position: 'absolute', top: 36, bottom: -16, width: 1.5,
            background: palette.lineSoft,
          }} />
        )}
        <div style={{
          width: 36, height: 36,
          background: kind.tint,
          border: `1.5px solid ${palette.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: palette.line, zIndex: 1, flexShrink: 0,
        }}>
          <DashIcon kind={kind.glyph} size={16} color={palette.line} />
        </div>
      </div>

      {/* body */}
      <div style={{ paddingBottom: 18, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '2px 6px', background: kind.tint, color: palette.line,
          }}>{kind.label}</span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.04em',
          }}>{kind.verb}</span>
        </div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: palette.ink,
          lineHeight: 1.25,
        }}>{item.title}</div>
        {item.detail && (
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 12,
            color: palette.inkDim, marginTop: 2,
          }}>{item.detail}</div>
        )}
        {item.goal && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.04em',
          }}>
            <span style={{ width: 8, height: 8, background: item.color }} />
            <span style={{ textTransform: 'capitalize' }}>{item.cat}</span>
            <span>·</span>
            <span style={{ color: palette.ink }}>{item.goal}</span>
          </div>
        )}
      </div>

      {/* time */}
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        color: palette.inkSubtle, letterSpacing: '0.04em', whiteSpace: 'nowrap',
        paddingTop: 8,
      }}>{item.time}</div>
    </div>
  );
}

// ── Day group ──
function ActivityDayGroup({ group, palette, filter }) {
  const items = filter === 'all' ? group.items : group.items.filter(i => i.kind === filter);
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 0 12px',
        background: palette.bg,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: palette.ink, fontWeight: 600,
        }}>{group.day}</div>
        <div style={{ flex: 1, height: 1.5, background: palette.lineSoft }} />
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim,
        }}>{items.length} evento{items.length !== 1 ? 's' : ''}</div>
      </div>
      <div>
        {items.map((item, i) => (
          <ActivityItem key={i} item={item} palette={palette} isLast={i === items.length - 1} />
        ))}
      </div>
    </div>
  );
}

// ── Desktop ──
function ActivityDesktop() {
  const [theme, setTheme] = React.useState('light');
  const [filter, setFilter] = React.useState('all');
  const [loaded, setLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const palette = dashPalettes[theme];

  const feed = loaded ? [...ACT_FEED, ...ACT_FEED_MORE] : ACT_FEED;
  const allItems = feed.flatMap(g => g.items);
  const totalShown = (filter === 'all' ? allItems : allItems.filter(i => i.kind === filter)).length;

  // stats for the right rail
  const counts = {};
  ACT_FEED.concat(ACT_FEED_MORE).flatMap(g => g.items).forEach(i => {
    counts[i.kind] = (counts[i.kind] || 0) + 1;
  });

  const loadMore = () => {
    if (loaded || loading) return;
    setLoading(true);
    setTimeout(() => { setLoaded(true); setLoading(false); }, 900);
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '240px 1fr',
      background: palette.bg, color: palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      <CategoriesSidebar palette={palette} active="activity" />

      <main style={{ overflow: 'auto', padding: '24px 32px 32px' }}>
        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 22,
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: palette.inkDim, marginBottom: 4,
            }}>actividad · historial completo</div>
            <h1 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em',
            }}>Todo lo que has <span style={{
              background: palette.lime, padding: '0 8px', fontStyle: 'italic',
            }}>movido</span>.</h1>
          </div>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        {/* layout: feed + right rail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28 }}>
          {/* Feed column */}
          <div>
            {/* filters */}
            <div style={{
              display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18,
            }}>
              {ACT_FILTERS.map(f => (
                <FilterChip key={f.id}
                  label={f.label} active={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  palette={palette}
                  count={f.id === 'all' ? allItems.length : counts[f.id] || 0}
                />
              ))}
            </div>

            {/* feed */}
            <div>
              {feed.map((g, i) => (
                <ActivityDayGroup key={i} group={g} palette={palette} filter={filter} />
              ))}
            </div>

            {/* infinite-scroll sentinel */}
            {!loaded ? (
              <div style={{
                marginTop: 8, paddingLeft: 54,
              }}>
                {loading ? (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                    color: palette.inkDim, letterSpacing: '0.06em',
                  }}>
                    <span style={{ display: 'inline-flex', gap: 4 }}>
                      {[0,1,2].map(i => (
                        <span key={i} style={{
                          width: 7, height: 7, background: palette.primary,
                          animation: `act-pulse 1s ease ${i*0.15}s infinite`,
                        }} />
                      ))}
                    </span>
                    cargando más...
                  </div>
                ) : (
                  <button onClick={loadMore} style={{
                    padding: '10px 18px',
                    border: `1.5px solid ${palette.line}`,
                    background: palette.surface, color: palette.ink, cursor: 'pointer',
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}>
                    <DashIcon kind="caret" size={14} color={palette.ink} /> Cargar más actividad
                  </button>
                )}
              </div>
            ) : (
              <div style={{
                marginTop: 12, paddingLeft: 54,
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkSubtle, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>— fin del historial · marzo 2026 —</div>
            )}
            <style>{`@keyframes act-pulse { 0%,60%,100% { opacity:.3; transform: scale(1) } 30% { opacity:1; transform: scale(1.3) } }`}</style>
          </div>

          {/* Right rail — summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* This week */}
            <div style={{
              background: palette.line, color: palette.bg,
              padding: '18px 20px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                opacity: 0.6, letterSpacing: '0.16em', textTransform: 'uppercase',
                marginBottom: 8,
              }}>esta semana</div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 52, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9,
              }}>{ACT_FEED.flatMap(g => g.items).length}</div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                opacity: 0.65, letterSpacing: '0.06em', marginTop: 6,
              }}>acciones registradas</div>
              <div style={{ marginTop: 16, display: 'flex', gap: 3, height: 28, alignItems: 'flex-end' }}>
                {[2,1,3,4,2,3,4].map((v, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${v/4*100}%`,
                    background: i === 6 ? palette.lime : 'rgba(244,244,239,0.3)',
                  }} />
                ))}
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', marginTop: 5,
                fontFamily: '"JetBrains Mono", monospace', fontSize: 8,
                opacity: 0.5, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
              </div>
            </div>

            {/* Breakdown by kind */}
            <div style={{
              background: palette.surface, border: `1.5px solid ${palette.line}`,
              padding: '16px 18px',
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkDim, letterSpacing: '0.14em', textTransform: 'uppercase',
                marginBottom: 14,
              }}>por tipo</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(ACT_KINDS).map(([k, v]) => {
                  const n = counts[k] || 0;
                  const max = Math.max(...Object.values(counts), 1);
                  return (
                    <div key={k} style={{
                      display: 'grid', gridTemplateColumns: '16px 1fr 20px', gap: 10,
                      alignItems: 'center',
                    }}>
                      <span style={{ width: 14, height: 14, background: v.tint, border: `1px solid ${palette.line}` }} />
                      <div>
                        <div style={{
                          fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 12,
                          fontWeight: 600, color: palette.ink, marginBottom: 3,
                        }}>{v.label}</div>
                        <div style={{ height: 4, background: palette.lineSofter, position: 'relative' }}>
                          <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: `${n/max*100}%`, background: v.tint,
                          }} />
                        </div>
                      </div>
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                        color: palette.inkDim, textAlign: 'right',
                      }}>{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Mobile ──
function ActivityMobile() {
  const [theme, setTheme] = React.useState('light');
  const [filter, setFilter] = React.useState('all');
  const [loaded, setLoaded] = React.useState(false);
  const palette = dashPalettes[theme];

  const feed = loaded ? [...ACT_FEED, ...ACT_FEED_MORE] : ACT_FEED;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: palette.bg, color: palette.ink,
      position: 'relative',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
    }}>
      <div style={{
        position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 100,
      }}>
        {/* header */}
        <div style={{
          paddingTop: 54, paddingLeft: 20, paddingRight: 20, paddingBottom: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: palette.inkDim, marginBottom: 2,
            }}>historial</div>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: palette.ink,
            }}>Actividad</div>
          </div>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        {/* filter scroll */}
        <div style={{
          padding: '0 16px 14px',
          display: 'flex', gap: 6, overflowX: 'auto',
        }}>
          {ACT_FILTERS.map(f => (
            <FilterChip key={f.id} label={f.label} active={filter === f.id}
              onClick={() => setFilter(f.id)} palette={palette} />
          ))}
        </div>

        {/* feed */}
        <div style={{ padding: '0 16px' }}>
          {feed.map((g, gi) => {
            const items = filter === 'all' ? g.items : g.items.filter(i => i.kind === filter);
            if (items.length === 0) return null;
            return (
              <div key={gi} style={{ marginBottom: 6 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 0 10px',
                }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: palette.ink, fontWeight: 600,
                  }}>{g.day}</span>
                  <div style={{ flex: 1, height: 1.5, background: palette.lineSoft }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((item, i) => {
                    const kind = ACT_KINDS[item.kind];
                    return (
                      <div key={i} style={{
                        background: palette.surface, border: `1.5px solid ${palette.line}`,
                        display: 'grid', gridTemplateColumns: '34px 1fr auto', gap: 12,
                        padding: '12px 14px', alignItems: 'flex-start',
                      }}>
                        <div style={{
                          width: 32, height: 32, background: kind.tint,
                          border: `1.5px solid ${palette.line}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: palette.line,
                        }}>
                          <DashIcon kind={kind.glyph} size={15} color={palette.line} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontFamily: '"Space Grotesk", system-ui, sans-serif',
                            fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', color: palette.ink,
                            lineHeight: 1.2,
                          }}>{item.title}</div>
                          <div style={{
                            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                            color: palette.inkDim, marginTop: 3, letterSpacing: '0.02em',
                            display: 'flex', alignItems: 'center', gap: 6,
                          }}>
                            <span style={{ width: 7, height: 7, background: item.color }} />
                            {item.detail || item.goal || kind.label}
                          </div>
                        </div>
                        <div style={{
                          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                          color: palette.inkSubtle, whiteSpace: 'nowrap',
                        }}>{item.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!loaded && (
            <button onClick={() => setLoaded(true)} style={{
              width: '100%', marginTop: 12, padding: '12px',
              border: `1.5px solid ${palette.line}`,
              background: palette.surface, color: palette.ink, cursor: 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13, fontWeight: 600,
            }}>Cargar más</button>
          )}
        </div>
        <div style={{ height: 30 }} />
      </div>
      <DashMobileTabBar palette={palette} active="profile" onChange={() => {}} />
    </div>
  );
}

window.ActivityDesktop = ActivityDesktop;
window.ActivityMobile = ActivityMobile;
