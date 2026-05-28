"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { AuthSidePanel } from "./AuthSidePanel";
import type { LoginFormValues } from "../schemas/login.schema";
import type { RegisterFormValues } from "../schemas/register.schema";

type AuthMode = "login" | "register";

export type VibePalette = typeof PALETTES.light;

const PALETTES = {
  light: {
    bg: "#f4f4ef",
    surface: "#ffffff",
    ink: "#0e0e0e",
    inkDim: "#5f5f5f",
    inkSubtle: "#9d9d9d",
    line: "#0e0e0e",
    lineSoft: "rgba(14,14,14,0.16)",
    primary: "#2E5BFF",
    primaryInk: "#ffffff",
    magenta: "#FF3D6E",
    lime: "#C8FF1F",
    yellow: "#FFB400",
    error: "#E11D48",
    errorBg: "rgba(225,29,72,0.08)",
    input: "#ffffff",
    grid: "rgba(14,14,14,0.06)",
  },
  dark: {
    bg: "#0c0c0c",
    surface: "#161616",
    ink: "#f4f4ef",
    inkDim: "#9a9a9a",
    inkSubtle: "#5f5f5f",
    line: "#f4f4ef",
    lineSoft: "rgba(244,244,239,0.18)",
    primary: "#5C84FF",
    primaryInk: "#0c0c0c",
    magenta: "#FF6691",
    lime: "#D4FF4D",
    yellow: "#FFCC4D",
    error: "#FF6B81",
    errorBg: "rgba(255,107,129,0.10)",
    input: "#1a1a1a",
    grid: "rgba(244,244,239,0.06)",
  },
};

interface AuthScreenProps {
  mode: AuthMode;
  loginAction: (data: LoginFormValues) => Promise<{
    ok: boolean;
    fieldErrors?: Record<string, string[]>;
    message?: string;
  }>;
  registerAction: (data: RegisterFormValues) => Promise<{
    ok: boolean;
    fieldErrors?: Record<string, string[]>;
    message?: string;
  }>;
}

export function AuthScreen({ mode, loginAction, registerAction }: AuthScreenProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const palette = isDark ? PALETTES.dark : PALETTES.light;

  const onSuccess = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100svh",
        background: palette.bg,
        color: palette.ink,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${palette.grid} 1px, transparent 1px), linear-gradient(90deg, ${palette.grid} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Decorative corner blocks */}
      <div aria-hidden style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, background: palette.magenta, transform: "rotate(8deg)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", left: -40, bottom: -80, width: 200, height: 200, background: palette.lime, transform: "rotate(-12deg)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", right: 80, bottom: 60, width: 36, height: 36, background: palette.yellow, pointerEvents: "none" }} />

      {/* Topbar */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 36px",
        }}
      >
        <VibeLogo ink={palette.line} lime={palette.lime} />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Streak badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              background: palette.surface,
              border: `1.5px solid ${palette.line}`,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: palette.magenta,
                animation: "vibe-blink 1.6s ease-in-out infinite",
              }}
            />
            1247 en racha · ahora
          </div>

          {/* SUN/MOON toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "transparent",
              border: `1.5px solid ${palette.line}`,
              borderRadius: 0,
              cursor: "pointer",
              padding: 0,
              overflow: "hidden",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
            aria-label="Cambiar tema"
          >
            {(["SUN", "MOON"] as const).map((k) => {
              const active = k === "SUN" ? !isDark : isDark;
              return (
                <span
                  key={k}
                  style={{
                    padding: "7px 12px",
                    background: active ? palette.ink : "transparent",
                    color: active ? palette.bg : palette.ink,
                    transition: "background .15s, color .15s",
                  }}
                >
                  {k === "SUN" ? "sun" : "moon"}
                </span>
              );
            })}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes vibe-blink { 0%, 100% { opacity: 1 } 50% { opacity: .35 } }
      `}</style>

      {/* Main grid */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          gap: 32,
          padding: "0 36px 40px",
          minHeight: "calc(100svh - 88px)",
        }}
      >
        {/* LEFT — headline + form */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Headline */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: palette.inkDim,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ width: 24, height: 1.5, background: palette.line }} />
              {mode === "login" ? "iniciar sesión" : "crear cuenta"}
              <span style={{ marginLeft: 6, color: palette.inkSubtle }}>
                / {mode === "login" ? "01" : "02"} de 02
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 64,
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                fontWeight: 700,
              }}
            >
              {mode === "login" ? (
                <>
                  Vuelve
                  <br />
                  al{" "}
                  <span
                    style={{
                      background: palette.lime,
                      color: palette.line,
                      padding: "0 8px",
                      fontStyle: "italic",
                      display: "inline-block",
                    }}
                  >
                    ritmo
                  </span>
                  .
                </>
              ) : (
                <>
                  Día{" "}
                  <span
                    style={{
                      background: palette.magenta,
                      color: palette.bg,
                      padding: "0 10px",
                      display: "inline-block",
                    }}
                  >
                    uno
                  </span>
                  <br />
                  otra vez.
                </>
              )}
            </h1>
          </div>

          {/* Form card */}
          <div
            style={{
              position: "relative",
              background: palette.surface,
              border: `1.5px solid ${palette.line}`,
              maxWidth: 520,
              boxShadow: `8px 8px 0 0 ${palette.line}`,
            }}
          >
            {/* Tab bar */}
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                borderBottom: `1.5px solid ${palette.line}`,
              }}
            >
              {([["login", "Entrar"], ["register", "Crear cuenta"]] as const).map(
                ([k, label]) => (
                  <a
                    key={k}
                    href={k === "login" ? "/login" : "/register"}
                    style={{
                      flex: 1,
                      padding: "16px 12px",
                      background: mode === k ? palette.line : "transparent",
                      color: mode === k ? palette.bg : palette.ink,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "-0.005em",
                      borderRight: k === "login" ? `1.5px solid ${palette.line}` : "none",
                      textDecoration: "none",
                      display: "block",
                      textAlign: "center",
                      transition: "background .15s, color .15s",
                    }}
                  >
                    {label}
                  </a>
                ),
              )}
            </div>

            {/* Form body */}
            <div style={{ padding: 28 }}>
              {mode === "login" ? (
                <LoginForm action={loginAction} onSuccess={onSuccess} palette={palette} />
              ) : (
                <RegisterForm action={registerAction} onSuccess={onSuccess} palette={palette} />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — side panel */}
        <AuthSidePanel palette={palette} />
      </div>
    </div>
  );
}

function VibeLogo({ ink, lime }: { ink: string; lime: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {/* Geometric mark */}
      <div style={{ width: 26, height: 26, position: "relative", background: ink }}>
        <div style={{ position: "absolute", inset: 4, background: lime }} />
        <div style={{ position: "absolute", width: 8, height: 8, background: ink, right: -3, bottom: -3 }} />
      </div>
      <span
        style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: ink,
        }}
      >
        atomic
      </span>
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: ink,
          opacity: 0.5,
          marginLeft: -2,
        }}
      >
        /goals
      </span>
    </div>
  );
}
