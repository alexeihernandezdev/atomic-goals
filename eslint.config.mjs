import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const MODULES = [
  "auth",
  "categories",
  "goals",
  "steps",
  "dashboard",
  "calendar",
  "activity",
  "trash",
  "settings",
];

const LAYERS = ["domain", "application", "infrastructure", "presentation"];

/** Maps each layer to what it can import (within the same module) */
const LAYER_RULES = {
  domain: [],
  application: ["domain"],
  infrastructure: ["domain", "application"],
  presentation: ["domain", "application"],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/components/ui/**",
  ]),
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        // Feature modules
        ...MODULES.flatMap((mod) =>
          LAYERS.map((layer) => ({
            type: `module-${mod}-${layer}`,
            pattern: `src/modules/${mod}/${layer}/**`,
          })),
        ),
        // Shared layers
        { type: "shared-domain", pattern: "src/shared/domain/**" },
        { type: "shared-application", pattern: "src/shared/application/**" },
        {
          type: "shared-infrastructure",
          pattern: "src/shared/infrastructure/**",
        },
        { type: "shared-presentation", pattern: "src/shared/presentation/**" },
        { type: "shared-ui-kit", pattern: "src/shared/ui-kit/**" },
        { type: "shared-composition", pattern: "src/shared/composition/**" },
        // shadcn primitives (confined — only ui-kit may use them)
        { type: "shadcn", pattern: "src/components/ui/**" },
      ],
    },
    rules: {
      // Modules must not import from other modules
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            // ── module domain ──────────────────────────────────────────────
            ...MODULES.map((mod) => ({
              from: `module-${mod}-domain`,
              allow: ["shared-domain"],
            })),
            // ── module application ─────────────────────────────────────────
            ...MODULES.map((mod) => ({
              from: `module-${mod}-application`,
              allow: [
                `module-${mod}-domain`,
                "shared-domain",
                "shared-application",
              ],
            })),
            // ── module infrastructure ──────────────────────────────────────
            ...MODULES.map((mod) => ({
              from: `module-${mod}-infrastructure`,
              allow: [
                `module-${mod}-domain`,
                `module-${mod}-application`,
                "shared-domain",
                "shared-application",
                "shared-infrastructure",
              ],
            })),
            // ── module presentation ────────────────────────────────────────
            ...MODULES.map((mod) => ({
              from: `module-${mod}-presentation`,
              allow: [
                `module-${mod}-domain`,
                `module-${mod}-application`,
                "shared-domain",
                "shared-presentation",
                "shared-ui-kit",
                "shared-composition",
              ],
            })),
            // ── shared layers ──────────────────────────────────────────────
            { from: "shared-domain", allow: [] },
            { from: "shared-application", allow: ["shared-domain"] },
            {
              from: "shared-infrastructure",
              allow: ["shared-domain", "shared-application"],
            },
            {
              from: "shared-presentation",
              allow: ["shared-domain", "shared-ui-kit", "shared-composition"],
            },
            {
              from: "shared-ui-kit",
              allow: ["shared-presentation", "shadcn"],
            },
            // composition root: can use everything
            {
              from: "shared-composition",
              allow: [
                ...MODULES.flatMap((mod) =>
                  LAYERS.map((l) => `module-${mod}-${l}`),
                ),
                "shared-domain",
                "shared-application",
                "shared-infrastructure",
                "shared-presentation",
              ],
            },
            // shadcn: only ui-kit may import it
            { from: "shadcn", allow: [] },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
