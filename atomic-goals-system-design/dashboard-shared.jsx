// Dashboard — shared theme, mock data, chart primitives.
// Reuses the "Vibrante" graphic language (Space Grotesk + JetBrains Mono,
// bold borders, color blocks, hard shadows).
// Names here are dash-prefixed so they don't collide with auth-vibrant's
// globals.

const dashPalettes = {
  light: {
    bg: '#f4f4ef',
    surface: '#ffffff',
    surface2: '#fafaf6',
    ink: '#0e0e0e',
    inkDim: '#5f5f5f',
    inkSubtle: '#9d9d9d',
    line: '#0e0e0e',
    lineSoft: 'rgba(14,14,14,0.16)',
    lineSofter: 'rgba(14,14,14,0.08)',
    primary: '#2E5BFF',
    primaryInk: '#ffffff',
    primarySoft: 'rgba(46,91,255,0.10)',
    magenta: '#FF3D6E',
    lime: '#C8FF1F',
    yellow: '#FFB400',
    purple: '#7C5CFF',
    sky: '#1FD1F9',
    grid: 'rgba(14,14,14,0.06)',
  },
  dark: {
    bg: '#0c0c0c',
    surface: '#161616',
    surface2: '#1d1d1d',
    ink: '#f4f4ef',
    inkDim: '#9a9a9a',
    inkSubtle: '#666666',
    line: '#f4f4ef',
    lineSoft: 'rgba(244,244,239,0.18)',
    lineSofter: 'rgba(244,244,239,0.08)',
    primary: '#5C84FF',
    primaryInk: '#0c0c0c',
    primarySoft: 'rgba(92,132,255,0.14)',
    magenta: '#FF6691',
    lime: '#D4FF4D',
    yellow: '#FFCC4D',
    purple: '#9B7FFF',
    sky: '#5DDFFA',
    grid: 'rgba(244,244,239,0.05)',
  },
};

const DASH_CATEGORIES = [
  { name: 'salud',     color: '#FF3D6E', pct: 78, goals: 3 },
  { name: 'estudio',   color: '#2E5BFF', pct: 42, goals: 2 },
  { name: 'mente',     color: '#C8FF1F', pct: 92, goals: 2 },
  { name: 'trabajo',   color: '#FFB400', pct: 64, goals: 4 },
  { name: 'familia',   color: '#7C5CFF', pct: 55, goals: 1 },
  { name: 'finanzas',  color: '#1FD1F9', pct: 33, goals: 1 },
];

const DASH_UPCOMING = [
  { goal: 'Correr 5km', step: 'Sesión de 30 min · pasos restantes', cat: 'salud', color: '#FF3D6E', when: 'hoy', time: '18:00', progress: 60, type: 'cyclic' },
  { goal: 'Curso de inglés B2', step: 'Lección 12 — Past perfect', cat: 'estudio', color: '#2E5BFF', when: 'mañana', time: '07:30', progress: 25, type: 'concl' },
  { goal: 'Meditar todos los días', step: 'Sesión guiada · 10 min', cat: 'mente', color: '#C8FF1F', when: 'hoy', time: '21:00', progress: 85, type: 'cyclic' },
  { goal: 'Leer 12 libros', step: '"Hábitos atómicos" · cap. 7', cat: 'mente', color: '#C8FF1F', when: 'jue 30', time: null, progress: 40, type: 'concl' },
  { goal: 'Llamar a mamá', step: 'Cada domingo', cat: 'familia', color: '#7C5CFF', when: 'dom 2 jun', time: '11:00', progress: 0, type: 'cyclic' },
];

const DASH_ACTIVITY = [
  { kind: 'completed', text: 'Completaste', strong: 'Meditar 10 min', when: 'hace 2h', color: '#C8FF1F' },
  { kind: 'progress',  text: 'Avanzaste en', strong: 'Correr 5km', detail: '3 / 5 km', when: 'hace 4h', color: '#FF3D6E' },
  { kind: 'created',   text: 'Nueva meta', strong: 'Leer 12 libros', when: 'ayer', color: '#C8FF1F' },
  { kind: 'streak',    text: 'Racha', strong: '23 días', detail: 'récord superado', when: 'ayer', color: '#FFB400' },
  { kind: 'completed', text: 'Completaste', strong: 'Inglés · Lección 11', when: 'hace 2 días', color: '#2E5BFF' },
  { kind: 'progress',  text: 'Actualizaste pasos en', strong: 'Curso B2', when: 'hace 3 días', color: '#2E5BFF' },
];

