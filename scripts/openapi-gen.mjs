import { readFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filename) {
  const path = join(root, filename);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

function resolveOpenApiSpecUrl() {
  if (process.env.OPENAPI_SPEC_URL) {
    return process.env.OPENAPI_SPEC_URL;
  }

  const apiBase =
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api/v1";

  return new URL("/api/docs-json", new URL(apiBase).origin).href;
}

const specUrl = resolveOpenApiSpecUrl();
const outFile = join(root, "src/shared/infrastructure/api/schema.d.ts");

console.log(`Generating OpenAPI types from ${specUrl}`);

const result = spawnSync(
  "openapi-typescript",
  [specUrl, "-o", outFile],
  { stdio: "inherit", cwd: root, shell: true },
);

process.exit(result.status ?? 1);
