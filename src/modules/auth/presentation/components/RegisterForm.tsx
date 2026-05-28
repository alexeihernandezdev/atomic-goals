"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "../schemas/register.schema";
import type { VibePalette } from "./AuthScreen";
import {
  VibeLabel,
  VibeInput,
  VibePasswordInput,
  VibeError,
  VibeSubmit,
  VibeAlert,
} from "./LoginForm";

function pwStrength(v: string): number {
  if (!v) return 0;
  let s = 0;
  if (v.length >= 8) s++;
  if (v.length >= 12) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v) || /[^a-zA-Z0-9]/.test(v)) s++;
  return Math.min(4, s);
}

interface RegisterFormProps {
  onSuccess?: () => void;
  palette: VibePalette;
  action: (data: RegisterFormValues) => Promise<{
    ok: boolean;
    fieldErrors?: Record<string, string[]>;
    message?: string;
  }>;
}

export function RegisterForm({ action, onSuccess, palette }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const [success, setSuccess] = React.useState(false);
  const password = watch("password", "");
  const strength = pwStrength(password);

  const strengthColor =
    strength >= 3 ? palette.lime : strength === 2 ? palette.yellow : palette.magenta;

  const onSubmit = handleSubmit(async (data) => {
    const result = await action(data);
    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, msgs] of Object.entries(result.fieldErrors)) {
          setError(field === "_" ? "root" : (field as keyof RegisterFormValues), {
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

      {/* Name */}
      <div style={{ marginBottom: 14 }}>
        <VibeLabel palette={palette} accent={palette.magenta} error={errors.name?.message}>
          nombre
        </VibeLabel>
        <VibeInput
          palette={palette}
          error={errors.name?.message}
          type="text"
          placeholder="Sofía"
          autoComplete="given-name"
          {...register("name")}
        />
        <VibeError error={errors.name?.message} palette={palette} />
      </div>

      {/* Email */}
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

      {/* Password */}
      <div style={{ marginBottom: 14 }}>
        <VibeLabel palette={palette} accent={palette.yellow} error={errors.password?.message}>
          contraseña
        </VibeLabel>
        <VibePasswordInput
          palette={palette}
          error={errors.password?.message}
          placeholder="mínimo 8 caracteres"
          autoComplete="new-password"
          {...register("password")}
        />
        {password && (
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  background: i < strength ? strengthColor : palette.lineSoft,
                  transition: "background .2s",
                }}
              />
            ))}
          </div>
        )}
        <VibeError error={errors.password?.message} palette={palette} />
      </div>

      {/* Confirm password */}
      <div style={{ marginBottom: 22 }}>
        <VibeLabel palette={palette} accent={palette.lime} error={errors.confirmPassword?.message}>
          confírmala
        </VibeLabel>
        <VibeInput
          palette={palette}
          error={errors.confirmPassword?.message}
          type="password"
          placeholder="otra vez"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        <VibeError error={errors.confirmPassword?.message} palette={palette} />
      </div>

      <VibeSubmit
        palette={palette}
        busy={isSubmitting}
        success={success}
        label="crear cuenta"
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
