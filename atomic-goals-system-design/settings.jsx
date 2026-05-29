// Settings — perfil + apariencia + seguridad (cambio de password) + logout.
// Reuses dashPalettes, DashIcon, DASH_NAV, DashThemeToggle, CategoriesSidebar,
// CAT_PRESET_COLORS, validatePassword, validateConfirm, DashMobileTabBar.

const SETTINGS_TABS = [
  { id: 'profile',  label: 'Perfil' },
  { id: 'appearance', label: 'Apariencia' },
  { id: 'security', label: 'Seguridad' },
];

// ── Reusable field ──
function SettingsField({ palette, label, hint, error, children }) {
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 6,
      }}>
        <label style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: error ? palette.magenta : palette.inkDim,
          letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>{label}</label>
        {hint && <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkSubtle, letterSpacing: '0.04em',
        }}>{hint}</span>}
      </div>
      {children}
      <div style={{
        minHeight: 16, marginTop: 5,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: palette.magenta, letterSpacing: '0.02em',
        opacity: error ? 1 : 0, transition: 'opacity .2s',
      }}>{error ? `▲ ${error}` : '\u00A0'}</div>
    </div>
  );
}

function SettingsInput({ palette, error, ...props }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => { setFocus(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); props.onBlur?.(e); }}
      style={{
        width: '100%', boxSizing: 'border-box',
        height: 44, padding: '0 14px',
        border: `1.5px solid ${error ? palette.magenta : palette.line}`,
        background: palette.bg, color: palette.ink,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: 14, fontWeight: 500, outline: 'none',
        transition: 'box-shadow .15s',
        boxShadow: focus ? `4px 4px 0 0 ${error ? palette.magenta : palette.primary}` : 'none',
      }}
    />
  );
}

// ── Section card ──
function SettingsCard({ palette, title, desc, children, footer }) {
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      marginBottom: 18,
    }}>
      <div style={{ padding: '20px 24px 6px' }}>
        <h3 style={{
          margin: 0,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', color: palette.ink,
        }}>{title}</h3>
        {desc && <p style={{
          margin: '4px 0 0', fontSize: 13, color: palette.inkDim, lineHeight: 1.45,
        }}>{desc}</p>}
      </div>
      <div style={{ padding: '14px 24px 22px' }}>{children}</div>
      {footer && (
        <div style={{
          padding: '14px 24px',
          borderTop: `1.5px solid ${palette.line}`,
          background: palette.surface2,
          display: 'flex', justifyContent: 'flex-end', gap: 10,
        }}>{footer}</div>
      )}
    </div>
  );
}

