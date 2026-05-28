// Shared utilities for both auth variations.
// Lives on window so each variation file can pick what it needs.

const QUOTES = [
  { text: "Los hábitos son el interés compuesto del progreso personal.", source: "James Clear" },
  { text: "No subes al nivel de tus metas — caes al nivel de tus sistemas.", source: "James Clear" },
  { text: "Pequeños cambios, resultados extraordinarios.", source: "Hábitos Atómicos" },
  { text: "Lo que haces todos los días importa más que lo que haces de vez en cuando.", source: "Gretchen Rubin" },
  { text: "Una meta sin un sistema es solo un deseo.", source: "Antoine de Saint-Exupéry" },
  { text: "Hoy también cuenta. Sobre todo hoy.", source: "Recordatorio" },
];

const REGISTER_INTROS = [
  "Empieza una racha que no se rompa.",
  "Una meta a la vez. Empezando hoy.",
  "Hábitos atómicos. Resultados compuestos.",
];

function validateEmail(v) {
  if (!v) return "Necesitamos tu correo para encontrarte.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Ese correo no parece válido.";
  return null;
}
function validatePassword(v, min = 8) {
  if (!v) return "Pon una contraseña.";
  if (v.length < min) return `Al menos ${min} caracteres — un poquito más.`;
  return null;
}
function validateName(v) {
  if (!v || !v.trim()) return "¿Cómo te llamamos?";
  if (v.trim().length < 2) return "Un poquito más largo, ¿sí?";
  return null;
}
function validateConfirm(pw, c) {
  if (!c) return "Confírmala una vez más.";
  if (pw !== c) return "No coinciden. Inténtalo de nuevo.";
  return null;
}

// Strength meter — 0..4
function pwStrength(v) {
  if (!v) return 0;
  let s = 0;
  if (v.length >= 8) s++;
  if (v.length >= 12) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v) || /[^a-zA-Z0-9]/.test(v)) s++;
  return Math.min(4, s);
}

// Deterministic pseudo-random cells for the streak grid.
function seededCells(n, density, seed = 42) {
  const out = [];
  let s = seed >>> 0;
  for (let i = 0; i < n; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const r = s / 4294967295;
    if (r < density) {
      out.push(r < density * 0.3 ? 0.45 : r < density * 0.65 ? 0.7 : 1);
    } else {
      out.push(0);
    }
  }
  return out;
}

function StreakGrid({
  density = 0.6,
  accent = '#d97757',
  dim = 'rgba(0,0,0,0.06)',
  size = 12,
  gap = 4,
  rows = 7,
  cols = 14,
  seed = 42,
  radius = null,
}) {
  const cells = React.useMemo(
    () => seededCells(rows * cols, density, seed),
    [density, rows, cols, seed]
  );
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${size}px)`,
      gridTemplateRows: `repeat(${rows}, ${size}px)`,
      gap,
    }}>
      {cells.map((v, i) => (
        <div key={i} style={{
          width: size,
          height: size,
          borderRadius: radius ?? Math.max(2, size * 0.22),
          background: v === 0 ? dim : accent,
          opacity: v === 0 ? 1 : 0.35 + v * 0.65,
          transition: 'background .25s, opacity .25s',
        }} />
      ))}
    </div>
  );
}

// Burst of dots emitted from center; used on successful login.
function Confetti({ trigger, colors = ['#d97757', '#f0b942', '#5a8f6e', '#e88a6f'] }) {
  if (!trigger) return null;
  const N = 32;
  const dots = React.useMemo(() => {
    return Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 90 + Math.random() * 160;
      return {
        i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 20,
        size: 5 + Math.random() * 7,
        color: colors[i % colors.length],
        delay: Math.random() * 60,
        round: i % 3 === 0,
      };
    });
  }, [trigger]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      <style>{`
        @keyframes confetti-burst {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          40% { transform: translate(-50%, -50%) translate(var(--dx-mid), var(--dy-mid)) scale(1.1) rotate(180deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--dx), calc(var(--dy) + 220px)) scale(.5) rotate(540deg); opacity: 0; }
        }
      `}</style>
      {dots.map((d) => (
        <div key={d.i} style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: d.size,
          height: d.size,
          borderRadius: d.round ? '50%' : 2,
          background: d.color,
          animation: `confetti-burst 1100ms cubic-bezier(.2,.7,.3,1) ${d.delay}ms forwards`,
          ['--dx']: `${d.dx}px`,
          ['--dy']: `${d.dy}px`,
          ['--dx-mid']: `${d.dx * 0.55}px`,
          ['--dy-mid']: `${d.dy * 0.55}px`,
        }} />
      ))}
    </div>
  );
}

// Tiny "flame" mark used to dress up streak labels — no SVG-faking, just
// stacked circles/ellipses tinted with the warm palette.
function FlameMark({ size = 16, color = '#d97757', inner = '#f0b942' }) {
  return (
    <div style={{
      width: size, height: size * 1.15, position: 'relative',
      display: 'inline-flex', verticalAlign: '-2px',
    }}>
      <div style={{
        position: 'absolute', inset: 0, background: color,
        borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
        transform: 'rotate(-6deg)',
      }} />
      <div style={{
        position: 'absolute', left: '22%', right: '22%', bottom: 0, top: '38%',
        background: inner,
        borderRadius: '50% 50% 50% 50% / 60% 60% 35% 35%',
      }} />
    </div>
  );
}

Object.assign(window, {
  QUOTES, REGISTER_INTROS,
  validateEmail, validatePassword, validateName, validateConfirm,
  pwStrength, StreakGrid, Confetti, FlameMark,
});
