// Calendar — month view (default) + week view, event popover, mobile agenda.
// Reuses dashPalettes, DashIcon, DASH_NAV, DASH_CATEGORIES, DashLogo,
// DashThemeToggle, DashMobileTabBar, CategoriesSidebar.
// "Today" is May 28, 2026 (Thursday).

// ── Events: pasos + metas with dates within May 2026 ──
// day = day-of-month (May), type: 'step' | 'goal-end' | 'cyclic'
const CAL_EVENTS = [
  { day: 1,  title: 'Llamar a mamá', cat: 'familia', color: '#7C5CFF', type: 'cyclic', time: '11:00', goal: 'Llamar a mamá los domingos' },
  { day: 4,  title: 'Yoga · Vinyasa', cat: 'salud', color: '#FF3D6E', type: 'cyclic', time: '19:00', goal: 'Yoga 3x por semana' },
  { day: 5,  title: 'Lección 9 — Inglés', cat: 'estudio', color: '#2E5BFF', type: 'step', time: '07:30', goal: 'Curso de inglés B2' },
  { day: 6,  title: 'Yoga · Hatha', cat: 'salud', color: '#FF3D6E', type: 'cyclic', time: '19:00', goal: 'Yoga 3x por semana' },
  { day: 8,  title: 'Llamar a mamá', cat: 'familia', color: '#7C5CFF', type: 'cyclic', time: '11:00', goal: 'Llamar a mamá los domingos' },
  { day: 10, title: 'Comprar tenis', cat: 'salud', color: '#FF3D6E', type: 'step', time: null, goal: 'Correr 5km sin parar' },
  { day: 12, title: 'Inicio · Correr 5km', cat: 'salud', color: '#FF3D6E', type: 'goal-start', time: null, goal: 'Correr 5km sin parar' },
  { day: 12, title: 'Lección 10 — Inglés', cat: 'estudio', color: '#2E5BFF', type: 'step', time: '07:30', goal: 'Curso de inglés B2' },
  { day: 13, title: 'Yoga · Vinyasa', cat: 'salud', color: '#FF3D6E', type: 'cyclic', time: '19:00', goal: 'Yoga 3x por semana' },
  { day: 15, title: 'Depósito mensual', cat: 'finanzas', color: '#1FD1F9', type: 'step', time: null, goal: 'Ahorrar $5.000' },
  { day: 15, title: 'Llamar a mamá', cat: 'familia', color: '#7C5CFF', type: 'cyclic', time: '11:00', goal: 'Llamar a mamá los domingos' },
  { day: 18, title: 'Plan de entrenamiento', cat: 'salud', color: '#FF3D6E', type: 'step', time: null, goal: 'Correr 5km sin parar' },
  { day: 19, title: 'Lección 11 — Inglés', cat: 'estudio', color: '#2E5BFF', type: 'step', time: '07:30', goal: 'Curso de inglés B2' },
  { day: 20, title: 'Yoga · Hatha', cat: 'salud', color: '#FF3D6E', type: 'cyclic', time: '19:00', goal: 'Yoga 3x por semana' },
  { day: 22, title: 'Fin · Aprender SwiftUI', cat: 'trabajo', color: '#FFB400', type: 'goal-end', time: null, goal: 'Aprender SwiftUI' },
  { day: 22, title: 'Llamar a mamá', cat: 'familia', color: '#7C5CFF', type: 'cyclic', time: '11:00', goal: 'Llamar a mamá los domingos' },
  { day: 26, title: 'Lección 12 — Inglés', cat: 'estudio', color: '#2E5BFF', type: 'step', time: '07:30', goal: 'Curso de inglés B2' },
  { day: 27, title: 'Validar datos · reporte', cat: 'trabajo', color: '#FFB400', type: 'step', time: '15:00', goal: 'Entregar reporte Q2' },
  { day: 28, title: 'Correr · 30 min', cat: 'salud', color: '#FF3D6E', type: 'cyclic', time: '18:00', goal: 'Correr 5km sin parar' },
  { day: 28, title: 'Meditar · 10 min', cat: 'mente', color: '#C8FF1F', type: 'cyclic', time: '21:00', goal: 'Meditar todos los días' },
  { day: 28, title: 'Leer · cap. 7', cat: 'mente', color: '#C8FF1F', type: 'step', time: null, goal: 'Leer 12 libros este año' },
  { day: 29, title: 'Yoga · Vinyasa', cat: 'salud', color: '#FF3D6E', type: 'cyclic', time: '19:00', goal: 'Yoga 3x por semana' },
  { day: 30, title: 'Fin · Correr 5km', cat: 'salud', color: '#FF3D6E', type: 'goal-end', time: null, goal: 'Correr 5km sin parar' },
  { day: 30, title: 'Reporte Q2 · borrador', cat: 'trabajo', color: '#FFB400', type: 'step', time: '10:00', goal: 'Entregar reporte Q2' },
  { day: 31, title: 'Llamar a mamá', cat: 'familia', color: '#7C5CFF', type: 'cyclic', time: '11:00', goal: 'Llamar a mamá los domingos' },
];