function PrimaryBtn({ palette, children, onClick, accent, success }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 18px',
      background: success ? palette.lime : palette.line,
      color: success ? palette.line : palette.bg,
      border: 'none', cursor: 'pointer',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em',
      boxShadow: `4px 4px 0 0 ${accent || palette.primary}`,
      transition: 'box-shadow .15s, transform .12s, background .2s',
      display: 'inline-flex', alignItems: 'center', gap: 8,
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `6px 6px 0 0 ${accent || palette.primary}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `4px 4px 0 0 ${accent || palette.primary}`; }}
    >{children}</button>
  );
}

function GhostBtn({ palette, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 18px',
      background: palette.surface, color: palette.ink,
      border: `1.5px solid ${palette.line}`, cursor: 'pointer',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      fontSize: 13, fontWeight: 600,
    }}>{children}</button>
  );
}

// ── Profile tab ──
function ProfilePanel({ palette, accent, setAccent }) {
  const [name, setName] = React.useState('Sofía Méndez');
  const [email, setEmail] = React.useState('sofi@correo.com');
  const [bio, setBio] = React.useState('Construyendo hábitos, un día a la vez.');
  const [saved, setSaved] = React.useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  return (
    <SettingsCard
      palette={palette}
      title="Información de perfil"
      desc="Cómo te ve la app. Tu nombre aparece en el saludo del dashboard."
      footer={<>
        <GhostBtn palette={palette}>Cancelar</GhostBtn>
        <PrimaryBtn palette={palette} accent={accent} success={saved} onClick={save}>
          {saved ? '✓ Guardado' : 'Guardar cambios'}
        </PrimaryBtn>
      </>}
    >
      {/* Avatar row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22,
        paddingBottom: 22, borderBottom: `1px solid ${palette.lineSofter}`,
      }}>
        <div style={{
          width: 72, height: 72, background: accent,
          border: `1.5px solid ${palette.line}`,
          boxShadow: `4px 4px 0 0 ${palette.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontWeight: 700, fontSize: 32, color: palette.line, flexShrink: 0,
        }}>S</div>
        <div>
          <div style={{
            display: 'flex', gap: 10, marginBottom: 8,
          }}>
            <button style={{
              padding: '7px 14px', border: `1.5px solid ${palette.line}`,
              background: palette.line, color: palette.bg, cursor: 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 12, fontWeight: 700,
            }}>Subir foto</button>
            <button style={{
              padding: '7px 14px', border: `1.5px solid ${palette.line}`,
              background: palette.surface, color: palette.inkDim, cursor: 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 12, fontWeight: 600,
            }}>Quitar</button>
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: palette.inkSubtle, letterSpacing: '0.04em',
          }}>JPG o PNG · máx 2 MB</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <SettingsField palette={palette} label="nombre">
          <SettingsInput palette={palette} value={name} onChange={(e) => setName(e.target.value)} />
        </SettingsField>
        <SettingsField palette={palette} label="correo">
          <SettingsInput palette={palette} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </SettingsField>
      </div>
      <div style={{ marginTop: 4 }}>
        <SettingsField palette={palette} label="bio" hint={`${bio.length}/120`}>
          <textarea
            value={bio} maxLength={120}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '10px 14px',
              border: `1.5px solid ${palette.line}`, background: palette.bg, color: palette.ink,
              fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 14,
              lineHeight: 1.4, outline: 'none', resize: 'none',
            }}
          />
        </SettingsField>
      </div>
    </SettingsCard>
  );
}

