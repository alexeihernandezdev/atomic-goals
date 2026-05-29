// Dashboard — Mobile layout (iOS frame, 402x874)

function DashMobileTopBar({ palette, theme, setTheme }) {
  return (
    <div style={{
      paddingTop: 54, // clear status bar + dynamic island
      paddingLeft: 20, paddingRight: 20, paddingBottom: 12,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      background: palette.bg,
    }}>
      <div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: palette.inkDim, marginBottom: 2,
        }}>jueves · 27 may</div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em',
          color: palette.ink,
        }}>Hola, <span style={{ color: palette.primary }}>Sofi</span></div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        <button aria-label="Notificaciones" style={{
          width: 34, height: 34, border: `1.5px solid ${palette.line}`,
          background: palette.surface, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <DashIcon kind="bell" size={15} color={palette.ink} />
          <span style={{
            position: 'absolute', top: -3, right: -3,
            width: 10, height: 10, background: palette.magenta,
            border: `1.5px solid ${palette.line}`,
          }} />
        </button>
      </div>
    </div>
  );
}

function DashMobileHero({ palette }) {
  return (
    <div style={{
      margin: '0 16px',
      position: 'relative',
      background: palette.line, color: palette.bg,
      padding: '20px 22px',
      overflow: 'hidden',
      boxShadow: `4px 4px 0 0 ${palette.primary}`,
    }}>
      {/* color accents */}
      <div style={{
        position: 'absolute', right: -30, top: -30,
        width: 110, height: 110, background: palette.magenta,
        transform: 'rotate(10deg)',
      }} />
      <div style={{
        position: 'absolute', right: 60, bottom: -15,
        width: 40, height: 40, background: palette.yellow,
      }} />

      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          opacity: 0.6, marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 6, height: 6, background: palette.lime, animation: 'mob-pulse 1.8s ease infinite' }} />
          racha actual
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 76, fontWeight: 700, lineHeight: 0.82, letterSpacing: '-0.04em',
          }}>23</span>
          <span style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 14, fontWeight: 600, opacity: 0.9,
          }}>días<br/><span style={{ fontSize: 10, opacity: 0.6, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em' }}>récord 47</span></span>
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 4 }}>
          {[1,1,1,1,1,0,0].map((on, i) => (
            <div key={i} style={{
              flex: 1, height: 10,
              background: on ? palette.lime : 'rgba(255,255,255,0.20)',
            }} />
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 6,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.55,
        }}>
          <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
        </div>
      </div>
      <style>{`@keyframes mob-pulse { 0%, 100% { opacity: 1 } 50% { opacity: .3 } }`}</style>
    </div>
  );
}

function DashMobileStats({ palette }) {
  const items = [
    { label: 'metas activas', value: 8, accent: palette.primary, sub: '3 esta semana' },
    { label: 'completadas mes', value: 12, accent: palette.lime, sub: '67% objetivo' },
    { label: 'pasos hoy', value: '5/7', accent: palette.yellow, sub: '2 pendientes' },
    { label: 'categorías', value: 6, accent: palette.magenta, sub: '2 nuevas' },
  ];
  return (
    <div style={{
      margin: '14px 16px 0',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          padding: '12px 14px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
            background: it.accent,
          }} />
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
            color: palette.inkDim, letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: 4,
          }}>{it.label}</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em',
            lineHeight: 1, color: palette.ink,
          }}>{it.value}</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
            color: palette.inkDim, marginTop: 4, letterSpacing: '0.04em',
          }}>{it.sub}</div>
        </div>
      ))}
    </div>
  );
}