const CAL_TODAY = 28; // May 28, 2026
// May 1, 2026 is a Friday. Week starts Monday → offset.
// Mon=0..Sun=6 ; May 1 (Fri) = index 4
const MAY_FIRST_WEEKDAY = 4;
const MAY_DAYS = 31;
const WEEKDAY_LABELS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

function eventsForDay(day, filterCat) {
  return CAL_EVENTS.filter(e => e.day === day && (filterCat === 'all' || e.cat === filterCat));
}

function CalEventChip({ ev, palette, dense }) {
  const isMilestone = ev.type === 'goal-end' || ev.type === 'goal-start';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: dense ? '1px 4px' : '3px 6px',
      background: isMilestone ? ev.color : 'transparent',
      borderLeft: isMilestone ? 'none' : `3px solid ${ev.color}`,
      color: isMilestone ? palette.line : palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      fontSize: dense ? 10 : 11, fontWeight: isMilestone ? 700 : 600,
      letterSpacing: '-0.005em',
      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      lineHeight: 1.3,
    }}>
      {ev.time && !dense && (
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          color: isMilestone ? palette.line : palette.inkDim, flexShrink: 0,
          letterSpacing: '0.02em',
        }}>{ev.time}</span>
      )}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</span>
    </div>
  );
}

// ── Day popover ──
function CalDayPopover({ day, palette, filterCat, onClose, anchorRight }) {
  const events = eventsForDay(day, filterCat);
  return (
    <div style={{
      position: 'absolute',
      top: 8, [anchorRight ? 'right' : 'left']: 8,
      width: 260, zIndex: 30,
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      boxShadow: `6px 6px 0 0 ${palette.line}`,
    }}>
      <div style={{
        padding: '12px 14px',
        borderBottom: `1.5px solid ${palette.line}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: day === CAL_TODAY ? palette.lime : palette.surface,
        color: palette.line,
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7,
          }}>{day === CAL_TODAY ? 'hoy' : 'mayo'}</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em',
          }}>{day} de mayo</div>
        </div>
        <button onClick={onClose} style={{
          width: 24, height: 24, border: `1.5px solid ${palette.line}`,
          background: 'transparent', color: palette.line, cursor: 'pointer',
          fontWeight: 700, fontSize: 13, lineHeight: 1,
        }}>×</button>
      </div>
      <div style={{ padding: '10px 14px', maxHeight: 280, overflow: 'auto' }}>
        {events.length === 0 ? (
          <div style={{
            padding: '16px 0', textAlign: 'center',
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            color: palette.inkDim, letterSpacing: '0.04em',
          }}>nada agendado · día libre</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.map((ev, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '4px 1fr', gap: 10,
                paddingBottom: 8,
                borderBottom: i < events.length - 1 ? `1px solid ${palette.lineSofter}` : 'none',
              }}>
                <div style={{ background: ev.color }} />
                <div>
                  <div style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em', color: palette.ink,
                  }}>{ev.title}</div>
                  <div style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                    color: palette.inkDim, marginTop: 2, letterSpacing: '0.02em',
                  }}>
                    {ev.time ? `${ev.time} · ` : ''}{ev.goal}
                  </div>
                  {(ev.type === 'goal-end' || ev.type === 'goal-start') && (
                    <span style={{
                      display: 'inline-block', marginTop: 4,
                      padding: '1px 6px', background: ev.color, color: palette.line,
                      fontFamily: '"JetBrains Mono", monospace', fontSize: 8,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>{ev.type === 'goal-end' ? 'fecha límite' : 'inicio'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <button style={{
          width: '100%', marginTop: 10, padding: '8px',
          border: `1.5px dashed ${palette.lineSoft}`,
          background: 'transparent', color: palette.inkDim, cursor: 'pointer',
          fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 12, fontWeight: 600,
        }}>+ Agendar paso</button>
      </div>
    </div>
  );
}

// ── Filter + view toggle bar ──
function CalToolbar({ palette, view, setView, filterCat, setFilterCat }) {
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      marginBottom: 16,
    }}>
      {/* month nav */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <button style={{
          width: 30, height: 30, border: `1.5px solid ${palette.line}`,
          background: palette.surface, color: palette.ink, cursor: 'pointer',
          fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700, fontSize: 14,
        }}>←</button>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: palette.ink,
          minWidth: 130, textAlign: 'center',
        }}>Mayo <span style={{ color: palette.inkDim, fontWeight: 500 }}>2026</span></div>
        <button style={{
          width: 30, height: 30, border: `1.5px solid ${palette.line}`,
          background: palette.surface, color: palette.ink, cursor: 'pointer',
          fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700, fontSize: 14,
        }}>→</button>
        <button style={{
          marginLeft: 4, padding: '7px 12px',
          border: `1.5px solid ${palette.line}`,
          background: palette.bg, color: palette.ink, cursor: 'pointer',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>hoy</button>
      </div>

      {/* category filter */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginLeft: 8 }}>
        <FilterChip label="todas" active={filterCat === 'all'} onClick={() => setFilterCat('all')} palette={palette} />
        {DASH_CATEGORIES.map(c => (
          <FilterChip key={c.name}
            label={c.name} color={c.color}
            active={filterCat === c.name}
            onClick={() => setFilterCat(c.name)}
            palette={palette}
          />
        ))}
      </div>

      {/* view toggle */}
      <div style={{
        display: 'inline-flex', border: `1.5px solid ${palette.line}`, overflow: 'hidden',
        marginLeft: 'auto',
      }}>
        {[['month','mes'],['week','semana']].map(([k,l]) => (
          <button key={k} onClick={() => setView(k)} style={{
            padding: '7px 14px', border: 'none', cursor: 'pointer',
            background: view === k ? palette.line : 'transparent',
            color: view === k ? palette.bg : palette.ink,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            borderRight: k === 'month' ? `1.5px solid ${palette.line}` : 'none',
          }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

// ── Month grid ──
function CalMonthGrid({ palette, filterCat, openDay, setOpenDay }) {
  // Build cells: leading blanks + days
  const cells = [];
  for (let i = 0; i < MAY_FIRST_WEEKDAY; i++) cells.push(null);
  for (let d = 1; d <= MAY_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div style={{
      border: `1.5px solid ${palette.line}`,
      background: palette.surface,
    }}>
      {/* weekday header */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: `1.5px solid ${palette.line}`,
        background: palette.surface2,
      }}>
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={w} style={{
            padding: '8px 10px',
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkDim, letterSpacing: '0.12em', textTransform: 'uppercase',
            borderRight: i < 6 ? `1px solid ${palette.lineSofter}` : 'none',
            textAlign: i >= 5 ? 'right' : 'left',
          }}>{w}</div>
        ))}
      </div>

      {/* weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: wi < weeks.length - 1 ? `1px solid ${palette.lineSofter}` : 'none',
        }}>
          {week.map((day, di) => {
            const isToday = day === CAL_TODAY;
            const isWeekend = di >= 5;
            const dayEvents = day ? eventsForDay(day, filterCat) : [];
            const shown = dayEvents.slice(0, 3);
            const extra = dayEvents.length - shown.length;
            return (
              <div key={di} style={{
                minHeight: 116, padding: '6px 7px',
                borderRight: di < 6 ? `1px solid ${palette.lineSofter}` : 'none',
                background: day == null ? palette.bg
                          : isToday ? (palette.lime + (palette === dashPalettes.dark ? '22' : '20'))
                          : isWeekend ? palette.surface2
                          : palette.surface,
                position: 'relative', cursor: day ? 'pointer' : 'default',
                transition: 'background .12s',
              }}
              onClick={() => day && setOpenDay(openDay === day ? null : day)}>
                {day && (
                  <>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginBottom: 5,
                    }}>
                      <span style={{
                        fontFamily: '"Space Grotesk", system-ui, sans-serif',
                        fontSize: 13, fontWeight: isToday ? 700 : 600,
                        color: palette.ink,
                        width: isToday ? 24 : 'auto', height: isToday ? 24 : 'auto',
                        background: isToday ? palette.line : 'transparent',
                        color: isToday ? palette.bg : palette.ink,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>{day}</span>
                      {dayEvents.length > 0 && (
                        <span style={{
                          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                          color: palette.inkSubtle,
                        }}>{dayEvents.length}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {shown.map((ev, i) => (
                        <CalEventChip key={i} ev={ev} palette={palette} />
                      ))}
                      {extra > 0 && (
                        <div style={{
                          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                          color: palette.primary, letterSpacing: '0.04em',
                          paddingLeft: 4, marginTop: 1,
                        }}>+{extra} más</div>
                      )}
                    </div>

                    {openDay === day && (
                      <CalDayPopover
                        day={day} palette={palette} filterCat={filterCat}
                        onClose={() => setOpenDay(null)}
                        anchorRight={di >= 4}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Week view (Mon May 25 – Sun May 31, contains today) ──
function CalWeekView({ palette, filterCat }) {
  const weekDays = [25, 26, 27, 28, 29, 30, 31];
  const hours = [7, 9, 11, 13, 15, 17, 19, 21];

  // place events by their hour
  function evHour(ev) {
    if (!ev.time) return null;
    return parseInt(ev.time.split(':')[0], 10);
  }

  return (
    <div style={{
      border: `1.5px solid ${palette.line}`,
      background: palette.surface,
      overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)',
        borderBottom: `1.5px solid ${palette.line}`, background: palette.surface2,
      }}>
        <div style={{ borderRight: `1px solid ${palette.lineSofter}` }} />
        {weekDays.map((d, i) => {
          const isToday = d === CAL_TODAY;
          return (
            <div key={d} style={{
              padding: '8px 10px',
              borderRight: i < 6 ? `1px solid ${palette.lineSofter}` : 'none',
              background: isToday ? palette.lime : 'transparent',
              color: isToday ? palette.line : palette.ink,
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                opacity: 0.7,
              }}>{WEEKDAY_LABELS[i]}</div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
              }}>{d}</div>
            </div>
          );
        })}
      </div>

      {/* all-day row (milestones, no time) */}
      <div style={{
        display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)',
        borderBottom: `1.5px solid ${palette.line}`, minHeight: 44,
      }}>
        <div style={{
          borderRight: `1px solid ${palette.lineSofter}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          color: palette.inkDim, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>todo<br/>el día</div>
        {weekDays.map((d, i) => {
          const evs = eventsForDay(d, filterCat).filter(e => !e.time);
          return (
            <div key={d} style={{
              padding: 4, borderRight: i < 6 ? `1px solid ${palette.lineSofter}` : 'none',
              display: 'flex', flexDirection: 'column', gap: 3,
              background: d === CAL_TODAY ? (palette.lime + '14') : 'transparent',
            }}>
              {evs.map((ev, j) => <CalEventChip key={j} ev={ev} palette={palette} dense />)}
            </div>
          );
        })}
      </div>

      {/* hour grid */}
      <div style={{ maxHeight: 520, overflow: 'auto' }}>
        {hours.map((h, hi) => (
          <div key={h} style={{
            display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)',
            borderBottom: hi < hours.length - 1 ? `1px solid ${palette.lineSofter}` : 'none',
            minHeight: 60,
          }}>
            <div style={{
              borderRight: `1px solid ${palette.lineSofter}`,
              padding: '6px 8px',
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: palette.inkDim, letterSpacing: '0.04em',
            }}>{String(h).padStart(2, '0')}:00</div>
            {weekDays.map((d, i) => {
              const evs = eventsForDay(d, filterCat).filter(e => {
                const eh = evHour(e);
                return eh !== null && eh >= h && eh < h + 2;
              });
              return (
                <div key={d} style={{
                  padding: 4, borderRight: i < 6 ? `1px solid ${palette.lineSofter}` : 'none',
                  display: 'flex', flexDirection: 'column', gap: 3,
                  background: d === CAL_TODAY ? (palette.lime + '10') : 'transparent',
                }}>
                  {evs.map((ev, j) => (
                    <div key={j} style={{
                      padding: '4px 6px', background: ev.color,
                      color: palette.line,
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 10, fontWeight: 700, letterSpacing: '-0.005em',
                      lineHeight: 1.2,
                    }}>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, opacity: 0.8 }}>{ev.time}</div>
                      {ev.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Desktop page ──
function CalendarDesktop() {
  const [theme, setTheme] = React.useState('light');
  const [view, setView] = React.useState('month');
  const [filterCat, setFilterCat] = React.useState('all');
  const [openDay, setOpenDay] = React.useState(28);
  const palette = dashPalettes[theme];

  const monthCount = CAL_EVENTS.filter(e => filterCat === 'all' || e.cat === filterCat).length;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '240px 1fr',
      background: palette.bg, color: palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      <CategoriesSidebar palette={palette} active="calendar" />

      <main style={{ overflow: 'auto', padding: '24px 32px 32px' }}>
        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: palette.inkDim, marginBottom: 4,
            }}>calendario · {monthCount} eventos este mes</div>
            <h1 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em',
            }}>Tu mes, <span style={{
              background: palette.primary, color: palette.primaryInk, padding: '0 8px',
            }}>paso a paso</span>.</h1>
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
            }}>
              <DashIcon kind="plus" size={12} color={palette.bg} /> Agendar
            </button>
          </div>
        </div>

        <CalToolbar
          palette={palette}
          view={view} setView={setView}
          filterCat={filterCat} setFilterCat={setFilterCat}
        />

        {view === 'month'
          ? <CalMonthGrid palette={palette} filterCat={filterCat} openDay={openDay} setOpenDay={setOpenDay} />
          : <CalWeekView palette={palette} filterCat={filterCat} />
        }

        {/* legend */}
        <div style={{
          marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, letterSpacing: '0.06em',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 18, height: 10, borderLeft: `3px solid ${palette.primary}` }} /> paso agendado
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 18, height: 10, background: palette.magenta }} /> fecha límite / inicio de meta
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, background: palette.lime }} /> hoy · 28 may
          </span>
        </div>
      </main>
    </div>
  );
}

// ── Mobile agenda ──
function CalendarMobile() {
  const [theme, setTheme] = React.useState('light');
  const [filterCat, setFilterCat] = React.useState('all');
  const [selDay, setSelDay] = React.useState(28);
  const palette = dashPalettes[theme];

  // Mini month strip: show current week row + few
  const cells = [];
  for (let i = 0; i < MAY_FIRST_WEEKDAY; i++) cells.push(null);
  for (let d = 1; d <= MAY_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const dayEvents = eventsForDay(selDay, filterCat);

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
            }}>mayo 2026</div>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: palette.ink,
            }}>Calendario</div>
          </div>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        {/* category filter scroll */}
        <div style={{
          padding: '0 16px 12px',
          display: 'flex', gap: 6, overflowX: 'auto',
        }}>
          <FilterChip label="todas" active={filterCat === 'all'} onClick={() => setFilterCat('all')} palette={palette} />
          {DASH_CATEGORIES.map(c => (
            <FilterChip key={c.name} label={c.name} color={c.color}
              active={filterCat === c.name} onClick={() => setFilterCat(c.name)} palette={palette} />
          ))}
        </div>

        {/* mini month */}
        <div style={{
          margin: '0 16px',
          border: `1.5px solid ${palette.line}`,
          background: palette.surface,
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: `1.5px solid ${palette.line}`, background: palette.surface2,
          }}>
            {WEEKDAY_LABELS.map(w => (
              <div key={w} style={{
                padding: '6px 0', textAlign: 'center',
                fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                color: palette.inkDim, letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{w[0]}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {week.map((day, di) => {
                const isToday = day === CAL_TODAY;
                const isSel = day === selDay;
                const evs = day ? eventsForDay(day, filterCat) : [];
                return (
                  <button key={di} disabled={!day} onClick={() => day && setSelDay(day)} style={{
                    aspectRatio: '1', border: 'none',
                    borderRight: di < 6 ? `1px solid ${palette.lineSofter}` : 'none',
                    borderBottom: wi < weeks.length - 1 ? `1px solid ${palette.lineSofter}` : 'none',
                    background: isSel ? palette.line : isToday ? (palette.lime + '30') : 'transparent',
                    color: isSel ? palette.bg : palette.ink,
                    cursor: day ? 'pointer' : 'default',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 3, position: 'relative', padding: 0,
                  }}>
                    {day && (
                      <>
                        <span style={{
                          fontFamily: '"Space Grotesk", system-ui, sans-serif',
                          fontSize: 13, fontWeight: isToday || isSel ? 700 : 500,
                        }}>{day}</span>
                        <div style={{ display: 'flex', gap: 2, height: 4 }}>
                          {evs.slice(0, 3).map((ev, i) => (
                            <span key={i} style={{
                              width: 4, height: 4,
                              background: isSel ? palette.bg : ev.color,
                            }} />
                          ))}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* selected day agenda */}
        <div style={{ margin: '18px 16px 0' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 10,
          }}>
            <div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: palette.inkDim, letterSpacing: '0.16em', textTransform: 'uppercase',
                marginBottom: 2,
              }}>{selDay === CAL_TODAY ? 'hoy' : 'agenda'} · {dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''}</div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', color: palette.ink,
              }}>{selDay} de mayo</div>
            </div>
          </div>

          {dayEvents.length === 0 ? (
            <div style={{
              padding: 24, textAlign: 'center',
              border: `1.5px dashed ${palette.lineSoft}`, color: palette.inkDim,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.04em',
            }}>día libre · nada agendado</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dayEvents.map((ev, i) => {
                const milestone = ev.type === 'goal-end' || ev.type === 'goal-start';
                return (
                  <div key={i} style={{
                    background: palette.surface, border: `1.5px solid ${palette.line}`,
                    display: 'grid', gridTemplateColumns: '5px 1fr auto', gap: 12,
                    alignItems: 'center', padding: '12px 14px',
                  }}>
                    <div style={{ alignSelf: 'stretch', background: ev.color }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontFamily: '"Space Grotesk", system-ui, sans-serif',
                        fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', color: palette.ink,
                      }}>{ev.title}</div>
                      <div style={{
                        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                        color: palette.inkDim, marginTop: 2, letterSpacing: '0.02em',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{ev.goal}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {ev.time ? (
                        <div style={{
                          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                          fontWeight: 600, color: palette.ink, letterSpacing: '0.02em',
                        }}>{ev.time}</div>
                      ) : milestone ? (
                        <span style={{
                          padding: '2px 6px', background: ev.color, color: palette.line,
                          fontFamily: '"JetBrains Mono", monospace', fontSize: 8,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>{ev.type === 'goal-end' ? 'límite' : 'inicio'}</span>
                      ) : (
                        <span style={{
                          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                          color: palette.inkSubtle, letterSpacing: '0.06em', textTransform: 'uppercase',
                        }}>todo el día</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ height: 30 }} />
      </div>
      <DashMobileTabBar palette={palette} active="calendar" onChange={() => {}} />
    </div>
  );
}

window.CalendarDesktop = CalendarDesktop;
window.CalendarMobile = CalendarMobile;