// ── Appearance tab ──
function AppearancePanel({ palette, theme, setTheme, accent, setAccent }) {
  const [density, setDensity] = React.useState('comfortable');
  const [quotes, setQuotes] = React.useState(true);
  const [celebrate, setCelebrate] = React.useState(true);

  return (
    <>
      <SettingsCard
        palette={palette}
        title="Tema"
        desc="Claro u oscuro. Afecta a toda la app al instante."
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[['light','Claro','sun'],['dark','Oscuro','moon']].map(([k, l]) => {
            const active = theme === k;
            const preview = dashPalettes[k];
            return (
              <button key={k} onClick={() => setTheme(k)} style={{
                padding: 0, cursor: 'pointer', textAlign: 'left',
                border: `1.5px solid ${palette.line}`,
                background: 'transparent',
                boxShadow: active ? `5px 5px 0 0 ${accent}` : 'none',
                transform: active ? 'translate(-1px,-1px)' : 'none',
                transition: 'box-shadow .15s, transform .15s',
                overflow: 'hidden',
              }}>
                {/* preview window */}
                <div style={{ background: preview.bg, padding: 14, height: 78, position: 'relative' }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                    <span style={{ width: 24, height: 24, background: preview.primary }} />
                    <span style={{ width: 24, height: 24, background: preview.magenta }} />
                    <span style={{ width: 24, height: 24, background: preview.lime }} />
                  </div>
                  <div style={{ height: 6, width: '70%', background: preview.line, marginBottom: 4 }} />
                  <div style={{ height: 6, width: '45%', background: preview.lineSoft }} />
                </div>
                <div style={{
                  padding: '10px 14px',
                  background: active ? palette.line : palette.surface,
                  color: active ? palette.bg : palette.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderTop: `1.5px solid ${palette.line}`,
                }}>
                  <span style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em',
                  }}>{l}</span>
                  <span style={{
                    width: 16, height: 16, border: `1.5px solid ${active ? palette.bg : palette.line}`,
                    background: active ? palette.lime : 'transparent',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>{active && <DashIcon kind="check" size={11} color={palette.line} />}</span>
                </div>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard
        palette={palette}
        title="Color de acento"
        desc="El color que tiñe botones, sombras y detalles clave."
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {CAT_PRESET_COLORS.slice(0, 8).map(c => (
            <button key={c} onClick={() => setAccent(c)} aria-label={c} style={{
              width: 40, height: 40, background: c,
              border: `1.5px solid ${palette.line}`, cursor: 'pointer', position: 'relative',
              boxShadow: accent === c ? `3px 3px 0 0 ${palette.line}` : 'none',
              transform: accent === c ? 'translate(-1px,-1px)' : 'none',
              transition: 'transform .12s, box-shadow .12s',
            }}>
              {accent === c && <span style={{ position: 'absolute', inset: 5, border: `1.5px solid ${palette.line}` }} />}
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        palette={palette}
        title="Comportamiento"
        desc="Pequeños detalles que hacen la app más tuya."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ToggleRow palette={palette} label="Frases motivacionales" desc="Muestra una cita en el dashboard y el login." value={quotes} onChange={() => setQuotes(v => !v)} />
          <ToggleRow palette={palette} label="Celebrar al completar" desc="Confetti y microanimación al terminar un paso." value={celebrate} onChange={() => setCelebrate(v => !v)} />
          <ToggleRow palette={palette} label="Modo denso" desc="Más información por pantalla, menos espacios." value={density === 'dense'} onChange={() => setDensity(d => d === 'dense' ? 'comfortable' : 'dense')} last />
        </div>
      </SettingsCard>
    </>
  );
}

function ToggleRow({ palette, label, desc, value, onChange, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${palette.lineSofter}`,
    }}>
      <div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 14, fontWeight: 600,
          color: palette.ink,
        }}>{label}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, marginTop: 2, letterSpacing: '0.02em',
        }}>{desc}</div>
      </div>
      <button onClick={onChange} aria-label={label} style={{
        width: 48, height: 26, flexShrink: 0,
        border: `1.5px solid ${palette.line}`,
        background: value ? palette.lime : palette.surface,
        cursor: 'pointer', padding: 2, position: 'relative',
        transition: 'background .15s',
      }}>
        <span style={{
          display: 'block', width: 18, height: 18,
          background: palette.line,
          transform: value ? 'translateX(22px)' : 'translateX(0)',
          transition: 'transform .18s cubic-bezier(.5,0,.3,1.4)',
        }} />
      </button>
    </div>
  );
}

// ── Security tab ──
function SecurityPanel({ palette, accent }) {
  const [cur, setCur] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [touched, setTouched] = React.useState({});
  const [attempt, setAttempt] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const errors = {
    cur: !cur ? 'Pon tu contraseña actual.' : null,
    pw: validatePassword(pw, 8),
    confirm: validateConfirm(pw, confirm),
  };
  const show = (k) => (touched[k] || attempt) ? errors[k] : null;
  const valid = Object.values(errors).every(e => !e);

  const submit = () => {
    setAttempt(true);
    if (!valid) return;
    setSaved(true);
    setTimeout(() => {
      setSaved(false); setCur(''); setPw(''); setConfirm('');
      setAttempt(false); setTouched({});
    }, 1800);
  };

  return (
    <>
      <SettingsCard
        palette={palette}
        title="Cambiar contraseña"
        desc="Usa al menos 8 caracteres. Te recomendamos mezclar mayúsculas, números y símbolos."
        footer={<>
          <PrimaryBtn palette={palette} accent={accent} success={saved} onClick={submit}>
            {saved ? '✓ Actualizada' : 'Actualizar contraseña'}
          </PrimaryBtn>
        </>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 440 }}>
          <SettingsField palette={palette} label="contraseña actual" error={show('cur')}>
            <SettingsInput palette={palette} type="password" error={show('cur')}
              value={cur} onChange={(e) => setCur(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, cur: true }))} placeholder="••••••••" />
          </SettingsField>
          <SettingsField palette={palette} label="nueva contraseña" error={show('pw')}>
            <SettingsInput palette={palette} type="password" error={show('pw')}
              value={pw} onChange={(e) => setPw(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, pw: true }))} placeholder="mínimo 8 caracteres" />
            {pw && (
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 4,
                    background: i < pwStrength(pw)
                      ? (pwStrength(pw) >= 3 ? palette.lime : pwStrength(pw) === 2 ? palette.yellow : palette.magenta)
                      : palette.lineSofter,
                  }} />
                ))}
              </div>
            )}
          </SettingsField>
          <SettingsField palette={palette} label="confírmala" error={show('confirm')}>
            <SettingsInput palette={palette} type="password" error={show('confirm')}
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, confirm: true }))} placeholder="otra vez" />
          </SettingsField>
        </div>
      </SettingsCard>

      <SettingsCard
        palette={palette}
        title="Sesiones activas"
        desc="Dónde tienes la sesión iniciada ahora mismo."
      >
        {[
          { dev: 'MacBook Pro · Chrome', loc: 'Santiago, CL · esta sesión', now: true },
          { dev: 'iPhone 15 · App', loc: 'Santiago, CL · hace 2h', now: false },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: i === 0 ? `1px solid ${palette.lineSofter}` : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 10, height: 10, background: s.now ? palette.lime : palette.lineSoft,
                border: `1px solid ${palette.line}`,
              }} />
              <div>
                <div style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 14, fontWeight: 600,
                  color: palette.ink,
                }}>{s.dev}</div>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  color: palette.inkDim, marginTop: 2, letterSpacing: '0.02em',
                }}>{s.loc}</div>
              </div>
            </div>
            {!s.now && (
              <button style={{
                padding: '6px 12px', border: `1.5px solid ${palette.line}`,
                background: palette.surface, color: palette.ink, cursor: 'pointer',
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>cerrar</button>
            )}
          </div>
        ))}
      </SettingsCard>
    </>
  );
}

// ── Logout confirm (reuses ConfirmDialog from trash.jsx) ──
function LogoutRow({ palette, onLogout, compact }) {
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.magenta}`,
      padding: compact ? '16px' : '18px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      boxShadow: `4px 4px 0 0 ${palette.magenta}`,
      flexWrap: compact ? 'wrap' : 'nowrap',
    }}>
      <div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 16, fontWeight: 700,
          letterSpacing: '-0.015em', color: palette.ink,
        }}>Cerrar sesión</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, marginTop: 3, letterSpacing: '0.02em',
        }}>Saldrás de tu cuenta en este dispositivo.</div>
      </div>
      <button onClick={onLogout} style={{
        padding: '11px 22px',
        background: palette.magenta, color: palette.line,
        border: `1.5px solid ${palette.line}`, cursor: 'pointer',
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        whiteSpace: 'nowrap',
      }}>
        <DashIcon kind="arrow" size={14} color={palette.line} /> Cerrar sesión
      </button>
    </div>
  );
}

// ── Desktop ──
function SettingsDesktop() {
  const [theme, setTheme] = React.useState('light');
  const [tab, setTab] = React.useState('profile');
  const [accent, setAccent] = React.useState('#2E5BFF');
  const [dialog, setDialog] = React.useState(false);
  const palette = dashPalettes[theme];

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '240px 1fr',
      background: palette.bg, color: palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      <CategoriesSidebar palette={palette} active="settings" />

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
            }}>ajustes · tu cuenta</div>
            <h1 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em',
            }}>Configuración</h1>
          </div>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 28, maxWidth: 980 }}>
          {/* Vertical tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SETTINGS_TABS.map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  textAlign: 'left', padding: '11px 14px',
                  border: `1.5px solid ${active ? palette.line : 'transparent'}`,
                  background: active ? palette.line : 'transparent',
                  color: active ? palette.bg : palette.ink,
                  cursor: 'pointer',
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'background .12s, color .12s, border-color .12s',
                }}>
                  <span style={{
                    width: 8, height: 8,
                    background: active ? palette.lime : palette.lineSoft,
                  }} />
                  {t.label}
                </button>
              );
            })}

            <div style={{ height: 1, background: palette.lineSoft, margin: '12px 0' }} />

            <button onClick={() => setDialog(true)} style={{
              textAlign: 'left', padding: '11px 14px',
              border: `1.5px solid transparent`,
              background: 'transparent', color: palette.magenta, cursor: 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 8, height: 8, background: palette.magenta }} />
              Cerrar sesión
            </button>
          </div>

          {/* Panel */}
          <div>
            {tab === 'profile' && <ProfilePanel palette={palette} accent={accent} setAccent={setAccent} />}
            {tab === 'appearance' && <AppearancePanel palette={palette} theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} />}
            {tab === 'security' && <SecurityPanel palette={palette} accent={accent} />}

            <LogoutRow palette={palette} onLogout={() => setDialog(true)} />
          </div>
        </div>
      </main>

      {dialog && (
        <ConfirmDialog
          palette={palette} danger
          title="Cerrar sesión"
          body="Vas a salir de tu cuenta en este dispositivo. Tu racha y tus metas quedan guardadas."
          confirmLabel="Sí, cerrar sesión"
          onCancel={() => setDialog(false)}
          onConfirm={() => setDialog(false)}
        />
      )}
    </div>
  );
}

