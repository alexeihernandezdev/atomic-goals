"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import type { VibePalette } from "./AuthScreen";

interface LoginFormProps {
  onSuccess?: () => void;
  palette: VibePalette;
  action: (data: LoginFormValues) => Promise<{
    ok: boolean;
    fieldErrors?: Record<string, string[]>;
    message?: string;
  }>;
}

export function LoginForm({ action, onSuccess, palette }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const [success, setSuccess] = React.useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const result = await action(data);
    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, msgs] of Object.entries(result.fieldErrors)) {
          setError(field === "_" ? "root" : (field as keyof LoginFormValues), {
            message: msgs[0],
          });
        }
      }
      return;
    }
    setSuccess(true);
    setTimeout(() => onSuccess?.(), 800);
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      {errors.root && (
        <VibeAlert message={errors.root.message ?? ""} palette={palette} />
      )}

      <div style={{ marginBottom: 14 }}>
        <VibeLabel palette={palette} accent={palette.primary} error={errors.email?.message}>
          correo
        </VibeLabel>
        <VibeInput
          palette={palette}
          error={errors.email?.message}
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          {...register("email")}
        />
        <VibeError error={errors.email?.message} palette={palette} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <VibeLabel palette={palette} accent={palette.yellow} error={errors.password?.message}>
            contraseña
          </VibeLabel>
          <a
            href="/forgot-password"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: palette.primary,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            recuperar →
          </a>
        </div>
        <VibePasswordInput
          palette={palette}
          error={errors.password?.message}
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
        />
        <VibeError error={errors.password?.message} palette={palette} />
      </div>

      <VibeSubmit
        palette={palette}
        busy={isSubmitting}
        success={success}
        label="entrar"
      />

      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: palette.inkDim,
          letterSpacing: "0.04em",
        }}
      >
        <span>demo · cualquier correo válido</span>
        <span style={{ display: "inline-flex", gap: 6 }}>
          <span style={{ width: 8, height: 8, background: palette.line }} />
          <span style={{ width: 8, height: 8, background: palette.lineSoft }} />
          <span style={{ width: 8, height: 8, background: success ? palette.lime : palette.lineSoft }} />
        </span>
      </div>
    </form>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function VibeLabel({
  children,
  palette,
  accent,
  error,
}: {
  children: React.ReactNode;
  palette: VibePalette;
  accent?: string;
  error?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: error ? palette.error : palette.inkDim,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          background: error ? palette.error : (accent ?? palette.ink),
        }}
      />
      {children}
    </div>
  );
}

const VibeInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { palette: VibePalette; error?: string }
>(({ palette, error, style, ...props }, ref) => {
  const [focus, setFocus] = React.useState(false);
  return (
    <input
      ref={ref}
      onFocus={(e) => { setFocus(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); props.onBlur?.(e); }}
      style={{
        width: "100%",
        boxSizing: "border-box",
        height: 48,
        padding: "0 16px",
        border: `1.5px solid ${error ? palette.error : palette.line}`,
        background: error ? palette.errorBg : palette.input,
        color: palette.ink,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: "-0.005em",
        outline: "none",
        borderRadius: 0,
        transition: "box-shadow .15s, background .15s",
        boxShadow: focus
          ? `4px 4px 0 0 ${error ? palette.error : palette.primary}`
          : "0 0 0 0 transparent",
        ...style,
      }}
      {...props}
    />
  );
});
VibeInput.displayName = "VibeInput";

const VibePasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { palette: VibePalette; error?: string }
>(({ palette, error, ...props }, ref) => {
  const [show, setShow] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        type={show ? "text" : "password"}
        onFocus={(e) => { setFocus(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocus(false); props.onBlur?.(e); }}
        style={{
          width: "100%",
          boxSizing: "border-box",
          height: 48,
          padding: "0 64px 0 16px",
          border: `1.5px solid ${error ? palette.error : palette.line}`,
          background: error ? palette.errorBg : palette.input,
          color: palette.ink,
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: "-0.005em",
          outline: "none",
          borderRadius: 0,
          transition: "box-shadow .15s, background .15s",
          boxShadow: focus
            ? `4px 4px 0 0 ${error ? palette.error : palette.primary}`
            : "0 0 0 0 transparent",
        }}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{
          position: "absolute",
          right: 8,
          top: 8,
          height: 30,
          padding: "0 10px",
          background: palette.ink,
          color: palette.bg,
          border: "none",
          cursor: "pointer",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {show ? "hide" : "show"}
      </button>
    </div>
  );
});
VibePasswordInput.displayName = "VibePasswordInput";

function VibeError({ error, palette }: { error?: string; palette: VibePalette }) {
  return (
    <div
      style={{
        minHeight: 18,
        marginTop: 6,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
        color: palette.error,
        letterSpacing: "0.02em",
        opacity: error ? 1 : 0,
        transition: "opacity .2s",
      }}
    >
      {error ? `▲ ${error}` : " "}
    </div>
  );
}

function VibeSubmit({
  palette,
  label,
  busy,
  success,
}: {
  palette: VibePalette;
  label: string;
  busy: boolean;
  success: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  return (
    <button
      type="submit"
      disabled={busy || success}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: "relative",
        width: "100%",
        height: 56,
        border: `1.5px solid ${palette.line}`,
        background: success ? palette.lime : palette.ink,
        color: success ? palette.line : palette.bg,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: "-0.005em",
        cursor: busy || success ? "default" : "pointer",
        transition: "background .2s, color .2s, box-shadow .12s",
        boxShadow: pressed
          ? `2px 2px 0 0 ${palette.primary}`
          : hovered
          ? `8px 8px 0 0 ${palette.primary}`
          : `5px 5px 0 0 ${palette.primary}`,
        transform: pressed ? "translate(2px,2px)" : "none",
        overflow: "hidden",
        borderRadius: 0,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          opacity: busy || success ? 0 : 1,
          transition: "opacity .15s",
        }}
      >
        {label} <span style={{ fontSize: 18 }}>→</span>
      </span>

      {busy && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 8,
                height: 8,
                background: palette.bg,
                animation: `vibe-pulse 1s ease ${i * 0.15}s infinite`,
              }}
            />
          ))}
          <style>{`@keyframes vibe-pulse { 0%, 60%, 100% { opacity: .3; transform: scale(1) } 30% { opacity: 1; transform: scale(1.3) } }`}</style>
        </span>
      )}

      {success && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 16,
            fontWeight: 700,
            color: palette.line,
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              border: `2px solid ${palette.line}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </span>
          dentro
        </span>
      )}
    </button>
  );
}

function VibeAlert({ message, palette }: { message: string; palette: VibePalette }) {
  return (
    <div
      style={{
        marginBottom: 16,
        padding: "10px 14px",
        background: palette.errorBg,
        border: `1.5px solid ${palette.error}`,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
        color: palette.error,
        letterSpacing: "0.02em",
      }}
    >
      ▲ {message}
    </div>
  );
}

// Export shared components for RegisterForm
export { VibeLabel, VibeInput, VibePasswordInput, VibeError, VibeSubmit, VibeAlert };
