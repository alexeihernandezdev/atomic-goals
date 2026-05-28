import * as React from "react";
import type { VibePalette } from "./AuthScreen";

const VIBE_CATEGORIES = [
  { name: "salud",   color: "#FF3D6E", pct: 78 },
  { name: "estudio", color: "#2E5BFF", pct: 42 },
  { name: "mente",   color: "#C8FF1F", pct: 92 },
  { name: "trabajo", color: "#FFB400", pct: 64 },
  { name: "familia", color: "#7C5CFF", pct: 55 },
];

const QUOTES = [
  { text: "Los hábitos son el interés compuesto del progreso personal.", source: "James Clear" },
  { text: "No subes al nivel de tus metas — caes al nivel de tus sistemas.", source: "James Clear" },
  { text: "Pequeños cambios, resultados extraordinarios.", source: "Hábitos Atómicos" },
  { text: "Lo que haces todos los días importa más que lo que haces de vez en cuando.", source: "Gretchen Rubin" },
  { text: "Una meta sin un sistema es solo un deseo.", source: "Antoine de Saint-Exupéry" },
  { text: "Hoy también cuenta. Sobre todo hoy.", source: "Recordatorio" },
];

const STREAK_DAYS = ["L", "M", "X", "J", "V", "S", "D"];

export function AuthSidePanel({ palette }: { palette: VibePalette }) {
  const [quoteIdx, setQuoteIdx] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const quote = QUOTES[quoteIdx];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        justifyContent: "center",
        paddingRight: 12,
      }}
    >
      {/* ── Streak card — dark/ink bg ── */}
      <div
        style={{
          background: palette.line,
          color: palette.bg,
          padding: 22,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.55,
            marginBottom: 10,
          }}
        >
          tu racha · semana actual
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
          <span
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
            }}
          >
            23
          </span>
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              letterSpacing: "0.08em",
              opacity: 0.7,
            }}
          >
            días seguidos
          </span>
        </div>

        {/* Streak bar */}
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 14,
                background: i < 5 ? palette.lime : "rgba(255,255,255,0.18)",
                transition: "background .25s",
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.5,
          }}
        >
          {STREAK_DAYS.map((d) => <span key={d}>{d}</span>)}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 12,
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: "0.04em",
            opacity: 0.6,
          }}
        >
          récord personal · 47 días
        </div>
      </div>

      {/* ── Categories card — surface + border ── */}
      <div
        style={{
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: palette.inkDim,
            }}
          >
            tus categorías
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              color: palette.inkSubtle,
            }}
          >
            5/12
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {VIBE_CATEGORIES.map((c) => (
            <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Color square */}
              <div style={{ width: 14, height: 14, background: c.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                    display: "flex",
                    justifyContent: "space-between",
                    color: palette.ink,
                  }}
                >
                  <span>{c.name}</span>
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 11,
                      color: palette.inkDim,
                    }}
                  >
                    {c.pct}%
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 4,
                    height: 4,
                    background: palette.lineSoft,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${c.pct}%`,
                      background: c.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quote card — lime bg, rotated ── */}
      <div
        style={{
          position: "relative",
          padding: "16px 18px",
          background: palette.lime,
          color: palette.line,
          transform: "rotate(-1deg)",
          border: `1.5px solid ${palette.line}`,
        }}
      >
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 8,
            opacity: 0.6,
          }}
        >
          cita del día
        </div>
        <blockquote
          style={{
            margin: 0,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 15,
            lineHeight: 1.3,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            animation: "vibe-fade .6s ease",
          }}
          key={quoteIdx}
        >
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <div
          style={{
            marginTop: 6,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          — {quote.source}
        </div>
        <style>{`@keyframes vibe-fade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }`}</style>
      </div>
    </div>
  );
}
