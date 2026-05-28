// Goals shared — data + the 4 step type components (interactive).
// Reuses dashPalettes, DashIcon, DASH_CATEGORIES, DashThemeToggle, DashLogo,
// DASH_NAV from dashboard-shared.jsx.

const GOALS_LIST = [
  {
    id: 'g1', name: 'Correr 5km sin parar', cat: 'salud', color: '#FF3D6E',
    type: 'concl', status: 'in_progress', progress: 60,
    startDate: '12 may', endDate: '30 jun', stepsDone: 3, stepsTotal: 6,
    next: 'Sesión de 30 min', description: 'Pasar de caminar a correr 5km continuos.',
  },
  {
    id: 'g2', name: 'Meditar todos los días', cat: 'mente', color: '#C8FF1F',
    type: 'cyclic', period: 'diaria', status: 'in_progress', progress: 85,
    startDate: '01 ene', endDate: '—', stepsDone: 23, stepsTotal: 28,
    next: 'Sesión guiada · 10 min', description: 'Una sesión guiada cada día.',
  },
  {
    id: 'g3', name: 'Curso de inglés B2', cat: 'estudio', color: '#2E5BFF',
    type: 'concl', status: 'in_progress', progress: 25,
    startDate: '02 mar', endDate: '15 dic', stepsDone: 3, stepsTotal: 12,
    next: 'Lección 12 — Past perfect', description: 'Completar 12 lecciones del curso.',
  },
  {
    id: 'g4', name: 'Leer 12 libros este año', cat: 'mente', color: '#C8FF1F',
    type: 'concl', status: 'in_progress', progress: 40,
    startDate: '01 ene', endDate: '31 dic', stepsDone: 5, stepsTotal: 12,
    next: '"Hábitos atómicos" · cap. 7', description: '12 libros · un libro al mes.',
  },
  {
    id: 'g5', name: 'Llamar a mamá los domingos', cat: 'familia', color: '#7C5CFF',
    type: 'cyclic', period: 'semanal', status: 'in_progress', progress: 55,
    startDate: '04 feb', endDate: '—', stepsDone: 11, stepsTotal: 20,
    next: 'Llamada — domingo', description: 'Cada domingo, sin falta.',
  },
  {
    id: 'g6', name: 'Entregar reporte Q2', cat: 'trabajo', color: '#FFB400',
    type: 'concl', status: 'in_progress', progress: 64,
    startDate: '01 abr', endDate: '15 jun', stepsDone: 5, stepsTotal: 8,
    next: 'Validar datos con finanzas', description: 'Cierre trimestral con presentación final.',
  },
  {
    id: 'g7', name: 'Ahorrar $5.000', cat: 'finanzas', color: '#1FD1F9',
    type: 'concl', status: 'in_progress', progress: 33,
    startDate: '01 ene', endDate: '31 dic', stepsDone: 4, stepsTotal: 12,
    next: 'Depósito mensual · mayo', description: 'Meta del año — $1.650 acumulados.',
  },
  {
    id: 'g8', name: 'Aprender SwiftUI', cat: 'trabajo', color: '#FFB400',
    type: 'concl', status: 'completed', progress: 100,
    startDate: '15 feb', endDate: '22 may', stepsDone: 10, stepsTotal: 10,
    next: null, description: 'Curso completo terminado.',
  },
  {
    id: 'g9', name: 'Yoga 3x por semana', cat: 'salud', color: '#FF3D6E',
    type: 'cyclic', period: 'semanal', status: 'in_progress', progress: 78,
    startDate: '10 mar', endDate: '—', stepsDone: 9, stepsTotal: 12,
    next: 'Vinyasa · martes 19:00', description: 'Tres sesiones cada semana.',
  },
  {
    id: 'g10', name: 'Limpiar la bandeja de entrada', cat: 'trabajo', color: '#FFB400',
    type: 'cyclic', period: 'diaria', status: 'paused', progress: 42,
    startDate: '01 abr', endDate: '—', stepsDone: 12, stepsTotal: 28,
    next: 'En pausa hasta junio', description: 'Inbox zero al final de cada día.',
  },
];

const TYPE_LABEL = { concl: 'Conclusiva', cyclic: 'Cíclica' };
const STATUS_LABEL = {
  in_progress: 'En curso',
  completed: 'Completada',
  paused: 'En pausa',
  archived: 'Archivada',
};

// ── 4 STEP TYPES ──────────────────────────────────────────

