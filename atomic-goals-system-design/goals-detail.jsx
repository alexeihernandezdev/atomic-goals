// Goal detail — desktop + mobile.
// Picks goal g1 (Correr 5km) and shows the 4 step types interactively.

const DETAIL_GOAL = GOALS_LIST.find(g => g.id === 'g1');

// ── DESKTOP ──────────────────────────────────────────────

function GoalsDetailDesktop() {
  const [theme, setTheme] = React.useState('light');
  const [tab, setTab] = React.useState('steps');
  const palette = dashPalettes[theme];
  const goal = DETAIL_GOAL;

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
          {DASH_NAV.map(item => {
            const active = item.id === 'goals';
            return (
              <div key={item.id} style={{
                width: '100%',
                display: 'grid', gridTemplateColumns: '8px 1fr auto',
                gap: 12, alignItems: 'center',
                padding: '10px 12px',
                background: active ? palette.line : 'transparent',
                color: active ? palette.bg : palette.ink,
                borderLeft: `2px solid ${active ? palette.line : 'transparent'}`,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
              }}>
                <span style={{ width: 8, height: 8, background: active ? palette.lime : palette.lineSoft }} />
                <span>{item.label}</span>
                {item.count !== null && <span style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  padding: '2px 6px',
                  background: active ? 'rgba(244,244,239,0.18)' : palette.lineSofter,
                  color: active ? palette.bg : palette.inkDim,
                  letterSpacing: '0.04em',
                }}>{item.count}</span>}
              </div>
            );
          })}
        </nav>
      </aside>

      <main style={{ overflow: 'auto', padding: '24px 32px 32px' }}>
        {/* Breadcrumbs + theme */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 18,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: palette.inkDim, letterSpacing: '0.08em',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <a href="#" style={{ color: palette.inkDim, textDecoration: 'none' }}>metas</a>
            <span>/</span>
            <span style={{ color: palette.ink }}>{goal.name}</span>
          </div>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        {/* Hero card */}
        <div style={{
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          position: 'relative', overflow: 'hidden',
          marginBottom: 20,
          boxShadow: `6px 6px 0 0 ${goal.color}`,
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: 8,
            background: goal.color, borderBottom: `1.5px solid ${palette.line}`,
          }} />

          <div style={{ padding: '32px 28px 22px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: palette.inkDim,
              }}>
                <span style={{ width: 10, height: 10, background: goal.color }} />
                <span>{goal.cat}</span>
                <span>·</span>
                <span>{TYPE_LABEL[goal.type]}</span>
                <span style={{
                  marginLeft: 4, padding: '2px 8px',
                  background: palette.lineSofter, color: palette.ink,
                }}>{STATUS_LABEL[goal.status]}</span>
              </div>
              <h1 style={{
                margin: 0,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 44, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.0,
                color: palette.ink, textWrap: 'pretty',
              }}>{goal.name}</h1>
              <p style={{
                margin: '14px 0 0',
                fontSize: 14, lineHeight: 1.5, color: palette.inkDim, maxWidth: 460,
              }}>{goal.description}</p>

              <div style={{
                marginTop: 22, display: 'flex', gap: 22,
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                color: palette.inkDim, letterSpacing: '0.06em',
              }}>
                <div>
                  <div style={{ textTransform: 'uppercase', opacity: 0.6 }}>inicio</div>
                  <div style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14, fontWeight: 700, color: palette.ink, marginTop: 2,
                  }}>{goal.startDate}</div>
                </div>
                <div>
                  <div style={{ textTransform: 'uppercase', opacity: 0.6 }}>fin</div>
                  <div style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14, fontWeight: 700, color: palette.ink, marginTop: 2,
                  }}>{goal.endDate}</div>
                </div>
                <div>
                  <div style={{ textTransform: 'uppercase', opacity: 0.6 }}>pasos</div>
                  <div style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14, fontWeight: 700, color: palette.ink, marginTop: 2,
                  }}>{goal.stepsDone}/{goal.stepsTotal}</div>
                </div>
                <div>
                  <div style={{ textTransform: 'uppercase', opacity: 0.6 }}>dedicación</div>
                  <div style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14, fontWeight: 700, color: palette.ink, marginTop: 2,
                  }}>30 min / día</div>
                </div>
              </div>
            </div>

            {/* progress big */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-end', justifyContent: 'center',
              padding: '0 8px',
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkDim, letterSpacing: '0.16em', textTransform: 'uppercase',
                marginBottom: 6,
              }}>progreso · calculado por pesos</div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 112, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 0.85,
                color: palette.ink,
              }}>{goal.progress}<span style={{ fontSize: 36, color: palette.inkDim }}>%</span></div>
              <div style={{
                width: '100%', height: 16, marginTop: 12,
                border: `1.5px solid ${palette.line}`,
                background: palette.lineSofter, position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${goal.progress}%`, background: goal.color,
                  transition: 'width .3s',
                }} />
              </div>
              <div style={{
                marginTop: 14, display: 'flex', gap: 8, alignSelf: 'stretch',
              }}>
                <button style={{
                  flex: 1, padding: '10px 12px',
                  border: `1.5px solid ${palette.line}`, background: palette.surface,
                  color: palette.ink, cursor: 'pointer',
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em',
                }}>Editar</button>
                <button style={{
                  flex: 1, padding: '10px 12px',
                  border: `1.5px solid ${palette.line}`, background: palette.line,
                  color: palette.bg, cursor: 'pointer',
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em',
                }}>Marcar paso →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1.5px solid ${palette.line}`,
          marginBottom: 18,
        }}>
          {[['steps','Pasos · 6'], ['history','Histórico · 2'], ['settings','Configuración']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '10px 18px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === k ? `3px solid ${goal.color}` : '3px solid transparent',
              marginBottom: -1.5,
              cursor: 'pointer', color: tab === k ? palette.ink : palette.inkDim,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em',
              transition: 'color .12s, border-color .12s',
            }}>{l}</button>
          ))}
        </div>

        {tab === 'steps' && (
          <div>
            {/* Steps header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 14,
            }}>
              <div>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  color: palette.inkDim, letterSpacing: '0.16em', textTransform: 'uppercase',
                  marginBottom: 4,
                }}>pasos · arrástralos para reordenar</div>
                <div style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em',
                }}>4 tipos de paso, todos editables</div>
              </div>
              <button style={{
                background: palette.line, color: palette.bg,
                border: 'none', padding: '8px 14px', cursor: 'pointer',
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: `3px 3px 0 0 ${goal.color}`,
              }}>
                <DashIcon kind="plus" size={12} color={palette.bg} /> Añadir paso
              </button>
            </div>

            {/* Step type legend */}
            <div style={{
              display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap',
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {[
                ['barra', palette.primary, 'numérico → meta'],
                ['check', palette.lime, 'hecho o no'],
                ['estados', palette.magenta, 'múltiples niveles'],
                ['contador', palette.yellow, 'sumar / restar'],
              ].map(([t, c, d]) => (
                <span key={t} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '4px 8px',
                  border: `1px solid ${palette.lineSoft}`,
                  color: palette.inkDim,
                }}>
                  <span style={{ width: 8, height: 8, background: c }} />
                  {t}
                  <span style={{ opacity: 0.6, textTransform: 'lowercase', letterSpacing: '0.02em' }}>· {d}</span>
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DETAIL_STEPS.map(s => (
                <div key={s.id}>{renderStep(s, palette, goal.color)}</div>
              ))}

              <button style={{
                marginTop: 6,
                padding: '14px 16px',
                border: `1.5px dashed ${palette.lineSoft}`,
                background: 'transparent', color: palette.inkDim, cursor: 'pointer',
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 13, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>+</span> Añadir otro paso
              </button>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div style={{
            padding: 40, textAlign: 'center',
            background: palette.surface, border: `1.5px solid ${palette.line}`,
            color: palette.inkDim,
          }}>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 16, fontWeight: 700, marginBottom: 6, color: palette.ink,
            }}>Histórico de instancias</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              letterSpacing: '0.04em',
            }}>aplica solo a metas cíclicas · esta es conclusiva</div>
          </div>
        )}

        {tab === 'settings' && (
          <div style={{
            padding: 40, textAlign: 'center',
            background: palette.surface, border: `1.5px solid ${palette.line}`,
            color: palette.inkDim,
          }}>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 16, fontWeight: 700, marginBottom: 6, color: palette.ink,
            }}>Configuración de la meta</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              letterSpacing: '0.04em',
            }}>nombre, categoría, fechas, archivar...</div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── MOBILE ───────────────────────────────────────────────