// 30 days of activity intensity 0..3 (deterministic).
const DASH_TIMELINE = (() => {
  const out = [];
  let s = 7;
  for (let i = 0; i < 30; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const r = s / 4294967295;
    out.push(r < 0.15 ? 0 : r < 0.4 ? 1 : r < 0.75 ? 2 : 3);
  }
  // bias last few days higher to feel like momentum
  out[27] = 3; out[28] = 3; out[29] = 2;
  return out;
})();

const DASH_NAV = [
  { id: 'dashboard',  label: 'Dashboard',  count: null },
  { id: 'goals',      label: 'Metas',      count: 13 },
  { id: 'categories', label: 'Categorías', count: 6 },
  { id: 'calendar',   label: 'Calendario', count: null },
  { id: 'activity',   label: 'Actividad',  count: null },
  { id: 'trash',      label: 'Papelera',   count: 2 },
];

// ─── Components ────────────────────────────────────────────

// Tiny inline icon — squares & lines only, no fake handcrafted SVG.
function DashIcon({ kind, size = 16, color }) {
  const s = size;
  const c = color || 'currentColor';
  const stroke = 1.6;
  const common = { width: s, height: s, viewBox: '0 0 16 16', fill: 'none', stroke: c, strokeWidth: stroke, strokeLinecap: 'square' };
  switch (kind) {
    case 'square': return <svg {...common}><rect x="2" y="2" width="12" height="12"/></svg>;
    case 'plus':   return <svg {...common}><path d="M8 2v12M2 8h12"/></svg>;
    case 'arrow':  return <svg {...common}><path d="M3 8h10M9 4l4 4-4 4"/></svg>;
    case 'check':  return <svg {...common}><path d="M3 8.5l3.5 3.5L13 5"/></svg>;
    case 'bell':   return <svg {...common}><path d="M4 11V8a4 4 0 018 0v3l1.5 1.5H2.5L4 11zM6.5 13.5h3"/></svg>;
    case 'search': return <svg {...common}><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>;
    case 'flame':  return <svg {...common}><path d="M8 14c2.5 0 4-1.8 4-4 0-2-1.5-3-2-5-1.5 1.5-2 2.5-3 2.5C6 7.5 5 6.5 5 5 4 7 4 8.5 4 10c0 2.2 1.5 4 4 4z"/></svg>;
    case 'caret':  return <svg {...common}><path d="M5 6l3 4 3-4"/></svg>;
    default: return null;
  }
}

// Toggle (re-implemented locally to match dashPalettes)
function DashThemeToggle({ theme, onToggle, palette }) {
  return (
    <button onClick={onToggle}
      style={{
        display: 'inline-flex', alignItems: 'center',
        background: 'transparent',
        border: `1.5px solid ${palette.line}`,
        cursor: 'pointer', padding: 0, overflow: 'hidden',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: palette.ink,
      }}>
      {[['light','sun'],['dark','moon']].map(([k, l]) => {
        const active = theme === k;
        return (
          <span key={k} style={{
            padding: '5px 9px',
            background: active ? palette.ink : 'transparent',
            color: active ? palette.bg : palette.ink,
            transition: 'background .15s, color .15s',
          }}>{l}</span>
        );
      })}
    </button>
  );
}

// Brand mark, like auth's but slightly smaller for sidebar.
function DashLogo({ ink, accent, small }) {
  const sz = small ? 22 : 26;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: sz, height: sz, position: 'relative', background: ink }}>
        <div style={{ position: 'absolute', inset: 4, background: accent }} />
        <div style={{
          position: 'absolute', width: small ? 6 : 8, height: small ? 6 : 8,
          background: ink, right: -3, bottom: -3,
        }} />
      </div>
      <span style={{
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: small ? 16 : 18, fontWeight: 700, letterSpacing: '-0.02em', color: ink,
      }}>atomic</span>
    </div>
  );
}

