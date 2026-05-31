"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { DASH_PALETTES } from "@/shared/presentation/palette";
import type { UserProfile } from "../../domain/profile";
import { updateProfileAction, changePasswordAction } from "@/app/(app)/settings/actions";

type TabId = "profile" | "appearance" | "security";

const TABS: { id: TabId; label: string }[] = [
  { id: "profile",    label: "Perfil" },
  { id: "appearance", label: "Apariencia" },
  { id: "security",   label: "Seguridad" },
];

interface SettingsScreenProps {
  initialProfile: UserProfile | null;
}

export function SettingsScreen({ initialProfile }: SettingsScreenProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const palette = resolvedTheme === "dark" ? DASH_PALETTES.dark : DASH_PALETTES.light;

  const [tab, setTab] = React.useState<TabId>("profile");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: palette.inkDim,
            marginBottom: 4,
          }}
        >
          configuración
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: palette.ink,
          }}
        >
          Tu{" "}
          <span
            style={{
              background: palette.primary,
              color: palette.bg,
              padding: "0 8px",
            }}
          >
            espacio
          </span>
          {" "}· ajústalo.
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1.5px solid ${palette.line}`, marginBottom: 28 }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: active ? `3px solid ${palette.primary}` : "3px solid transparent",
                marginBottom: -1.5,
                cursor: "pointer",
                color: active ? palette.ink : palette.inkDim,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "-0.005em",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "profile" && (
        <ProfileTab palette={palette} initialProfile={initialProfile} />
      )}
      {tab === "appearance" && (
        <AppearanceTab palette={palette} resolvedTheme={resolvedTheme ?? "light"} setTheme={setTheme} />
      )}
      {tab === "security" && (
        <SecurityTab palette={palette} />
      )}
    </div>
  );
}

// ── Profile Tab ───────────────────────────────────────────────────────────────

function ProfileTab({
  palette,
  initialProfile,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  palette: any;
  initialProfile: UserProfile | null;
}) {
  const [name, setName] = React.useState(initialProfile?.name ?? "");
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus("saving");
    setMessage("");
    try {
      const result = await updateProfileAction({ name: name.trim() });
      if (result.ok) {
        setStatus("saved");
        setMessage("Cambios guardados.");
      } else {
        setStatus("error");
        setMessage(result.message ?? "Error al guardar.");
      }
    } catch {
      setStatus("error");
      setMessage("Error inesperado.");
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      {initialProfile === null && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: 20,
            border: `1.5px solid ${palette.line}`,
            background: palette.surface2,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            color: palette.inkDim,
            letterSpacing: "0.04em",
          }}
        >
          El endpoint de perfil no está disponible aún en este entorno.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <SettingsField
          label="Nombre"
          palette={palette}
          value={name}
          onChange={setName}
          placeholder="Tu nombre"
          disabled={initialProfile === null}
        />
        <SettingsField
          label="Email"
          palette={palette}
          value={initialProfile?.email ?? ""}
          onChange={() => {}}
          placeholder="—"
          disabled
          hint="El email no se puede modificar desde aquí."
        />

        {message && (
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.04em",
              color: status === "error" ? palette.magenta : palette.lime,
            }}
          >
            {message}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={status === "saving" || initialProfile === null}
            style={{
              padding: "11px 22px",
              background: palette.primary,
              color: palette.bg,
              border: `1.5px solid ${palette.line}`,
              cursor: status === "saving" || initialProfile === null ? "default" : "pointer",
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.005em",
              opacity: status === "saving" ? 0.7 : 1,
              transition: "opacity .12s",
            }}
          >
            {status === "saving" ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Appearance Tab ────────────────────────────────────────────────────────────

function AppearanceTab({
  palette,
  resolvedTheme,
  setTheme,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  palette: any;
  resolvedTheme: string;
  setTheme: (theme: string) => void;
}) {
  const options = [
    { id: "light", label: "Claro",    description: "Fondo blanco, tinta oscura." },
    { id: "dark",  label: "Oscuro",   description: "Fondo negro, tinta clara." },
    { id: "system",label: "Sistema",  description: "Sigue la preferencia del sistema." },
  ];

  return (
    <div style={{ maxWidth: 480 }}>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: palette.inkDim,
          marginBottom: 14,
        }}
      >
        Tema de color
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt) => {
          const active = resolvedTheme === opt.id || (opt.id === "system");
          const selected = resolvedTheme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 18px",
                border: `1.5px solid ${selected ? palette.primary : palette.line}`,
                background: selected ? palette.primarySoft ?? palette.surface2 : palette.surface,
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color .12s, background .12s",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1.5px solid ${palette.line}`,
                  background: selected ? palette.primary : palette.surface,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selected && (
                  <span style={{ color: palette.bg, fontSize: 10, fontWeight: 700 }}>✓</span>
                )}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: palette.ink,
                  }}
                >
                  {opt.label}
                </div>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    color: palette.inkDim,
                    marginTop: 2,
                    letterSpacing: "0.02em",
                  }}
                >
                  {opt.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Security Tab ──────────────────────────────────────────────────────────────

function SecurityTab({ palette }: { palette: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!current || !next || !confirm) return;
    if (next !== confirm) {
      setStatus("error");
      setMessage("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (next.length < 8) {
      setStatus("error");
      setMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setStatus("saving");
    setMessage("");
    try {
      const result = await changePasswordAction({ currentPassword: current, newPassword: next });
      if (result.ok) {
        setStatus("saved");
        setMessage("Contraseña actualizada.");
        setCurrent(""); setNext(""); setConfirm("");
      } else {
        setStatus("error");
        setMessage(result.message ?? "Error al cambiar la contraseña.");
      }
    } catch {
      setStatus("error");
      setMessage("Error inesperado.");
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <SettingsField
          label="Contraseña actual"
          palette={palette}
          value={current}
          onChange={setCurrent}
          type="password"
          placeholder="••••••••"
        />
        <SettingsField
          label="Nueva contraseña"
          palette={palette}
          value={next}
          onChange={setNext}
          type="password"
          placeholder="••••••••"
          hint="Mínimo 8 caracteres."
        />
        <SettingsField
          label="Confirmar nueva contraseña"
          palette={palette}
          value={confirm}
          onChange={setConfirm}
          type="password"
          placeholder="••••••••"
        />

        {message && (
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.04em",
              color: status === "error" ? palette.magenta : palette.lime,
            }}
          >
            {message}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={status === "saving"}
            style={{
              padding: "11px 22px",
              background: palette.primary,
              color: palette.bg,
              border: `1.5px solid ${palette.line}`,
              cursor: status === "saving" ? "default" : "pointer",
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.005em",
              opacity: status === "saving" ? 0.7 : 1,
              transition: "opacity .12s",
            }}
          >
            {status === "saving" ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── SettingsField helper ──────────────────────────────────────────────────────

function SettingsField({
  label,
  palette,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  hint,
}: {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  palette: any;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: palette.inkDim,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          padding: "10px 14px",
          border: `1.5px solid ${palette.line}`,
          background: disabled ? palette.surface2 : palette.surface,
          color: disabled ? palette.inkDim : palette.ink,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 14,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          cursor: disabled ? "default" : "text",
        }}
      />
      {hint && (
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            color: palette.inkSubtle,
            letterSpacing: "0.04em",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
