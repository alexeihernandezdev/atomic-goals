// Variation B — "Vibrante"
// Bold graphic layout, heavy display type, color-block accents.
// Strong typographic contrast (Space Grotesk + JetBrains Mono).
// Internal light/dark toggle.

const vibePalettes = {
  light: {
    bg: '#f4f4ef',
    surface: '#ffffff',
    ink: '#0e0e0e',
    inkDim: '#5f5f5f',
    inkSubtle: '#9d9d9d',
    line: '#0e0e0e',
    lineSoft: 'rgba(14,14,14,0.16)',
    primary: '#2E5BFF',
    primaryInk: '#ffffff',
    primarySoft: 'rgba(46,91,255,0.10)',
    magenta: '#FF3D6E',
    lime: '#C8FF1F',
    yellow: '#FFB400',
    error: '#E11D48',
    errorBg: 'rgba(225,29,72,0.08)',
    input: '#ffffff',
    chip: '#0e0e0e',
    chipInk: '#f4f4ef',
    grid: 'rgba(14,14,14,0.06)',
  },
  dark: {
    bg: '#0c0c0c',
    surface: '#161616',
    ink: '#f4f4ef',
    inkDim: '#9a9a9a',
    inkSubtle: '#5f5f5f',
    line: '#f4f4ef',
    lineSoft: 'rgba(244,244,239,0.18)',
    primary: '#5C84FF',
    primaryInk: '#0c0c0c',
    primarySoft: 'rgba(92,132,255,0.14)',
    magenta: '#FF6691',
    lime: '#D4FF4D',
    yellow: '#FFCC4D',
    error: '#FF6B81',
    errorBg: 'rgba(255,107,129,0.10)',
    input: '#1a1a1a',
    chip: '#f4f4ef',
    chipInk: '#0c0c0c',
    grid: 'rgba(244,244,239,0.06)',
  },
};

const VIBE_CATEGORIES = [
  { name: 'salud',    color: '#FF3D6E', pct: 78 },
  { name: 'estudio',  color: '#2E5BFF', pct: 42 },
  { name: 'mente',    color: '#C8FF1F', pct: 92 },
  { name: 'trabajo',  color: '#FFB400', pct: 64 },
  { name: 'familia',  color: '#7C5CFF', pct: 55 },
];

function VibeLogo({ ink, accent }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 26, height: 26, position: 'relative',
        background: ink,
      }}>
        <div style={{
          position: 'absolute', inset: 4, background: accent,
        }} />
        <div style={{
          position: 'absolute', width: 8, height: 8, background: ink,
          right: -3, bottom: -3,
        }} />
      </div>
      <span style={{
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: ink,
      }}>atomic</span>
      <span style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11, color: ink, opacity: 0.5, marginLeft: -2,
      }}>/goals</span>
    </div>
  );
}

function VibeThemeToggle({ theme, onToggle, palette }) {
  const isDark = theme === 'dark';
  return (
    <button onClick={onToggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 0,
        background: 'transparent',
        border: `1.5px solid ${palette.line}`,
        borderRadius: 0,
        cursor: 'pointer', padding: 0, overflow: 'hidden',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
      {['SUN','MOON'].map((k, i) => {
        const active = (k === 'SUN') === !isDark;
        return (
          <span key={k} style={{
            padding: '7px 12px',
            background: active ? palette.ink : 'transparent',
            color: active ? palette.bg : palette.ink,
            transition: 'background .15s, color .15s',
          }}>{k === 'SUN' ? 'sun' : 'moon'}</span>
        );
      })}
    </button>
  );
}

function VibeLabel({ children, palette, accent, error }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
      color: error ? palette.error : palette.inkDim,
      marginBottom: 8,
    }}>
      <span style={{
        width: 6, height: 6, background: error ? palette.error : (accent || palette.ink),
      }} />
      {children}
    </div>
  );
}

function VibeInput({ palette, error, ...props }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        {...props}
        onFocus={(e) => { setFocus(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocus(false); props.onBlur?.(e); }}
        style={{
          width: '100%', boxSizing: 'border-box',
          height: 48, padding: '0 16px',
          border: `1.5px solid ${error ? palette.error : palette.line}`,
          background: error ? palette.errorBg : palette.input,
          color: palette.ink,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 15, fontWeight: 500, letterSpacing: '-0.005em',
          outline: 'none',
          transition: 'box-shadow .15s, background .15s',
          boxShadow: focus
            ? `4px 4px 0 0 ${error ? palette.error : palette.primary}`
            : '0 0 0 0 transparent',
        }}
      />
    </div>
  );
}

