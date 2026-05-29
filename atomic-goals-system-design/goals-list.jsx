// Goals list — desktop + mobile. Both in this file to share filter logic.

const GOAL_VIEW_MODES = ['grid', 'list'];

function GoalCard({ goal, palette, compact }) {
  const isCompleted = goal.status === 'completed';
  const isPaused = goal.status === 'paused';
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      position: 'relative', overflow: 'hidden',
      transition: 'transform .15s, box-shadow .15s',
      cursor: 'pointer',
      opacity: isPaused ? 0.75 : 1,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translate(-2px, -2px)';
      e.currentTarget.style.boxShadow = `4px 4px 0 0 ${goal.color}`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = '';
    }}>
      {/* category color strip */}
      <div style={{
        height: 8, background: goal.color, borderBottom: `1.5px solid ${palette.line}`,
      }} />

      <div style={{ padding: compact ? '14px 14px 12px' : '18px 18px 16px' }}>
        {/* top row: category + status */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: palette.inkDim,
          }}>
            <span style={{ width: 8, height: 8, background: goal.color }} />
            {goal.cat} · {TYPE_LABEL[goal.type]}{goal.period ? ` · ${goal.period}` : ''}
          </div>
          <button aria-label="Más acciones" style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: palette.inkDim, padding: 2,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 14,
          }}>···</button>
        </div>

        {/* title */}
        <h3 style={{
          margin: 0,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: compact ? 16 : 18, fontWeight: 700, letterSpacing: '-0.015em',
          color: palette.ink, lineHeight: 1.2,
          textDecoration: isCompleted ? 'line-through' : 'none',
        }}>{goal.name}</h3>

        {/* next step */}
        {goal.next && (
          <div style={{
            marginTop: 8,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            color: palette.inkDim, letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center', gap: 6,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            <span style={{ color: palette.primary }}>→</span>
            {goal.next}
          </div>
        )}

        {/* progress */}
        <div style={{ marginTop: 14 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 6,
          }}>
            <span style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: palette.ink,
            }}>{goal.progress}<span style={{ fontSize: 12, color: palette.inkDim, fontWeight: 500 }}>%</span></span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: palette.inkDim, letterSpacing: '0.04em',
            }}>{goal.stepsDone}/{goal.stepsTotal} pasos</span>
          </div>
          <div style={{
            height: 8, background: palette.lineSofter,
            border: `1.5px solid ${palette.line}`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${goal.progress}%`,
              background: isCompleted ? palette.lime : goal.color,
              transition: 'width .25s',
            }} />
          </div>
        </div>

        {/* footer: dates + status */}
        <div style={{
          marginTop: 14, paddingTop: 12,
          borderTop: `1px solid ${palette.lineSofter}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, letterSpacing: '0.06em',
        }}>
          <span>{goal.startDate} → {goal.endDate}</span>
          <span style={{
            padding: '2px 6px',
            background: isCompleted ? palette.lime
                       : isPaused ? palette.lineSofter
                       : palette.surface,
            border: `1px solid ${isCompleted ? palette.line : palette.lineSoft}`,
            color: isCompleted ? palette.line : palette.inkDim,
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>{STATUS_LABEL[goal.status]}</span>
        </div>
      </div>
    </div>
  );
}

