// Categories — grid, detail, and create/edit form.
// Reuses dashPalettes, DashIcon, DASH_NAV, DashLogo, DashThemeToggle,
// DashMobileTabBar, GoalCard, GOALS_LIST.

// ── Category data (enriched from DASH_CATEGORIES + computed stats) ──
const CATEGORIES = (() => {
  const meta = {
    salud:    { icon: 'heart',     desc: 'Cuerpo en movimiento', },
    estudio:  { icon: 'book',      desc: 'Aprender algo nuevo cada semana', },
    mente:    { icon: 'leaf',      desc: 'Pausas, lectura, calma', },
    trabajo:  { icon: 'briefcase', desc: 'Lo profesional y los entregables', },
    familia:  { icon: 'users',     desc: 'Tiempo para los que importan', },
    finanzas: { icon: 'coin',      desc: 'Ahorrar, invertir, planear', },
  };
  return DASH_CATEGORIES.map(c => {
    const goals = GOALS_LIST.filter(g => g.cat === c.name);
    const avg = goals.length
      ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
      : 0;
    const completed = goals.filter(g => g.status === 'completed').length;
    const active = goals.filter(g => g.status === 'in_progress').length;
    return {
      ...c,
      ...meta[c.name],
      goalCount: goals.length,
      avgProgress: avg,
      completed,
      active,
      goals,
      // 8 weeks of activity (deterministic)
      sparkline: deterministicSpark(c.name),
    };
  });
})();

function deterministicSpark(seedStr) {
  let s = 0;
  for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
  const out = [];
  for (let i = 0; i < 8; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    out.push(0.3 + (s / 4294967295) * 0.7);
  }
  return out;
}

// ── Category icons — small geometric, vibrant style ──
function CatIcon({ kind, size = 22, color = 'currentColor', strokeColor }) {
  const s = size;
  const stroke = strokeColor || color;
  const sw = 1.6;
  const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'square', strokeLinejoin: 'miter' };
  switch (kind) {
    case 'heart': return (
      <svg {...common}>
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>
      </svg>
    );
    case 'book': return (
      <svg {...common}>
        <path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/>
        <path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>
      </svg>
    );
    case 'leaf': return (
      <svg {...common}>
        <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/>
        <path d="M5 19l9-9"/>
      </svg>
    );
    case 'briefcase': return (
      <svg {...common}>
        <rect x="3" y="7" width="18" height="13"/>
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
        <path d="M3 13h18"/>
      </svg>
    );
    case 'users': return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3"/>
        <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5"/>
        <circle cx="17" cy="9" r="2.5"/>
        <path d="M15 20c0-2 1.5-4 4-4"/>
      </svg>
    );
    case 'coin': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8"/>
        <path d="M12 7v10M9.5 10h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>
      </svg>
    );
    default: return null;
  }
}

