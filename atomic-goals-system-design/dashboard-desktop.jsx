// Dashboard — Desktop layout
// 1440 × 1024. Sidebar nav + main area with hero, summary, charts, lists.

function DashSidebarItem({ item, active, palette, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%',
      display: 'grid', gridTemplateColumns: '8px 1fr auto',
      gap: 12, alignItems: 'center',
      padding: '10px 12px',
      background: active ? palette.line : 'transparent',
      color: active ? palette.bg : palette.ink,
      border: 'none', borderLeft: `2px solid ${active ? palette.line : 'transparent'}`,
      cursor: 'pointer', textAlign: 'left',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
      transition: 'background .12s, color .12s',
    }}>
      <span style={{
        width: 8, height: 8,
        background: active ? palette.lime : palette.lineSoft,
      }} />
      <span>{item.label}</span>
      {item.count !== null && (
        <span style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10, padding: '2px 6px',
          background: active ? 'rgba(244,244,239,0.18)' : palette.lineSofter,
          color: active ? palette.bg : palette.inkDim,
          letterSpacing: '0.04em',
        }}>{item.count}</span>
      )}
    </button>
  );
}

function DashHero({ palette, theme }) {
  return (
    <div style={{
      position: 'relative',
      background: palette.line,
      color: palette.bg,
      padding: '28px 32px',
      overflow: 'hidden',
      border: `1.5px solid ${palette.line}`,
    }}>
      {/* decoration */}
      <div style={{
        position: 'absolute', right: -40, top: -40,
        width: 200, height: 200, background: palette.magenta, opacity: 0.9,
        transform: 'rotate(8deg)',
      }} />
      <div style={{
        position: 'absolute', right: 140, bottom: -20,
        width: 80, height: 80, background: palette.yellow,
      }} />
      <div style={{
        position: 'absolute', right: 50, top: 30,
        width: 36, height: 36, background: palette.lime,
      }} />

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'center' }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            opacity: 0.55, marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ width: 6, height: 6, background: palette.lime, animation: 'dash-pulse 1.8s ease-in-out infinite' }} />
            tu racha · semana actual · jueves 27 may
          </div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 18,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
          }}>
            <div style={{
              fontSize: 128, fontWeight: 700, lineHeight: 0.82,
              letterSpacing: '-0.045em',
            }}>23</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>días seguidos</div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12, opacity: 0.6, marginTop: 4,
                letterSpacing: '0.06em',
              }}>récord personal · 47 días</div>
            </div>
          </div>

          <div style={{ marginTop: 22, maxWidth: 420 }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
              {[1,1,1,1,1,0,0].map((on, i) => (
                <div key={i} style={{
                  flex: 1, height: 14,
                  background: on ? palette.lime : 'rgba(255,255,255,0.18)',
                  transition: 'background .25s',
                }} />
              ))}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.55,
            }}>
              <span>lun</span><span>mar</span><span>mié</span><span>jue</span><span>vie</span><span>sáb</span><span>dom</span>
            </div>
          </div>
        </div>

        {/* Right side — motivational + tiny stats */}
        <div style={{ position: 'relative', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
          <blockquote style={{
            margin: 0,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 19, lineHeight: 1.3, fontWeight: 600, letterSpacing: '-0.005em',
            maxWidth: 320, textWrap: 'pretty',
          }}>
            "Pequeños cambios, resultados extraordinarios."
          </blockquote>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: '0.06em', opacity: 0.6,
          }}>— hábitos atómicos</div>
        </div>
      </div>
      <style>{`@keyframes dash-pulse { 0%, 100% { opacity: 1 } 50% { opacity: .3 } }`}</style>
    </div>
  );
}