function VibePassword({ palette, error, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          height: 48, padding: '0 64px 0 16px',
          border: `1.5px solid ${error ? palette.error : palette.line}`,
          background: error ? palette.errorBg : palette.input,
          color: palette.ink,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 15, fontWeight: 500, letterSpacing: '-0.005em',
          outline: 'none',
          transition: 'box-shadow .15s, background .15s',
          boxShadow: focus
            ? `4px 4px 0 0 ${error ? palette.error : palette.primary}`
            : '0 0 0 0 transparent',
        }}
      />
      <button type="button" onClick={() => setShow(s => !s)}
        style={{
          position: 'absolute', right: 8, top: 8, height: 30, padding: '0 10px',
          background: palette.ink, color: palette.bg, border: 'none', cursor: 'pointer',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{show ? 'hide' : 'show'}</button>
    </div>
  );
}

function VibeError({ error, palette }) {
  return (
    <div style={{
      minHeight: 18, marginTop: 6,
      fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
      color: palette.error, letterSpacing: '0.02em',
      transition: 'opacity .2s',
      opacity: error ? 1 : 0,
    }}>{error ? `▲ ${error}` : '\u00A0'}</div>
  );
}

function VibeSubmit({ palette, label, busy, success }) {
  return (
    <button
      type="submit"
      disabled={busy || success}
      style={{
        position: 'relative',
        width: '100%', height: 56,
        border: `1.5px solid ${palette.line}`,
        background: success ? palette.lime : palette.ink,
        color: success ? palette.line : palette.bg,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: 16, fontWeight: 700, letterSpacing: '-0.005em',
        cursor: busy || success ? 'default' : 'pointer',
        textTransform: 'none',
        transition: 'background .2s, color .2s, transform .12s, box-shadow .12s',
        boxShadow: `5px 5px 0 0 ${palette.primary}`,
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => { if (!busy && !success) e.currentTarget.style.boxShadow = `8px 8px 0 0 ${palette.primary}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `5px 5px 0 0 ${palette.primary}`; }}
      onMouseDown={(e) => { if (!busy && !success) e.currentTarget.style.transform = 'translate(2px, 2px)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        opacity: busy || success ? 0 : 1, transition: 'opacity .15s',
      }}>
        {label} <span style={{ fontSize: 18 }}>→</span>
      </span>
      {busy && (
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6,
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              width: 8, height: 8, background: palette.bg,
              animation: `vibe-pulse 1s ease ${i * 0.15}s infinite`,
            }} />
          ))}
        </span>
      )}
      {success && (
        <span style={{
          position: 'absolute', inset: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 16, fontWeight: 700, color: palette.line,
        }}>
          <span style={{
            width: 22, height: 22, border: `2px solid ${palette.line}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>✓</span>
          dentro
        </span>
      )}
      <style>{`@keyframes vibe-pulse { 0%, 60%, 100% { opacity: .3; transform: scale(1) } 30% { opacity: 1; transform: scale(1.3) } }`}</style>
    </button>
  );
}

function StreakBar({ days = 7, current = 5, palette, color }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: days }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 14,
          background: i < current ? color : palette.lineSoft,
          transition: 'background .25s',
        }} />
      ))}
    </div>
  );
}