// 30-day activity bars
function DashTimelineBars({ data, palette, accent, height = 96 }) {
  const max = 3;
  const colors = [palette.lineSofter, accent, accent, accent];
  const opacities = [1, 0.35, 0.65, 1];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, height: v === 0 ? '14%' : `${20 + v * 26}%`,
          background: v === 0 ? palette.lineSofter : accent,
          opacity: v === 0 ? 1 : opacities[v],
          transition: 'opacity .25s, background .25s',
        }} />
      ))}
    </div>
  );
}

// Horizontal stacked progress for total share by category.
function DashCategoryStack({ items, palette, height = 14 }) {
  const total = items.reduce((s, c) => s + c.goals, 0);
  return (
    <div style={{ display: 'flex', width: '100%', height, border: `1.5px solid ${palette.line}` }}>
      {items.map((c, i) => (
        <div key={c.name} style={{
          flex: c.goals, background: c.color,
          borderRight: i < items.length - 1 ? `1.5px solid ${palette.line}` : 'none',
        }} />
      ))}
    </div>
  );
}

// Stat card used in summary row.
function DashStatCard({ palette, label, value, suffix, sub, accent, big, intent }) {
  // intent: 'streak' uses lime tint, 'goals' = primary, 'done' = white-on-black
  const isDark = intent === 'inverse';
  return (
    <div style={{
      background: isDark ? palette.line : palette.surface,
      color: isDark ? palette.bg : palette.ink,
      border: `1.5px solid ${palette.line}`,
      padding: '18px 18px 16px',
      position: 'relative', overflow: 'hidden',
      boxShadow: `4px 4px 0 0 ${accent || palette.line}`,
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: isDark ? 'rgba(244,244,239,0.6)' : palette.inkDim,
        marginBottom: 6,
      }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 6,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.9,
      }}>
        <span style={{ fontSize: big ? 52 : 40 }}>{value}</span>
        {suffix && <span style={{
          fontSize: 14,
          color: isDark ? 'rgba(244,244,239,0.6)' : palette.inkDim,
          fontWeight: 500, letterSpacing: '0.02em',
        }}>{suffix}</span>}
      </div>
      {sub && <div style={{
        marginTop: 10,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10, letterSpacing: '0.06em',
        color: isDark ? 'rgba(244,244,239,0.55)' : palette.inkDim,
      }}>{sub}</div>}
    </div>
  );
}

// Quick row in the upcoming list.
function DashUpcomingRow({ item, palette, compact }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: compact ? '4px 1fr auto' : '6px 1fr auto',
      gap: compact ? 12 : 14, alignItems: 'center',
      padding: compact ? '12px 0' : '14px 0',
      borderBottom: `1px solid ${palette.lineSofter}`,
    }}>
      <div style={{ width: compact ? 4 : 6, alignSelf: 'stretch', background: item.color }} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: compact ? 13 : 14, fontWeight: 600, letterSpacing: '-0.005em',
          color: palette.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{item.goal}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11, color: palette.inkDim, marginTop: 2,
          letterSpacing: '0.02em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{item.step}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 12, fontWeight: 600, color: palette.ink,
        }}>{item.when}</div>
        {item.time && <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10, color: palette.inkDim, letterSpacing: '0.04em',
          marginTop: 2,
        }}>{item.time}</div>}
      </div>
    </div>
  );
}

// Activity event row.
function DashActivityRow({ item, palette }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '10px 1fr auto', gap: 12,
      alignItems: 'flex-start',
      padding: '10px 0',
    }}>
      <div style={{
        width: 10, height: 10, marginTop: 6,
        background: item.color,
      }} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 13, color: palette.ink, lineHeight: 1.35,
        }}>
          {item.text}{' '}
          <span style={{ fontWeight: 700 }}>{item.strong}</span>
          {item.detail && <span style={{ color: palette.inkDim }}> · {item.detail}</span>}
        </div>
      </div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10, color: palette.inkSubtle,
        letterSpacing: '0.05em', whiteSpace: 'nowrap', marginTop: 4,
      }}>{item.when}</div>
    </div>
  );
}

Object.assign(window, {
  dashPalettes, DASH_CATEGORIES, DASH_UPCOMING, DASH_ACTIVITY,
  DASH_TIMELINE, DASH_NAV,
  DashIcon, DashThemeToggle, DashLogo,
  DashTimelineBars, DashCategoryStack, DashStatCard,
  DashUpcomingRow, DashActivityRow,
});
