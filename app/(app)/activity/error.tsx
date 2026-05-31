"use client";

export default function ActivityError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: "48px 20px", textAlign: "center" }}>
      <div style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
        Error al cargar la actividad
      </div>
      <button
        onClick={reset}
        style={{ padding: "10px 20px", cursor: "pointer", fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700 }}
      >
        Reintentar
      </button>
    </div>
  );
}