function DashMobileTodayCard({ item, palette, onTap }) {
  const [done, setDone] = React.useState(false);
  const checked = done;
  return (
    <div
      onClick={() => setDone(d => !d)}
      style={{
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        padding: '12px 14px',
        display: 'grid', gridTemplateColumns: '22px 1fr auto', gap: 12,
        alignItems: 'center', cursor: 'pointer',
        position: 'relative',
        opacity: checked ? 0.5 : 1,
        transition: 'opacity .2s',
      }}>
      <div style={{
        width: 22, height: 22,
        border: `1.5px solid ${palette.line}`,
        background: checked ? item.color : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background .15s',
      }}>
        {checked && <DashIcon kind="check" size={14} color={palette.line} />}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
          color: palette.ink,
          textDecoration: checked ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{item.goal}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, letterSpacing: '0.02em', marginTop: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{item.step}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.ink, fontWeight: 600, letterSpacing: '0.04em',
        }}>{item.time || item.when}</div>
        <div style={{ width: 28, height: 4, background: palette.lineSofter, marginTop: 5, marginLeft: 'auto', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${item.progress}%`, background: item.color }} />
        </div>
      </div>
    </div>
  );
}

function DashMobileToday({ palette }) {
  const today = DASH_UPCOMING.filter(x => x.when === 'hoy');
  return (
    <div style={{ margin: '20px 16px 0' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 10,
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.16em', textTransform: 'uppercase',
            marginBottom: 2,
          }}>hoy · {today.length} pasos</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', color: palette.ink,
          }}>Para hoy</div>
        </div>
        <a href="#" style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.primary, letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>todos →</a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {today.map((item, i) => (
          <DashMobileTodayCard key={i} item={item} palette={palette} />
        ))}
        {DASH_UPCOMING.filter(x => x.when === 'mañana').slice(0, 1).map((item, i) => (
          <DashMobileTodayCard key={'m'+i} item={{ ...item, time: 'mañana' }} palette={palette} />
        ))}
      </div>
    </div>
  );
}

function DashMobileCategories({ palette }) {
  return (
    <div style={{ margin: '20px 16px 0' }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: palette.inkDim, letterSpacing: '0.16em', textTransform: 'uppercase',
        marginBottom: 10,
      }}>categorías</div>
      <div style={{
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        padding: '12px 14px',
      }}>
        <DashCategoryStack items={DASH_CATEGORIES} palette={palette} height={12} />
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {DASH_CATEGORIES.slice(0, 4).map(c => (
            <div key={c.name} style={{
              display: 'grid', gridTemplateColumns: '10px 1fr 30px', gap: 10,
              alignItems: 'center',
            }}>
              <div style={{ width: 10, height: 10, background: c.color }} />
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 13, fontWeight: 600, color: palette.ink, textTransform: 'capitalize',
                }}>{c.name}</span>
                <div style={{ flex: 1, height: 3, background: palette.lineSofter, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${c.pct}%`, background: c.color,
                  }} />
                </div>
              </div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkDim, textAlign: 'right',
              }}>{c.pct}%</div>
            </div>
          ))}
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.primary, letterSpacing: '0.06em', marginTop: 2,
            cursor: 'pointer',
          }}>+ 2 más</div>
        </div>
      </div>
    </div>
  );
}

function DashMobileTimeline({ palette }) {
  return (
    <div style={{ margin: '20px 16px 0' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 10,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>30 días</div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 12, fontWeight: 600, color: palette.ink,
        }}>+ 42 pasos · <span style={{ background: palette.lime, padding: '0 5px' }}>↑ 18%</span></div>
      </div>
      <div style={{
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        padding: '14px 14px 10px',
      }}>
        <DashTimelineBars data={DASH_TIMELINE} palette={palette} accent={palette.primary} height={64} />
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 6,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          color: palette.inkDim, letterSpacing: '0.06em',
        }}>
          <span>28 abr</span>
          <span>hoy</span>
        </div>
      </div>
    </div>
  );
}

function DashMobileQuote({ palette }) {
  return (
    <div style={{
      margin: '20px 16px 0',
      background: palette.lime, color: palette.line,
      padding: '16px 18px',
      transform: 'rotate(-1deg)',
      border: `1.5px solid ${palette.line}`,
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        marginBottom: 6, opacity: 0.6,
      }}>cita del día</div>
      <blockquote style={{
        margin: 0,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: 14, lineHeight: 1.3, fontWeight: 600,
        letterSpacing: '-0.005em', textWrap: 'pretty',
      }}>"No subes al nivel de tus metas — caes al nivel de tus sistemas."</blockquote>
      <div style={{
        marginTop: 6,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
        letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.7,
      }}>— james clear</div>
    </div>
  );
}

function DashMobileTabBar({ palette, active, onChange }) {
  const tabs = [
    { id: 'dashboard', label: 'home' },
    { id: 'goals',     label: 'metas' },
    { id: 'new',       label: '+',     primary: true },
    { id: 'calendar',  label: 'cal' },
    { id: 'profile',   label: 'tú' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 28,
      background: palette.bg,
      borderTop: `1.5px solid ${palette.line}`,
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
      paddingTop: 10,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          padding: '4px 0',
          color: active === t.id ? palette.ink : palette.inkDim,
        }}>
          <div style={{
            width: t.primary ? 36 : 18,
            height: t.primary ? 36 : 18,
            background: t.primary
              ? palette.line
              : (active === t.id ? palette.ink : palette.lineSoft),
            color: t.primary ? palette.bg : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700, fontSize: t.primary ? 22 : 11,
            boxShadow: t.primary ? `2px 2px 0 0 ${palette.primary}` : 'none',
            marginBottom: t.primary ? -8 : 0,
            marginTop: t.primary ? -8 : 0,
          }}>{t.primary ? '+' : ''}</div>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
            fontWeight: active === t.id ? 600 : 400,
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function DashboardMobile() {
  const [theme, setTheme] = React.useState('light');
  const [tab, setTab] = React.useState('dashboard');
  const palette = dashPalettes[theme];

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
        <DashMobileTopBar palette={palette} theme={theme} setTheme={setTheme} />
        <DashMobileHero palette={palette} />
        <DashMobileStats palette={palette} />
        <DashMobileToday palette={palette} />
        <DashMobileTimeline palette={palette} />
        <DashMobileCategories palette={palette} />
        <DashMobileQuote palette={palette} />
        <div style={{ height: 30 }} />
      </div>
      <DashMobileTabBar palette={palette} active={tab} onChange={setTab} />
    </div>
  );
}

window.DashboardMobile = DashboardMobile;