// ── Mini sparkline (vertical bars) ──
function CatSparkline({ data, color, palette, height = 32 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${v * 100}%`,
          background: color,
          opacity: 0.4 + v * 0.6,
        }} />
      ))}
    </div>
  );
}

// ── Category card (grid) ──
function CategoryCard({ cat, palette, onOpen }) {
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      position: 'relative', overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform .15s, box-shadow .15s',
    }}
    onClick={onOpen}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translate(-3px, -3px)';
      e.currentTarget.style.boxShadow = `6px 6px 0 0 ${cat.color}`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = '';
    }}>
      {/* color hero with icon */}
      <div style={{
        background: cat.color,
        padding: '20px 20px 16px',
        position: 'relative',
        borderBottom: `1.5px solid ${palette.line}`,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 50, height: 50,
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          color: palette.line,
          boxShadow: `3px 3px 0 0 ${palette.line}`,
        }}>
          <CatIcon kind={cat.icon} size={26} color={palette.line} />
        </div>
        {/* decorative shapes */}
        <div style={{
          position: 'absolute', right: -20, top: -10,
          width: 60, height: 60, background: palette.line, opacity: 0.18,
          transform: 'rotate(15deg)',
        }} />
        <div style={{
          position: 'absolute', right: 28, bottom: -8,
          width: 22, height: 22, background: palette.line, opacity: 0.18,
        }} />
      </div>

      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 4,
        }}>
          <h3 style={{
            margin: 0,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em',
            color: palette.ink, textTransform: 'capitalize',
          }}>{cat.name}</h3>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{cat.goalCount} meta{cat.goalCount !== 1 ? 's' : ''}</span>
        </div>
        <p style={{
          margin: 0,
          fontSize: 12, color: palette.inkDim, lineHeight: 1.4,
          minHeight: 32,
        }}>{cat.desc}</p>

        {/* avg progress */}
        <div style={{ marginTop: 14 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 4,
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
              color: palette.inkDim, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>promedio</span>
            <span style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: palette.ink,
            }}>{cat.avgProgress}<span style={{ fontSize: 11, color: palette.inkDim, fontWeight: 500 }}>%</span></span>
          </div>
          <div style={{
            height: 6, background: palette.lineSofter,
            border: `1.5px solid ${palette.line}`, position: 'relative',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${cat.avgProgress}%`, background: cat.color,
            }} />
          </div>
        </div>

        {/* sparkline */}
        <div style={{
          marginTop: 16, paddingTop: 14,
          borderTop: `1px solid ${palette.lineSofter}`,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14,
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
              color: palette.inkDim, letterSpacing: '0.08em', textTransform: 'uppercase',
              lineHeight: 1.3,
            }}>actividad<br/><span style={{ color: palette.ink }}>8 semanas</span></div>
            <div style={{ flex: 1, maxWidth: 110 }}>
              <CatSparkline data={cat.sparkline} color={cat.color} palette={palette} height={28} />
            </div>
          </div>
        </div>

        {/* footer counters */}
        <div style={{
          marginTop: 14, paddingTop: 12,
          borderTop: `1px solid ${palette.lineSofter}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, letterSpacing: '0.04em',
        }}>
          <span>
            {cat.active} activa{cat.active !== 1 ? 's' : ''} · {cat.completed} hecha{cat.completed !== 1 ? 's' : ''}
          </span>
          <span style={{ color: palette.primary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            abrir →
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Create / Edit category form (shown as side sheet on desktop) ──
const CAT_PRESET_COLORS = [
  '#FF3D6E', '#2E5BFF', '#C8FF1F', '#FFB400', '#7C5CFF', '#1FD1F9',
  '#FF8A4C', '#00C896', '#F5446B', '#9D7AFF', '#0E0E0E', '#5F5F5F',
];
const CAT_ICON_OPTIONS = ['heart', 'book', 'leaf', 'briefcase', 'users', 'coin'];

function CategoryFormSheet({ palette, onClose }) {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [color, setColor] = React.useState('#7C5CFF');
  const [icon, setIcon] = React.useState('heart');

  return (
    <div style={{
      width: 380, height: '100%',
      background: palette.surface,
      borderLeft: `1.5px solid ${palette.line}`,
      display: 'flex', flexDirection: 'column',
      boxShadow: `-6px 0 0 0 ${color}`,
    }}>
      <div style={{
        padding: '20px 22px 14px',
        borderBottom: `1.5px solid ${palette.line}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: palette.inkDim, marginBottom: 4,
          }}>nueva</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em',
            color: palette.ink,
          }}>Categoría</div>
        </div>
        <button onClick={onClose} style={{
          width: 28, height: 28, border: `1.5px solid ${palette.line}`,
          background: palette.surface, color: palette.ink, cursor: 'pointer',
          fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700,
          fontSize: 14, lineHeight: 1,
        }}>×</button>
      </div>

      {/* Preview */}
      <div style={{
        margin: '18px 22px',
        background: color, padding: '18px',
        border: `1.5px solid ${palette.line}`,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 44, height: 44,
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `3px 3px 0 0 ${palette.line}`,
          color: palette.line, flexShrink: 0,
        }}>
          <CatIcon kind={icon} size={22} color={palette.line} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em', color: palette.line,
            textTransform: 'capitalize',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{name || 'Nombre de la categoría'}</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.line, opacity: 0.7, letterSpacing: '0.04em',
            marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{desc || 'descripción opcional'}</div>
        </div>
      </div>

      <div style={{
        padding: '6px 22px', flex: 1, overflow: 'auto',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        {/* name */}
        <div>
          <label style={{
            display: 'block', marginBottom: 6,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>nombre</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="ej. lectura"
            style={{
              width: '100%', boxSizing: 'border-box',
              height: 40, padding: '0 12px',
              border: `1.5px solid ${palette.line}`,
              background: palette.bg, color: palette.ink,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14, fontWeight: 500, outline: 'none',
            }}
          />
        </div>

        {/* desc */}
        <div>
          <label style={{
            display: 'block', marginBottom: 6,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>descripción <span style={{ opacity: 0.5 }}>· opcional</span></label>
          <textarea
            value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="¿de qué trata?"
            rows={2}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 12px', minHeight: 64,
              border: `1.5px solid ${palette.line}`,
              background: palette.bg, color: palette.ink,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13, lineHeight: 1.4, outline: 'none', resize: 'none',
            }}
          />
        </div>

        {/* color picker */}
        <div>
          <label style={{
            display: 'block', marginBottom: 8,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>color</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {CAT_PRESET_COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                aria-label={c}
                style={{
                  height: 34, background: c,
                  border: `1.5px solid ${palette.line}`,
                  cursor: 'pointer', position: 'relative',
                  boxShadow: color === c ? `3px 3px 0 0 ${palette.line}` : 'none',
                  transform: color === c ? 'translate(-1px,-1px)' : 'none',
                  transition: 'transform .12s, box-shadow .12s',
                }}>
                {color === c && (
                  <span style={{
                    position: 'absolute', inset: 4, border: `1.5px solid ${palette.line}`,
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* icon picker */}
        <div>
          <label style={{
            display: 'block', marginBottom: 8,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>icono</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {CAT_ICON_OPTIONS.map(k => (
              <button key={k} onClick={() => setIcon(k)}
                aria-label={k}
                style={{
                  height: 40,
                  background: icon === k ? palette.line : palette.bg,
                  color: icon === k ? palette.bg : palette.ink,
                  border: `1.5px solid ${palette.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background .12s, color .12s',
                }}>
                <CatIcon kind={k} size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* footer actions */}
      <div style={{
        padding: '16px 22px',
        borderTop: `1.5px solid ${palette.line}`,
        display: 'flex', gap: 10,
      }}>
        <button onClick={onClose} style={{
          flex: 1, height: 42,
          background: palette.surface, color: palette.ink,
          border: `1.5px solid ${palette.line}`, cursor: 'pointer',
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 13, fontWeight: 600,
        }}>Cancelar</button>
        <button style={{
          flex: 2, height: 42,
          background: palette.line, color: palette.bg,
          border: 'none', cursor: 'pointer',
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em',
          boxShadow: `4px 4px 0 0 ${color}`,
          transition: 'box-shadow .15s, transform .12s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `6px 6px 0 0 ${color}`; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `4px 4px 0 0 ${color}`; }}
        >Crear categoría</button>
      </div>
    </div>
  );
}

// ── Sidebar (shared layout) ──
function CategoriesSidebar({ palette, active }) {
  return (
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
        {DASH_NAV.map(item => {
          const isActive = item.id === active;
          return (
            <div key={item.id} style={{
              width: '100%',
              display: 'grid', gridTemplateColumns: '8px 1fr auto',
              gap: 12, alignItems: 'center',
              padding: '10px 12px',
              background: isActive ? palette.line : 'transparent',
              color: isActive ? palette.bg : palette.ink,
              borderLeft: `2px solid ${isActive ? palette.line : 'transparent'}`,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
            }}>
              <span style={{ width: 8, height: 8, background: isActive ? palette.lime : palette.lineSoft }} />
              <span>{item.label}</span>
              {item.count !== null && <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                padding: '2px 6px',
                background: isActive ? 'rgba(244,244,239,0.18)' : palette.lineSofter,
                color: isActive ? palette.bg : palette.inkDim,
                letterSpacing: '0.04em',
              }}>{item.count}</span>}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

// ── Desktop grid page ──
function CategoriesGridDesktop() {
  const [theme, setTheme] = React.useState('light');
  const [showForm, setShowForm] = React.useState(true);
  const palette = dashPalettes[theme];

  const totalGoals = CATEGORIES.reduce((s, c) => s + c.goalCount, 0);
  const avgAll = Math.round(CATEGORIES.reduce((s, c) => s + c.avgProgress, 0) / CATEGORIES.length);
  const mostActive = [...CATEGORIES].sort((a, b) => b.avgProgress - a.avgProgress)[0];

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: `240px 1fr ${showForm ? '380px' : '0'}`,
      background: palette.bg, color: palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      overflow: 'hidden', position: 'relative',
      transition: 'grid-template-columns .25s',
    }}>
      <CategoriesSidebar palette={palette} active="categories" />

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
            }}>categorías · {CATEGORIES.length} en total</div>
            <h1 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em',
            }}>Organiza tus metas por <span style={{
              background: palette.magenta, color: palette.bg, padding: '0 8px',
            }}>tema</span>.</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
            <button onClick={() => setShowForm(s => !s)} style={{
              background: palette.line, color: palette.bg,
              border: 'none', padding: '10px 16px', cursor: 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: `4px 4px 0 0 ${palette.primary}`,
            }}>
              <DashIcon kind="plus" size={12} color={palette.bg} /> Nueva categoría
            </button>
          </div>
        </div>

        {/* Summary chips */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 12,
          marginBottom: 22,
        }}>
          <div style={{
            background: palette.line, color: palette.bg,
            padding: '16px 18px',
            position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.85,
            }}>{totalGoals}</div>
            <div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                opacity: 0.6, letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>metas en todas las categorías</div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 14, fontWeight: 600, marginTop: 4,
              }}>repartidas en {CATEGORIES.length} áreas</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {CATEGORIES.map(c => (
                <div key={c.name} style={{
                  width: 14, height: 40, background: c.color,
                }} />
              ))}
            </div>
          </div>
          <div style={{
            background: palette.surface, border: `1.5px solid ${palette.line}`,
            padding: '14px 16px',
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: palette.inkDim, letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: 4,
            }}>promedio general</div>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 4,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontWeight: 700, letterSpacing: '-0.03em',
            }}>
              <span style={{ fontSize: 38, color: palette.ink }}>{avgAll}</span>
              <span style={{ fontSize: 14, color: palette.inkDim, fontWeight: 500 }}>%</span>
            </div>
            <div style={{
              height: 5, marginTop: 6,
              background: palette.lineSofter, border: `1px solid ${palette.line}`, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${avgAll}%`, background: palette.lime,
              }} />
            </div>
          </div>
          <div style={{
            background: palette.surface, border: `1.5px solid ${palette.line}`,
            padding: '14px 16px',
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: palette.inkDim, letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: 4,
            }}>en mejor forma</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, background: mostActive.color,
                border: `1.5px solid ${palette.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: palette.line,
              }}>
                <CatIcon kind={mostActive.icon} size={18} color={palette.line} />
              </div>
              <div>
                <div style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
                  color: palette.ink, textTransform: 'capitalize',
                }}>{mostActive.name}</div>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  color: palette.inkDim, letterSpacing: '0.04em',
                }}>{mostActive.avgProgress}% promedio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        }}>
          {CATEGORIES.map(c => (
            <CategoryCard key={c.name} cat={c} palette={palette} />
          ))}
          <button onClick={() => setShowForm(true)} style={{
            border: `1.5px dashed ${palette.lineSoft}`,
            background: 'transparent', color: palette.inkDim, cursor: 'pointer',
            padding: '40px 20px', minHeight: 280,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 14, fontWeight: 600,
            transition: 'border-color .15s, color .15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = palette.line; e.currentTarget.style.color = palette.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = palette.lineSoft; e.currentTarget.style.color = palette.inkDim; }}
          >
            <div style={{
              width: 44, height: 44, border: `1.5px solid currentColor`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, lineHeight: 1,
            }}>+</div>
            Nueva categoría
          </button>
        </div>
      </main>

      {showForm && (
        <CategoryFormSheet palette={palette} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

// ── Category detail (desktop) ──
function CategoriesDetailDesktop() {
  const [theme, setTheme] = React.useState('light');
  const palette = dashPalettes[theme];
  const cat = CATEGORIES.find(c => c.name === 'salud');

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '240px 1fr',
      background: palette.bg, color: palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      <CategoriesSidebar palette={palette} active="categories" />

      <main style={{ overflow: 'auto', padding: '24px 32px 32px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 18,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: palette.inkDim, letterSpacing: '0.08em',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <a href="#" style={{ color: palette.inkDim, textDecoration: 'none' }}>categorías</a>
            <span>/</span>
            <span style={{ color: palette.ink, textTransform: 'capitalize' }}>{cat.name}</span>
          </div>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        {/* Big hero */}
        <div style={{
          background: cat.color,
          border: `1.5px solid ${palette.line}`,
          padding: '32px 32px 28px',
          position: 'relative', overflow: 'hidden',
          marginBottom: 22,
          boxShadow: `6px 6px 0 0 ${palette.line}`,
        }}>
          {/* deco */}
          <div style={{
            position: 'absolute', right: -30, top: -40,
            width: 160, height: 160, background: palette.line, opacity: 0.16,
            transform: 'rotate(12deg)',
          }} />
          <div style={{
            position: 'absolute', right: 80, bottom: -20,
            width: 50, height: 50, background: palette.line, opacity: 0.16,
          }} />

          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{
              width: 72, height: 72,
              background: palette.surface,
              border: `1.5px solid ${palette.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `4px 4px 0 0 ${palette.line}`, flexShrink: 0,
              color: palette.line,
            }}>
              <CatIcon kind={cat.icon} size={36} color={palette.line} />
            </div>
            <div style={{ flex: 1, color: palette.line }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                opacity: 0.7, marginBottom: 6,
              }}>categoría</div>
              <h1 style={{
                margin: 0,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.95,
                textTransform: 'capitalize',
              }}>{cat.name}</h1>
              <p style={{
                margin: '10px 0 0', fontSize: 15, lineHeight: 1.4, maxWidth: 460,
                opacity: 0.85,
              }}>{cat.desc}</p>
            </div>
            <div style={{ textAlign: 'right', color: palette.line }}>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 88, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.85,
              }}>{cat.avgProgress}<span style={{ fontSize: 28, opacity: 0.7 }}>%</span></div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                letterSpacing: '0.06em', opacity: 0.75, marginTop: 4,
              }}>promedio de la categoría</div>
              <div style={{
                marginTop: 10, display: 'flex', gap: 8, justifyContent: 'flex-end',
              }}>
                <button style={{
                  padding: '6px 10px',
                  background: palette.surface, color: palette.line,
                  border: `1.5px solid ${palette.line}`, cursor: 'pointer',
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>editar</button>
                <button style={{
                  padding: '6px 10px',
                  background: palette.line, color: palette.bg,
                  border: 'none', cursor: 'pointer',
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>+ meta</button>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
          marginBottom: 22,
        }}>
          {[
            { label: 'metas totales', value: cat.goalCount },
            { label: 'en curso', value: cat.active },
            { label: 'completadas', value: cat.completed },
            { label: 'actividad · 8 sem', value: '', spark: true },
          ].map((s, i) => (
            <div key={i} style={{
              background: palette.surface, border: `1.5px solid ${palette.line}`,
              padding: '12px 14px',
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkDim, letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: 6,
              }}>{s.label}</div>
              {s.spark
                ? <CatSparkline data={cat.sparkline} color={cat.color} palette={palette} height={28} />
                : <div style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em',
                    color: palette.ink, lineHeight: 1,
                  }}>{s.value}</div>
              }
            </div>
          ))}
        </div>

        {/* Goals in this category */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 14,
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: palette.inkDim, letterSpacing: '0.16em', textTransform: 'uppercase',
              marginBottom: 4,
            }}>metas en esta categoría</div>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em',
            }}>{cat.goalCount} meta{cat.goalCount !== 1 ? 's' : ''}</div>
          </div>
          <a href="#" style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.primary, letterSpacing: '0.08em', textTransform: 'uppercase',
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}>ver en /metas →</a>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        }}>
          {cat.goals.map(g => (
            <GoalCard key={g.id} goal={g} palette={palette} />
          ))}
        </div>
      </main>
    </div>
  );
}

// ── Mobile grid ──
function CategoriesGridMobile() {
  const [theme, setTheme] = React.useState('light');
  const palette = dashPalettes[theme];

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
        <div style={{
          paddingTop: 54, paddingLeft: 20, paddingRight: 20, paddingBottom: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: palette.inkDim, marginBottom: 2,
            }}>{CATEGORIES.length} categorías</div>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: palette.ink,
            }}>Tus áreas</div>
          </div>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        {/* Big "+" call to action at the top */}
        <div style={{ padding: '0 16px 14px' }}>
          <button style={{
            width: '100%',
            background: palette.line, color: palette.bg,
            border: 'none', padding: '12px 14px', cursor: 'pointer',
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: `4px 4px 0 0 ${palette.primary}`,
          }}>
            <DashIcon kind="plus" size={12} color={palette.bg} /> Nueva categoría
          </button>
        </div>

        {/* Single-column big cards */}
        <div style={{
          padding: '0 16px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {CATEGORIES.map(c => (
            <div key={c.name} style={{
              background: palette.surface,
              border: `1.5px solid ${palette.line}`,
              position: 'relative', overflow: 'hidden',
              display: 'grid', gridTemplateColumns: '76px 1fr',
            }}>
              {/* color block w/ icon */}
              <div style={{
                background: c.color,
                borderRight: `1.5px solid ${palette.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: palette.line, position: 'relative',
              }}>
                <CatIcon kind={c.icon} size={28} color={palette.line} />
              </div>
              {/* body */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                }}>
                  <div style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em',
                    color: palette.ink, textTransform: 'capitalize',
                  }}>{c.name}</div>
                  <div style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
                    color: palette.ink,
                  }}>{c.avgProgress}<span style={{ fontSize: 10, color: palette.inkDim, fontWeight: 500 }}>%</span></div>
                </div>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  color: palette.inkDim, letterSpacing: '0.04em',
                  marginTop: 2,
                }}>{c.goalCount} meta{c.goalCount !== 1 ? 's' : ''} · {c.active} activa{c.active !== 1 ? 's' : ''}</div>
                <div style={{
                  marginTop: 8, height: 5,
                  background: palette.lineSofter,
                  border: `1px solid ${palette.line}`, position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${c.avgProgress}%`, background: c.color,
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 30 }} />
      </div>
      <DashMobileTabBar palette={palette} active="profile" onChange={() => {}} />
    </div>
  );
}

window.CategoriesGridDesktop = CategoriesGridDesktop;
window.CategoriesDetailDesktop = CategoriesDetailDesktop;
window.CategoriesGridMobile = CategoriesGridMobile;
window.CategoryFormSheet = CategoryFormSheet;
