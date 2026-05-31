"use client";

import * as React from "react";
import type { DashPalette } from "@/shared/presentation/palette";

export interface ConfirmDialogProps {
  palette: DashPalette;
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  palette, title, body, confirmLabel, danger = false, onCancel, onConfirm,
}: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380,
          background: palette.surface,
          border: `1.5px solid ${palette.line}`,
          boxShadow: `8px 8px 0 0 ${danger ? palette.magenta : palette.line}`,
        }}
      >
        <div
          style={{
            padding: "20px 22px 16px",
            borderBottom: `1.5px solid ${palette.line}`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                background: danger ? palette.magenta : palette.lime,
                border: `1.5px solid ${palette.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette.line,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {danger ? "!" : "↺"}
            </span>
            <h3
              id="confirm-title"
              style={{
                margin: 0,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: palette.ink,
              }}
            >
              {title}
            </h3>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13,
              lineHeight: 1.5,
              color: palette.inkDim,
            }}
          >
            {body}
          </p>
        </div>
        <div
          style={{
            padding: "14px 22px",
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 42,
              background: palette.surface,
              color: palette.ink,
              border: `1.5px solid ${palette.line}`,
              cursor: "pointer",
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1.4,
              height: 42,
              background: danger ? palette.magenta : palette.line,
              color: danger ? palette.line : palette.bg,
              border: danger ? `1.5px solid ${palette.line}` : "none",
              cursor: "pointer",
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.005em",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