function AuthVibrantApp() {
  const [mode, setMode] = React.useState('login');
  const [theme, setTheme] = React.useState('light');
  const [values, setValues] = React.useState({ email: '', password: '', name: '', confirm: '' });
  const [touched, setTouched] = React.useState({});
  const [submitAttempt, setSubmitAttempt] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [quoteIdx, setQuoteIdx] = React.useState(0);
  const palette = vibePalettes[theme];

  React.useEffect(() => {
    const id = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const errors = {
    email: validateEmail(values.email),
    password: validatePassword(values.password, mode === 'register' ? 8 : 6),
    name: mode === 'register' ? validateName(values.name) : null,
    confirm: mode === 'register' ? validateConfirm(values.password, values.confirm) : null,
  };
  const showError = (k) => (touched[k] || submitAttempt) ? errors[k] : null;
  const formValid = Object.values(errors).every(e => !e);

  const setVal = (k, v) => setValues(p => ({ ...p, [k]: v }));
  const blur = (k) => setTouched(p => ({ ...p, [k]: true }));

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setTouched({});
    setSubmitAttempt(false);
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setSubmitAttempt(true);
    if (!formValid || submitting || success) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSubmitAttempt(false);
        setTouched({});
      }, 2400);
    }, 950);
  };

  const quote = QUOTES[quoteIdx];

  return (
    <div style={{
      width: '100%', height: '100%',
      background: palette.bg, color: palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid texture background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${palette.grid} 1px, transparent 1px), linear-gradient(90deg, ${palette.grid} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Bold corner color blocks */}
      <div style={{
        position: 'absolute', right: -60, top: -60,
        width: 240, height: 240, background: palette.magenta,
        transform: 'rotate(8deg)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: -40, bottom: -80,
        width: 200, height: 200, background: palette.lime,
        transform: 'rotate(-12deg)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 80, bottom: 60,
        width: 36, height: 36, background: palette.yellow,
        pointerEvents: 'none',
      }} />

      {/* Top bar */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 36px',
      }}>
        <VibeLogo ink={palette.line} accent={palette.lime} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            background: palette.surface,
            border: `1.5px solid ${palette.line}`,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: palette.magenta,
              animation: 'vibe-blink 1.6s ease-in-out infinite',
            }} />
            1247 en racha · ahora
          </div>
          <VibeThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>
      </div>
      <style>{`@keyframes vibe-blink { 0%, 100% { opacity: 1 } 50% { opacity: .35 } }`}</style>

      {/* Main grid */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: '1.15fr 1fr',
        gap: 32,
        padding: '0 36px',
        height: 'calc(100% - 88px)',
      }}>
        {/* LEFT — form card */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Big headline */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: palette.inkDim, marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 24, height: 1.5, background: palette.line }} />
              {mode === 'login' ? 'iniciar sesión' : 'crear cuenta'}
              <span style={{ marginLeft: 6, color: palette.inkSubtle }}>
                / {mode === 'login' ? '01' : '02'} de 02
              </span>
            </div>
            <h1 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 64, lineHeight: 0.92, letterSpacing: '-0.035em',
              fontWeight: 700, textWrap: 'pretty',
            }}>
              {mode === 'login' ? (
                <>Vuelve<br/>al <span style={{
                  background: palette.lime, color: palette.line,
                  padding: '0 8px', fontStyle: 'italic', display: 'inline-block',
                }}>ritmo</span>.</>
              ) : (
                <>Día <span style={{
                  background: palette.magenta, color: palette.bg,
                  padding: '0 10px', display: 'inline-block',
                }}>uno</span><br/>otra vez.</>
              )}
            </h1>
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit} style={{
            position: 'relative',
            background: palette.surface,
            border: `1.5px solid ${palette.line}`,
            padding: 28,
            maxWidth: 520,
            boxShadow: `8px 8px 0 0 ${palette.line}`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'stretch',
              borderBottom: `1.5px solid ${palette.line}`,
              margin: '-28px -28px 24px',
            }}>
              {[['login','Entrar'],['register','Crear cuenta']].map(([k,l]) => (
                <button key={k} type="button" onClick={() => switchMode(k)}
                  style={{
                    flex: 1, padding: '16px 12px',
                    background: mode === k ? palette.line : 'transparent',
                    color: mode === k ? palette.bg : palette.ink,
                    border: 'none', cursor: 'pointer',
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14, fontWeight: 600,
                    letterSpacing: '-0.005em',
                    borderRight: k === 'login' ? `1.5px solid ${palette.line}` : 'none',
                    transition: 'background .15s, color .15s',
                  }}>{l}</button>
              ))}
            </div>

            {mode === 'register' && (
              <div style={{ marginBottom: 14 }}>
                <VibeLabel palette={palette} accent={palette.magenta} error={showError('name')}>nombre</VibeLabel>
                <VibeInput
                  palette={palette} error={showError('name')}
                  type="text" placeholder="Sofía" autoComplete="given-name"
                  value={values.name}
                  onChange={(e) => setVal('name', e.target.value)}
                  onBlur={() => blur('name')}
                />
                <VibeError error={showError('name')} palette={palette} />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <VibeLabel palette={palette} accent={palette.primary} error={showError('email')}>correo</VibeLabel>
              <VibeInput
                palette={palette} error={showError('email')}
                type="email" placeholder="tu@correo.com" autoComplete="email"
                value={values.email}
                onChange={(e) => setVal('email', e.target.value)}
                onBlur={() => blur('email')}
              />
              <VibeError error={showError('email')} palette={palette} />
            </div>

            <div style={{ marginBottom: mode === 'register' ? 14 : 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <VibeLabel palette={palette} accent={palette.yellow} error={showError('password')}>contraseña</VibeLabel>
                {mode === 'login' && (
                  <a href="#" style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: palette.primary, textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}>recuperar →</a>
                )}
              </div>
              <VibePassword
                palette={palette} error={showError('password')}
                value={values.password}
                onChange={(e) => setVal('password', e.target.value)}
                placeholder={mode === 'register' ? 'mínimo 8 caracteres' : '••••••••'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
              {mode === 'register' && values.password && (
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4,
                      background: i < pwStrength(values.password)
                        ? (pwStrength(values.password) >= 3 ? palette.lime : pwStrength(values.password) === 2 ? palette.yellow : palette.magenta)
                        : palette.lineSoft,
                      transition: 'background .2s',
                    }} />
                  ))}
                </div>
              )}
              <VibeError error={showError('password')} palette={palette} />
            </div>

            {mode === 'register' && (
              <div style={{ marginBottom: 22 }}>
                <VibeLabel palette={palette} accent={palette.lime} error={showError('confirm')}>confírmala</VibeLabel>
                <VibeInput
                  palette={palette} error={showError('confirm')}
                  type="password" placeholder="otra vez" autoComplete="new-password"
                  value={values.confirm}
                  onChange={(e) => setVal('confirm', e.target.value)}
                  onBlur={() => blur('confirm')}
                />
                <VibeError error={showError('confirm')} palette={palette} />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <VibeSubmit
                palette={palette}
                busy={submitting}
                success={success}
                label={mode === 'login' ? 'entrar' : 'crear cuenta'}
              />
              <Confetti trigger={success} colors={[palette.primary, palette.magenta, palette.lime, palette.yellow]} />
            </div>

            <div style={{
              marginTop: 18, display: 'flex', justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              color: palette.inkDim, letterSpacing: '0.04em',
            }}>
              <span>demo · cualquier correo válido</span>
              <span style={{ display: 'inline-flex', gap: 6 }}>
                <span style={{ width: 8, height: 8, background: palette.line }} />
                <span style={{ width: 8, height: 8, background: formValid ? palette.lime : palette.lineSoft }} />
                <span style={{ width: 8, height: 8, background: success ? palette.lime : palette.lineSoft }} />
              </span>
            </div>
          </form>
        </div>

        {/* RIGHT — side info column */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 18,
          justifyContent: 'center',
          paddingRight: 12,
        }}>
          {/* Streak card */}
          <div style={{
            background: palette.line, color: palette.bg,
            padding: 22,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              opacity: 0.55, marginBottom: 10,
            }}>tu racha · semana actual</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
              <span style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 84, fontWeight: 700, lineHeight: 0.85,
                letterSpacing: '-0.04em',
              }}>23</span>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12, letterSpacing: '0.08em',
                opacity: 0.7,
              }}>días seguidos</span>
            </div>
            <StreakBar days={7} current={5} palette={{ lineSoft: 'rgba(255,255,255,0.18)' }} color={palette.lime} />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 8,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5,
            }}>
              <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>
            <div style={{
              marginTop: 18, fontSize: 12,
              fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.04em',
              opacity: 0.6,
            }}>récord personal · 47 días</div>
          </div>

          {/* Categories preview */}
          <div style={{
            background: palette.surface,
            border: `1.5px solid ${palette.line}`,
            padding: '18px 20px',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 14,
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: palette.inkDim,
              }}>tus categorías</div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11, color: palette.inkSubtle,
              }}>5/12</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {VIBE_CATEGORIES.map((c, i) => (
                <div key={c.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ width: 14, height: 14, background: c.color }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
                      display: 'flex', justifyContent: 'space-between',
                    }}>
                      <span>{c.name}</span>
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 11, color: palette.inkDim,
                      }}>{c.pct}%</span>
                    </div>
                    <div style={{ marginTop: 4, height: 4, background: palette.lineSoft, position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: `${c.pct}%`, background: c.color,
                        transition: 'width .4s',
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div style={{
            position: 'relative',
            padding: '16px 18px',
            background: palette.lime, color: palette.line,
            transform: 'rotate(-1deg)',
            border: `1.5px solid ${palette.line}`,
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
              marginBottom: 8, opacity: 0.6,
            }}>cita del día</div>
            <blockquote key={quoteIdx} style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 15, lineHeight: 1.3, fontWeight: 600,
              letterSpacing: '-0.01em', textWrap: 'pretty',
              animation: 'vibe-fade .6s ease',
            }}>"{quote.text}"</blockquote>
            <div style={{
              marginTop: 6,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
              opacity: 0.7,
            }}>— {quote.source}</div>
          </div>
          <style>{`@keyframes vibe-fade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }`}</style>
        </div>
      </div>
    </div>
  );
}

window.AuthVibrantApp = AuthVibrantApp;