// ── Mobile ──
function SettingsMobile() {
  const [theme, setTheme] = React.useState('light');
  const [tab, setTab] = React.useState('profile');
  const [accent, setAccent] = React.useState('#2E5BFF');
  const [dialog, setDialog] = React.useState(false);
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
            }}>tu cuenta</div>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: palette.ink,
            }}>Ajustes</div>
          </div>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        {/* profile summary */}
        <div style={{
          margin: '0 16px 16px',
          background: palette.surface, border: `1.5px solid ${palette.line}`,
          padding: '16px', display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: `4px 4px 0 0 ${accent}`,
        }}>
          <div style={{
            width: 52, height: 52, background: accent,
            border: `1.5px solid ${palette.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700,
            fontSize: 24, color: palette.line, flexShrink: 0,
          }}>S</div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 17, fontWeight: 700,
              letterSpacing: '-0.015em', color: palette.ink,
            }}>Sofía Méndez</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: palette.inkDim, marginTop: 2, letterSpacing: '0.02em',
            }}>sofi@correo.com · racha 23 días</div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ padding: '0 16px 14px', display: 'flex', gap: 6 }}>
          {SETTINGS_TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: '8px 4px',
                border: `1.5px solid ${palette.line}`,
                background: active ? palette.line : palette.surface,
                color: active ? palette.bg : palette.ink, cursor: 'pointer',
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 12, fontWeight: 700, letterSpacing: '-0.005em',
              }}>{t.label}</button>
            );
          })}
        </div>

        {/* panel (mobile uses the same cards, single column) */}
        <div style={{ padding: '0 16px' }}>
          {tab === 'profile' && <ProfilePanel palette={palette} accent={accent} setAccent={setAccent} />}
          {tab === 'appearance' && <AppearancePanel palette={palette} theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} />}
          {tab === 'security' && <SecurityPanel palette={palette} accent={accent} />}

          <LogoutRow palette={palette} onLogout={() => setDialog(true)} compact />
        </div>
        <div style={{ height: 30 }} />
      </div>

      <DashMobileTabBar palette={palette} active="profile" onChange={() => {}} />

      {dialog && (
        <ConfirmDialog
          palette={palette} danger
          title="Cerrar sesión"
          body="Vas a salir de tu cuenta en este dispositivo. Tu racha queda guardada."
          confirmLabel="Sí, cerrar sesión"
          onCancel={() => setDialog(false)}
          onConfirm={() => setDialog(false)}
        />
      )}
    </div>
  );
}

window.SettingsDesktop = SettingsDesktop;
window.SettingsMobile = SettingsMobile;