function DashCategoriesBlock({ palette }) {
  const total = DASH_CATEGORIES.reduce((s, c) => s + c.goals, 0);
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      padding: '20px 22px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 18,
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: palette.inkDim, marginBottom: 4,
          }}>categorías</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em',
          }}>{total} metas · 6 categorías</div>
        </div>
        <button style={{
          background: 'transparent', border: `1.5px solid ${palette.line}`,
          padding: '6px 10px', cursor: 'pointer', color: palette.ink,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>ver todas →</button>
      </div>

      <DashCategoryStack items={DASH_CATEGORIES} palette={palette} height={18} />

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DASH_CATEGORIES.map(c => (
          <div key={c.name} style={{
            display: 'grid', gridTemplateColumns: '14px 1fr 56px 36px', gap: 12,
            alignItems: 'center',
          }}>
            <div style={{ width: 14, height: 14, background: c.color }} />
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
              textTransform: 'capitalize',
            }}>{c.name}</div>
            <div style={{ height: 4, background: palette.lineSofter, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${c.pct}%`, background: c.color,
              }} />
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              color: palette.inkDim, textAlign: 'right', letterSpacing: '0.04em',
            }}>{c.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashTimelineBlock({ palette }) {
  const [range, setRange] = React.useState('30d');
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      padding: '20px 22px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 16,
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: palette.inkDim, marginBottom: 4,
          }}>progreso · 30 días</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em',
          }}>+ 42 pasos completados <span style={{
            background: palette.lime, padding: '0 6px', fontSize: 14, marginLeft: 6,
          }}>↑ 18%</span></div>
        </div>
        <div style={{
          display: 'inline-flex', border: `1.5px solid ${palette.line}`, overflow: 'hidden',
        }}>
          {[['7d','7d'],['30d','30d'],['90d','90d']].map(([k,l]) => (
            <button key={k} onClick={() => setRange(k)}
              style={{
                padding: '5px 10px', cursor: 'pointer', border: 'none',
                background: range === k ? palette.line : 'transparent',
                color: range === k ? palette.bg : palette.ink,
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                borderRight: k !== '90d' ? `1.5px solid ${palette.line}` : 'none',
              }}>{l}</button>
          ))}
        </div>
      </div>

      <DashTimelineBars data={DASH_TIMELINE} palette={palette} accent={palette.primary} height={120} />

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: palette.inkDim, letterSpacing: '0.06em',
        marginTop: 10,
      }}>
        <span>28 abr</span>
        <span>13 may</span>
        <span>27 may · hoy</span>
      </div>

      <div style={{
        display: 'flex', gap: 18, marginTop: 18,
        paddingTop: 16, borderTop: `1px solid ${palette.lineSofter}`,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        color: palette.inkDim, letterSpacing: '0.04em',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, background: palette.primary }} />
          días activos · 26/30
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, background: palette.lineSofter }} />
          días en blanco · 4
        </div>
        <div style={{ marginLeft: 'auto', color: palette.ink, fontWeight: 600 }}>promedio 1.4 pasos/día</div>
      </div>
    </div>
  );
}

function DashUpcomingBlock({ palette }) {
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      padding: '20px 22px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 8,
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: palette.inkDim, marginBottom: 4,
          }}>esta semana</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em',
          }}>Próximos pasos</div>
        </div>
        <a href="#" style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.primary, letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>todos →</a>
      </div>
      <div>
        {DASH_UPCOMING.map((item, i) => (
          <DashUpcomingRow key={i} item={item} palette={palette} />
        ))}
      </div>
    </div>
  );
}

function DashActivityBlock({ palette }) {
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      padding: '20px 22px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 12,
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: palette.inkDim, marginBottom: 4,
          }}>actividad reciente</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em',
          }}>Últimos 7 días</div>
        </div>
        <a href="#" style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.primary, letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>ver feed →</a>
      </div>
      <div>
        {DASH_ACTIVITY.map((item, i) => (
          <DashActivityRow key={i} item={item} palette={palette} />
        ))}
      </div>
    </div>
  );
}

function DashboardDesktop() {
  const [theme, setTheme] = React.useState('light');
  const [active, setActive] = React.useState('dashboard');
  const palette = dashPalettes[theme];

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '240px 1fr',
      background: palette.bg, color: palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Sidebar */}
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
            <DashSidebarItem key={item.id}
              item={item}
              active={active === item.id}
              palette={palette}
              onClick={() => setActive(item.id)}
            />
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '20px' }}>
          <div style={{
            border: `1.5px solid ${palette.line}`,
            background: palette.surface,
            padding: '14px',
            position: 'relative',
            boxShadow: `4px 4px 0 0 ${palette.lime}`,
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: palette.inkDim, letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: 4,
            }}>cuenta</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, background: palette.magenta,
                border: `1.5px solid ${palette.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontWeight: 700, color: palette.bg, fontSize: 14,
              }}>S</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 13, fontWeight: 600, color: palette.ink,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>Sofía Méndez</div>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10, color: palette.inkDim, letterSpacing: '0.04em',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>sofi@correo.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ overflow: 'auto', padding: '24px 32px 32px' }}>
        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24,
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: palette.inkDim, marginBottom: 4,
            }}>dashboard · jueves 27 may</div>
            <h1 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em',
            }}>¡Hola, <span style={{ color: palette.primary }}>Sofía</span>! <span style={{ fontWeight: 500, color: palette.inkDim }}>vas en racha.</span></h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              position: 'relative', display: 'flex', alignItems: 'center',
              border: `1.5px solid ${palette.line}`,
              background: palette.surface,
              padding: '7px 12px 7px 36px', minWidth: 200,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              color: palette.inkSubtle,
            }}>
              <span style={{ position: 'absolute', left: 12, top: 8, color: palette.inkDim }}>
                <DashIcon kind="search" size={14} />
              </span>
              buscar metas, pasos...
              <span style={{
                marginLeft: 'auto',
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                padding: '1px 5px', background: palette.lineSofter,
                letterSpacing: '0.06em',
              }}>⌘K</span>
            </div>
            <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
            <button style={{
              background: palette.line, color: palette.bg,
              border: 'none', padding: '8px 14px', cursor: 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: `3px 3px 0 0 ${palette.primary}`,
              transition: 'box-shadow .15s, transform .12s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `5px 5px 0 0 ${palette.primary}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `3px 3px 0 0 ${palette.primary}`; }}
            >
              <DashIcon kind="plus" size={12} color={palette.bg} /> Nueva meta
            </button>
            <button aria-label="Notificaciones" style={{
              width: 36, height: 36, border: `1.5px solid ${palette.line}`,
              background: palette.surface, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <DashIcon kind="bell" size={16} color={palette.ink} />
              <span style={{
                position: 'absolute', top: -3, right: -3,
                width: 12, height: 12, background: palette.magenta,
                border: `1.5px solid ${palette.line}`,
              }} />
            </button>
          </div>
        </div>

        {/* Hero */}
        <DashHero palette={palette} theme={theme} />

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          marginTop: 20,
        }}>
          <DashStatCard palette={palette} label="metas activas" value="8" sub="3 esta semana ↑" accent={palette.primary} />
          <DashStatCard palette={palette} label="completadas · mes" value="12" suffix="/ 18" sub="67% del objetivo" accent={palette.lime} />
          <DashStatCard palette={palette} label="pasos · hoy" value="5" suffix="/ 7" sub="2 te quedan por hoy" accent={palette.yellow} />
          <DashStatCard palette={palette} label="récord racha" value="47" suffix="días" sub="superable en 24 días" accent={palette.magenta} intent="inverse" />
        </div>

        {/* Charts row: timeline 2/3 + categories 1/3 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16,
          marginTop: 16,
        }}>
          <DashTimelineBlock palette={palette} />
          <DashCategoriesBlock palette={palette} />
        </div>

        {/* Lists row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16,
          marginTop: 16,
        }}>
          <DashUpcomingBlock palette={palette} />
          <DashActivityBlock palette={palette} />
        </div>
      </main>
    </div>
  );
}

window.DashboardDesktop = DashboardDesktop;