// Generic frame used by all four — handle, title, weight, % calc, actions.
function StepFrame({ palette, color, weight, title, due, percent, badge, dragHandle, children }) {
  return (
    <div style={{
      background: palette.surface,
      border: `1.5px solid ${palette.line}`,
      padding: '14px 16px',
      display: 'grid',
      gridTemplateColumns: '20px 1fr 70px',
      gap: 14, alignItems: 'flex-start',
      position: 'relative',
    }}>
      {/* drag handle */}
      <div style={{
        marginTop: 4, cursor: 'grab',
        display: 'flex', flexDirection: 'column', gap: 2,
        color: palette.inkSubtle,
      }} title="Arrastrar para reordenar">
        <div style={{ display: 'flex', gap: 2 }}>
          {[0,0].map((_, i) => <span key={i} style={{ width: 3, height: 3, background: 'currentColor' }} />)}
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[0,0].map((_, i) => <span key={i} style={{ width: 3, height: 3, background: 'currentColor' }} />)}
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[0,0].map((_, i) => <span key={i} style={{ width: 3, height: 3, background: 'currentColor' }} />)}
        </div>
      </div>

      {/* color bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        background: color,
      }} />

      <div style={{ minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: palette.ink,
          }}>{title}</span>
          {badge && (
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '2px 6px', background: palette.lineSofter,
              color: palette.inkDim,
            }}>{badge}</span>
          )}
        </div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, letterSpacing: '0.06em', marginBottom: 10,
          display: 'flex', gap: 12, flexWrap: 'wrap',
        }}>
          <span>peso · {weight}</span>
          {due && <span>vence · {due}</span>}
        </div>
        {children}
      </div>

      {/* percent + menu */}
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em',
          color: palette.ink, lineHeight: 1,
        }}>{percent}<span style={{ fontSize: 13, color: palette.inkDim }}>%</span></div>
        <button aria-label="Más acciones" style={{
          marginTop: 6, background: 'transparent', border: 'none', cursor: 'pointer',
          color: palette.inkDim, padding: 2,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 14, letterSpacing: '0.06em',
        }}>···</button>
      </div>
    </div>
  );
}