function GoalsDetailMobile() {
  const [theme, setTheme] = React.useState('light');
  const [tab, setTab] = React.useState('steps');
  const palette = dashPalettes[theme];
  const goal = DETAIL_GOAL;

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
        {/* Mini top — back + theme */}
        <div style={{
          paddingTop: 54, paddingLeft: 16, paddingRight: 16, paddingBottom: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: palette.bg,
        }}>
          <button style={{
            border: `1.5px solid ${palette.line}`,
            background: palette.surface, color: palette.ink, cursor: 'pointer',
            padding: '5px 10px',
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>← metas</button>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        {/* Hero */}
        <div style={{
          margin: '4px 16px 0',
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          position: 'relative', overflow: 'hidden',
          boxShadow: `4px 4px 0 0 ${goal.color}`,
        }}>
          <div style={{ height: 6, background: goal.color, borderBottom: `1.5px solid ${palette.line}` }} />
          <div style={{ padding: '16px 16px 14px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: palette.inkDim,
            }}>
              <span style={{ width: 8, height: 8, background: goal.color }} />
              {goal.cat} · {TYPE_LABEL[goal.type]}
              <span style={{ padding: '1px 6px', background: palette.lineSofter, color: palette.ink, marginLeft: 4 }}>
                {STATUS_LABEL[goal.status]}
              </span>
            </div>
            <h1 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: palette.ink, textWrap: 'pretty',
            }}>{goal.name}</h1>

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 48, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.85,
                color: palette.ink,
              }}>{goal.progress}<span style={{ fontSize: 18, color: palette.inkDim }}>%</span></span>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkDim, letterSpacing: '0.06em',
              }}>{goal.stepsDone}/{goal.stepsTotal} pasos<br/>{goal.startDate} → {goal.endDate}</span>
            </div>
            <div style={{
              marginTop: 8, height: 10,
              border: `1.5px solid ${palette.line}`,
              background: palette.lineSofter, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${goal.progress}%`, background: goal.color,
                transition: 'width .3s',
              }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          margin: '18px 16px 12px',
          display: 'flex',
          borderBottom: `1.5px solid ${palette.line}`,
        }}>
          {[['steps','Pasos 6'], ['history','Histórico'], ['settings','Config.']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === k ? `3px solid ${goal.color}` : '3px solid transparent',
              marginBottom: -1.5,
              cursor: 'pointer', color: tab === k ? palette.ink : palette.inkDim,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 12, fontWeight: 700, letterSpacing: '-0.005em',
            }}>{l}</button>
          ))}
        </div>

        {/* Steps */}
        {tab === 'steps' && (
          <div style={{
            padding: '0 16px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {DETAIL_STEPS.map(s => (
              <div key={s.id}>{renderStep(s, palette, goal.color)}</div>
            ))}
            <button style={{
              padding: '12px 14px',
              border: `1.5px dashed ${palette.lineSoft}`,
              background: 'transparent', color: palette.inkDim, cursor: 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 12, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>+ Añadir paso</button>
          </div>
        )}

        {tab === 'history' && (
          <div style={{
            margin: '0 16px', padding: 24, textAlign: 'center',
            background: palette.surface, border: `1.5px solid ${palette.line}`,
            color: palette.inkDim, fontSize: 12,
          }}>solo aplica a metas cíclicas</div>
        )}

        {tab === 'settings' && (
          <div style={{
            margin: '0 16px', padding: 24, textAlign: 'center',
            background: palette.surface, border: `1.5px solid ${palette.line}`,
            color: palette.inkDim, fontSize: 12,
          }}>configuración de la meta</div>
        )}

        <div style={{ height: 30 }} />
      </div>

      <DashMobileTabBar palette={palette} active={'goals'} onChange={() => {}} />
    </div>
  );
}

window.GoalsDetailDesktop = GoalsDetailDesktop;
window.GoalsDetailMobile = GoalsDetailMobile;