function GoalRow({ goal, palette }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '6px 1.6fr 130px 1fr 90px 36px',
      gap: 16, alignItems: 'center',
      padding: '14px 16px 14px 0',
      borderBottom: `1px solid ${palette.lineSofter}`,
      background: palette.surface,
      cursor: 'pointer',
      transition: 'background .12s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = palette.surface2; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = palette.surface; }}>
      <div style={{ alignSelf: 'stretch', background: goal.color }} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em',
          color: palette.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{goal.name}</div>
        {goal.next && <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: palette.inkDim, marginTop: 2, letterSpacing: '0.02em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>→ {goal.next}</div>}
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 10, height: 10, background: goal.color }} />
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: palette.ink, letterSpacing: '0.04em', textTransform: 'capitalize',
        }}>{goal.cat}</span>
      </div>
      <div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 4,
        }}>
          <span style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 13, fontWeight: 700, color: palette.ink,
          }}>{goal.progress}<span style={{ color: palette.inkDim, fontWeight: 500 }}>%</span></span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.04em',
          }}>{goal.stepsDone}/{goal.stepsTotal}</span>
        </div>
        <div style={{ height: 5, background: palette.lineSofter, position: 'relative', border: `1px solid ${palette.line}` }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${goal.progress}%`, background: goal.color,
          }} />
        </div>
      </div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: palette.inkDim, letterSpacing: '0.04em', textAlign: 'center',
        textTransform: 'uppercase',
      }}>{STATUS_LABEL[goal.status]}</div>
      <button aria-label="Más acciones" style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: palette.inkDim, padding: 4,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 14,
      }}>···</button>
    </div>
  );
}

// ── Filter primitives ────────────────────────────────────

function FilterChip({ label, active, color, onClick, palette, count }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 10px',
      border: `1.5px solid ${palette.line}`,
      background: active ? palette.line : palette.surface,
      color: active ? palette.bg : palette.ink,
      cursor: 'pointer',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      fontSize: 12, fontWeight: 600, letterSpacing: '-0.005em',
      transition: 'background .12s, color .12s',
    }}>
      {color && <span style={{ width: 8, height: 8, background: color }} />}
      {label}
      {count !== undefined && (
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          padding: '1px 5px',
          background: active ? 'rgba(244,244,239,0.2)' : palette.lineSofter,
          color: active ? palette.bg : palette.inkDim,
          letterSpacing: '0.04em',
        }}>{count}</span>
      )}
    </button>
  );
}

function useGoalFilters() {
  const [category, setCategory] = React.useState('all'); // 'all' | name
  const [type, setType] = React.useState('all'); // 'all' | 'concl' | 'cyclic'
  const [status, setStatus] = React.useState('active'); // 'all' | 'active' (in_progress + paused) | 'completed'
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState('grid');

  const filtered = React.useMemo(() => {
    return GOALS_LIST.filter(g => {
      if (category !== 'all' && g.cat !== category) return false;
      if (type !== 'all' && g.type !== type) return false;
      if (status === 'completed' && g.status !== 'completed') return false;
      if (status === 'active' && g.status === 'completed') return false;
      if (query && !g.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [category, type, status, query]);

  return {
    category, setCategory,
    type, setType,
    status, setStatus,
    query, setQuery,
    view, setView,
    filtered,
  };
}

// ── DESKTOP ──────────────────────────────────────────────

function GoalsListDesktop() {
  const [theme, setTheme] = React.useState('light');
  const [active, setActive] = React.useState('goals');
  const palette = dashPalettes[theme];
  const f = useGoalFilters();

  const total = GOALS_LIST.length;
  const counts = {
    active: GOALS_LIST.filter(g => g.status !== 'completed').length,
    completed: GOALS_LIST.filter(g => g.status === 'completed').length,
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '240px 1fr',
      background: palette.bg, color: palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Sidebar — reuse dashboard pattern */}
      <aside style={{
        background: palette.bg,
        borderRight: `1.5px solid ${palette.line}`,
        padding: '24px 0',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '0 20px 24px' }}>
          <DashLogo ink={palette.line} accent={palette.lime} small />
        </div>
        <div style={{
          padding: '0 20px 12px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: palette.inkSubtle,
        }}>navegación</div>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {DASH_NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: '100%',
              display: 'grid', gridTemplateColumns: '8px 1fr auto',
              gap: 12, alignItems: 'center',
              padding: '10px 12px',
              background: active === item.id ? palette.line : 'transparent',
              color: active === item.id ? palette.bg : palette.ink,
              border: 'none',
              borderLeft: `2px solid ${active === item.id ? palette.line : 'transparent'}`,
              cursor: 'pointer', textAlign: 'left',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
            }}>
              <span style={{ width: 8, height: 8, background: active === item.id ? palette.lime : palette.lineSoft }} />
              <span>{item.label}</span>
              {item.count !== null && <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                padding: '2px 6px',
                background: active === item.id ? 'rgba(244,244,239,0.18)' : palette.lineSofter,
                color: active === item.id ? palette.bg : palette.inkDim,
                letterSpacing: '0.04em',
              }}>{item.count}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
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
            }}>metas · {f.filtered.length} de {total}</div>
            <h1 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em',
            }}>Tus <span style={{
              background: palette.lime, padding: '0 8px',
              fontStyle: 'italic',
            }}>metas</span> · esta es la lista.</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
            <button style={{
              background: palette.line, color: palette.bg,
              border: 'none', padding: '10px 16px', cursor: 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: `4px 4px 0 0 ${palette.primary}`,
              transition: 'box-shadow .15s, transform .12s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `6px 6px 0 0 ${palette.primary}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `4px 4px 0 0 ${palette.primary}`; }}
            >
              <DashIcon kind="plus" size={12} color={palette.bg} /> Nueva meta
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 12,
          marginBottom: 18,
        }}>
          {/* row 1 — search + view */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              position: 'relative', flex: 1, maxWidth: 360,
              display: 'flex', alignItems: 'center',
              border: `1.5px solid ${palette.line}`,
              background: palette.bg,
              padding: '7px 12px 7px 36px',
            }}>
              <span style={{ position: 'absolute', left: 12, top: 8, color: palette.inkDim }}>
                <DashIcon kind="search" size={14} />
              </span>
              <input
                value={f.query}
                onChange={(e) => f.setQuery(e.target.value)}
                placeholder="buscar metas..."
                style={{
                  width: '100%', border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 13, color: palette.ink, padding: 0,
                }}
              />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkDim, letterSpacing: '0.08em',
                textTransform: 'uppercase', marginRight: 4,
              }}>estado</span>
              {[['active','Activas', counts.active], ['completed','Completadas', counts.completed], ['all','Todas', total]].map(([k,l,c]) => (
                <FilterChip key={k}
                  label={l} active={f.status === k}
                  onClick={() => f.setStatus(k)}
                  palette={palette} count={c}
                />
              ))}
            </div>

            <div style={{
              display: 'inline-flex',
              border: `1.5px solid ${palette.line}`,
              overflow: 'hidden', marginLeft: 4,
            }}>
              {[['grid','grid'],['list','lista']].map(([k,l]) => (
                <button key={k} onClick={() => f.setView(k)} style={{
                  padding: '7px 10px', border: 'none', cursor: 'pointer',
                  background: f.view === k ? palette.line : 'transparent',
                  color: f.view === k ? palette.bg : palette.ink,
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  borderRight: k === 'grid' ? `1.5px solid ${palette.line}` : 'none',
                }}>{l}</button>
              ))}
            </div>
          </div>

          {/* row 2 — categories + type */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkDim, letterSpacing: '0.08em',
                textTransform: 'uppercase', marginRight: 4,
              }}>categoría</span>
              <FilterChip label="todas" active={f.category === 'all'} onClick={() => f.setCategory('all')} palette={palette} />
              {DASH_CATEGORIES.map(c => (
                <FilterChip key={c.name}
                  label={c.name} color={c.color}
                  active={f.category === c.name}
                  onClick={() => f.setCategory(c.name)}
                  palette={palette}
                />
              ))}
            </div>

            <div style={{
              width: 1, height: 22, background: palette.lineSoft, marginLeft: 'auto',
            }} />

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkDim, letterSpacing: '0.08em',
                textTransform: 'uppercase', marginRight: 4,
              }}>tipo</span>
              {[['all','Todas'],['concl','Conclusiva'],['cyclic','Cíclica']].map(([k,l]) => (
                <FilterChip key={k}
                  label={l} active={f.type === k}
                  onClick={() => f.setType(k)}
                  palette={palette}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Active filters note */}
        {(f.category !== 'all' || f.type !== 'all' || f.query) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            color: palette.inkDim, letterSpacing: '0.04em',
          }}>
            mostrando {f.filtered.length} meta{f.filtered.length !== 1 ? 's' : ''}
            <button onClick={() => { f.setCategory('all'); f.setType('all'); f.setQuery(''); }}
              style={{
                background: 'transparent', border: `1px solid ${palette.lineSoft}`,
                color: palette.primary, padding: '2px 8px', cursor: 'pointer',
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>limpiar filtros</button>
          </div>
        )}

        {/* Goals grid / list */}
        {f.view === 'grid' ? (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
          }}>
            {f.filtered.map(g => <GoalCard key={g.id} goal={g} palette={palette} />)}
            {/* New goal placeholder card */}
            <button style={{
              border: `1.5px dashed ${palette.lineSoft}`,
              background: 'transparent', color: palette.inkDim, cursor: 'pointer',
              padding: '40px 20px', minHeight: 200,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14, fontWeight: 600,
              transition: 'border-color .15s, color .15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = palette.line; e.currentTarget.style.color = palette.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = palette.lineSoft; e.currentTarget.style.color = palette.inkDim; }}
            >
              <div style={{
                width: 36, height: 36, border: `1.5px solid currentColor`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700,
              }}>+</div>
              Nueva meta
            </button>
          </div>
        ) : (
          <div style={{
            background: palette.surface,
            border: `1.5px solid ${palette.line}`,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '6px 1.6fr 130px 1fr 90px 36px',
              gap: 16, alignItems: 'center',
              padding: '10px 16px 10px 0',
              borderBottom: `1.5px solid ${palette.line}`,
              background: palette.surface2,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: palette.inkDim, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <div />
              <div>meta · siguiente paso</div>
              <div>categoría</div>
              <div>progreso</div>
              <div style={{ textAlign: 'center' }}>estado</div>
              <div />
            </div>
            {f.filtered.map(g => <GoalRow key={g.id} goal={g} palette={palette} />)}
          </div>
        )}
      </main>
    </div>
  );
}

// ── MOBILE ───────────────────────────────────────────────

function GoalsListMobile() {
  const [theme, setTheme] = React.useState('light');
  const palette = dashPalettes[theme];
  const f = useGoalFilters();

  return (
    <div style={{
      width: '100%', height: '100%',
      background: palette.bg, color: palette.ink,
      position: 'relative',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'auto',
        paddingBottom: 100,
      }}>
        {/* Header */}
        <div style={{
          paddingTop: 54, paddingLeft: 20, paddingRight: 20, paddingBottom: 12,
          background: palette.bg,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: 10,
          }}>
            <div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: palette.inkDim, marginBottom: 2,
              }}>{f.filtered.length} de {GOALS_LIST.length}</div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: palette.ink,
              }}>Tus metas</div>
            </div>
            <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
          </div>

          {/* search */}
          <div style={{
            position: 'relative',
            display: 'flex', alignItems: 'center',
            border: `1.5px solid ${palette.line}`,
            background: palette.surface,
            padding: '8px 12px 8px 32px',
          }}>
            <span style={{ position: 'absolute', left: 10, top: 9, color: palette.inkDim }}>
              <DashIcon kind="search" size={13} />
            </span>
            <input
              value={f.query}
              onChange={(e) => f.setQuery(e.target.value)}
              placeholder="buscar metas..."
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 13, color: palette.ink, padding: 0,
              }}
            />
          </div>
        </div>

        {/* Filters horizontal scroll */}
        <div style={{
          padding: '4px 16px 12px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{
            display: 'flex', gap: 6, overflowX: 'auto',
            paddingBottom: 2,
            scrollbarWidth: 'none',
          }}>
            {[['active','Activas'], ['completed','Completadas'], ['all','Todas']].map(([k,l]) => (
              <FilterChip key={k}
                label={l} active={f.status === k}
                onClick={() => f.setStatus(k)}
                palette={palette}
              />
            ))}
            <span style={{ width: 1, alignSelf: 'stretch', background: palette.lineSoft, margin: '2px 4px' }} />
            <FilterChip label="todas categorías" active={f.category === 'all'} onClick={() => f.setCategory('all')} palette={palette} />
            {DASH_CATEGORIES.map(c => (
              <FilterChip key={c.name}
                label={c.name} color={c.color}
                active={f.category === c.name}
                onClick={() => f.setCategory(c.name)}
                palette={palette}
              />
            ))}
          </div>
        </div>

        {/* Cards */}
        <div style={{
          padding: '0 16px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {f.filtered.map(g => <GoalCard key={g.id} goal={g} palette={palette} compact />)}
          {f.filtered.length === 0 && (
            <div style={{
              padding: 30, textAlign: 'center',
              border: `1.5px dashed ${palette.lineSoft}`,
              color: palette.inkDim,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13,
            }}>nada por aquí · prueba otros filtros</div>
          )}
        </div>

        <div style={{ height: 30 }} />
      </div>

      {/* Tab bar — reuse the same shape as dashboard mobile */}
      <DashMobileTabBar palette={palette} active={'goals'} onChange={() => {}} />
    </div>
  );
}

window.GoalsListDesktop = GoalsListDesktop;
window.GoalsListMobile = GoalsListMobile;
window.GoalCard = GoalCard;
window.useGoalFilters = useGoalFilters;