// 1. ProgressBarStep
function ProgressBarStep({ palette, color, step, weight, due }) {
  const [current, setCurrent] = React.useState(step.current);
  const target = step.target;
  const percent = Math.min(100, Math.round((current / target) * 100));
  return (
    <StepFrame
      palette={palette} color={color} weight={weight} title={step.title} due={due}
      percent={percent} badge="barra de progreso"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="number" value={current} min={0} max={target}
          onChange={(e) => setCurrent(Math.min(target, Math.max(0, Number(e.target.value) || 0)))}
          style={{
            width: 70, height: 32, padding: '0 10px',
            border: `1.5px solid ${palette.line}`, background: palette.surface,
            color: palette.ink, fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em',
            outline: 'none',
          }}
        />
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
          color: palette.inkDim, letterSpacing: '0.04em',
        }}>/ {target} {step.unit}</div>
        <div style={{ flex: 1, height: 10, background: palette.lineSofter, position: 'relative', border: `1.5px solid ${palette.line}` }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${percent}%`, background: color,
            transition: 'width .25s',
          }} />
        </div>
      </div>
    </StepFrame>
  );
}

// 2. CheckStep
function CheckStep({ palette, color, step, weight, due }) {
  const [done, setDone] = React.useState(!!step.done);
  return (
    <StepFrame
      palette={palette} color={color} weight={weight} title={step.title} due={due}
      percent={done ? 100 : 0} badge="check"
    >
      <button
        onClick={() => setDone(d => !d)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: palette.ink, padding: 0,
        }}>
        <span style={{
          width: 30, height: 30, border: `1.5px solid ${palette.line}`,
          background: done ? color : 'transparent',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s',
        }}>{done && <DashIcon kind="check" size={18} color={palette.line} />}</span>
        <span style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
          color: done ? palette.inkDim : palette.ink,
          textDecoration: done ? 'line-through' : 'none',
        }}>{done ? '¡Hecho!' : 'Marcar como hecho'}</span>
      </button>
    </StepFrame>
  );
}

// 3. StatusStep
function StatusStep({ palette, color, step, weight, due }) {
  const [idx, setIdx] = React.useState(step.statusIdx);
  const statuses = step.statuses; // [{ label, pct }]
  const current = statuses[idx];
  return (
    <StepFrame
      palette={palette} color={color} weight={weight} title={step.title} due={due}
      percent={current.pct} badge="estados"
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {statuses.map((s, i) => {
          const active = i === idx;
          return (
            <button key={s.label} onClick={() => setIdx(i)} style={{
              padding: '6px 12px',
              border: `1.5px solid ${palette.line}`,
              background: active ? color : 'transparent',
              color: active ? palette.line : palette.ink,
              cursor: 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 12, fontWeight: 700, letterSpacing: '-0.005em',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'background .15s, color .15s',
            }}>
              <span style={{
                width: 8, height: 8,
                background: active ? palette.line : color,
                opacity: active ? 1 : 0.6,
              }} />
              {s.label}
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                opacity: 0.7, letterSpacing: '0.04em',
              }}>{s.pct}%</span>
            </button>
          );
        })}
        <button title="Editar estados" style={{
          padding: '6px 8px',
          border: `1.5px dashed ${palette.lineSoft}`,
          background: 'transparent', color: palette.inkDim, cursor: 'pointer',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>+ estado</button>
      </div>
    </StepFrame>
  );
}

// 4. CounterStep
function CounterStep({ palette, color, step, weight, due }) {
  const [current, setCurrent] = React.useState(step.current);
  const max = step.max;
  const percent = Math.min(100, Math.round((current / max) * 100));
  return (
    <StepFrame
      palette={palette} color={color} weight={weight} title={step.title} due={due}
      percent={percent} badge="contador"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => setCurrent(c => Math.max(0, c - (step.stepSize || 1)))} style={{
          width: 32, height: 32, border: `1.5px solid ${palette.line}`,
          background: palette.surface, color: palette.ink, cursor: 'pointer',
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontWeight: 700, fontSize: 18, lineHeight: 1,
        }}>−</button>
        <div style={{
          minWidth: 90, height: 32, padding: '0 12px',
          border: `1.5px solid ${palette.line}`,
          background: color, color: palette.line,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>{current}</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>/ {max}</span>
          <span style={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace', marginLeft: 4, opacity: 0.8, letterSpacing: '0.04em' }}>{step.unit}</span>
        </div>
        <button onClick={() => setCurrent(c => Math.min(max, c + (step.stepSize || 1)))} style={{
          width: 32, height: 32, border: `1.5px solid ${palette.line}`,
          background: palette.ink, color: palette.bg, cursor: 'pointer',
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontWeight: 700, fontSize: 18, lineHeight: 1,
        }}>+</button>
        <div style={{
          flex: 1, marginLeft: 6,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, letterSpacing: '0.06em',
        }}>paso · {step.stepSize || 1}</div>
      </div>
    </StepFrame>
  );
}

// Steps for the detail view ("Correr 5km sin parar")
const DETAIL_STEPS = [
  { id: 's1', type: 'check', title: 'Comprar tenis adecuados', weight: 1, due: '15 may', done: true },
  { id: 's2', type: 'status', title: 'Plan de entrenamiento semanal', weight: 1, due: '20 may',
    statuses: [
      { label: 'pendiente', pct: 0 },
      { label: 'en curso', pct: 50 },
      { label: 'listo', pct: 100 },
    ], statusIdx: 1 },
  { id: 's3', type: 'progress', title: 'Distancia continua sin parar', weight: 3, due: '30 jun',
    current: 3, target: 5, unit: 'km' },
  { id: 's4', type: 'counter', title: 'Sesiones semanales', weight: 2, due: 'cada lun',
    current: 2, max: 4, unit: 'ses', stepSize: 1 },
  { id: 's5', type: 'check', title: 'Estiramiento post-entrenamiento', weight: 1, due: null, done: true },
  { id: 's6', type: 'check', title: 'Calentamiento previo · 10 min', weight: 1, due: null, done: false },
];

function renderStep(step, palette, color) {
  const common = { palette, color, step, weight: step.weight, due: step.due };
  switch (step.type) {
    case 'progress': return <ProgressBarStep {...common} />;
    case 'check':    return <CheckStep {...common} />;
    case 'status':   return <StatusStep {...common} />;
    case 'counter':  return <CounterStep {...common} />;
    default: return null;
  }
}

Object.assign(window, {
  GOALS_LIST, TYPE_LABEL, STATUS_LABEL,
  DETAIL_STEPS, renderStep,
  ProgressBarStep, CheckStep, StatusStep, CounterStep, StepFrame,
});
