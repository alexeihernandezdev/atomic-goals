# Code Review — Atomic Goals Frontend

**Fecha:** 2026-05-29  
**Rama:** `feature/fixes-final`  
**Revisado por:** Claude Code

---

## P0 — Bugs reales

### 1. `clearFilters` no resetea todos los campos

**Archivo:** `src/modules/goals/presentation/stores/goal-filters-store.ts:34`

`status` y `view` no se resetean al llamar `clearFilters`, por lo que los filtros de estado y vista persisten después de limpiar.

```ts
// Actual
clearFilters: () => set({ query: "", categoryId: null, type: "all" }),

// Correcto
clearFilters: () => set({ query: "", categoryId: null, type: "all", status: "active", view: "grid" }),
```

---

### 2. Type lie en `refresh()` — violación de contrato

**Archivo:** `src/modules/auth/infrastructure/http-auth.gateway.ts:86`

El endpoint `/auth/refresh` solo devuelve `accessToken`, pero el método retorna `user: undefined as unknown as User` para satisfacer el tipo `AuthResult` que exige `user: User` (no-opcional).

En la práctica no explota porque ambas implementaciones de `SessionGateway` ignoran el parámetro `user` — pero es una mentira de tipos que puede causar errores silenciosos si alguna implementación futura sí lo lee.

**Fix recomendado:** hacer `user?: User` en `AuthResult` en `src/modules/auth/domain/entities/user.ts`.

```ts
// Actual
export interface AuthResult {
  user: User;        // no-opcional → mentira en refresh
  accessToken: string;
  refreshToken?: string;
}

// Correcto
export interface AuthResult {
  user?: User;
  accessToken: string;
  refreshToken?: string;
}
```

---

## P1 — Duplicación estructural

### 3. `unwrap()` copiada en 8 archivos con dos variantes

**Archivos afectados:**

| Archivo | Variante |
|---|---|
| `http-auth.gateway.ts:23` | Sin guard — puede lanzar si `data` no tiene `.data` |
| `http-goals.gateway.ts:31` | Sin guard |
| `http-category.gateway.ts:33` | Sin guard |
| `http-step.gateway.ts:30` | Sin guard |
| `http-activity.gateway.ts:13` | Con guard — más defensiva |
| `http-calendar.gateway.ts:13` | Con guard |
| `http-trash.gateway.ts:12` | Con guard |
| `http-dashboard.gateway.ts:16` | Con guard |

La variante con guard es más segura porque no explota si el backend devuelve una respuesta sin envolver.

**Fix recomendado:** extraer a `src/shared/infrastructure/api/unwrap.ts` con la variante guard como estándar, y reemplazar las 8 copias locales.

```ts
// src/shared/infrastructure/api/unwrap.ts
export function unwrap<T>(data: unknown): T {
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: T }).data;
  }
  return data as T;
}
```

---

### 4. `interface ApiClient` duplicada en 9 archivos

Cada gateway define su propia versión local de `ApiClient` (el gateway de auth la llama `AuthApiClient` sin motivo aparente). Son estructuralmente idénticas salvo por los métodos HTTP que usa cada módulo.

**Fix recomendado:** definir una vez en `src/shared/infrastructure/api/api-client.ts` y que cada gateway importe la que necesita.

---

## P1 — Error boundaries faltantes

Solo 3 rutas tienen `error.tsx`. Un error no capturado en las demás rompe la página completa en lugar de mostrar un estado de error delimitado.

| Ruta | `error.tsx` |
|---|---|
| `app/(app)/activity/` | ✓ |
| `app/(app)/settings/` | ✓ |
| `app/(app)/trash/` | ✓ |
| `app/(app)/dashboard/` | ✗ |
| `app/(app)/goals/` | ✗ |
| `app/(app)/goals/[goalId]/` | ✗ |
| `app/(app)/categories/` | ✗ |
| `app/(app)/categories/[categoryId]/` | ✗ |
| `app/(app)/calendar/` | ✗ |

Los boundaries de `activity/error.tsx` y `settings/error.tsx` pueden servir de plantilla.

---

## P2 — Inconsistencias menores

### 5. Quote style inconsistente

`src/modules/calendar/infrastructure/http-calendar.gateway.ts` usa comillas simples; el resto del proyecto usa dobles. Posible fallo en la configuración de Prettier al guardar el archivo.

### 6. `eslint-disable` sin alternativa real

Varios archivos en `dashboard` y `trash` usan `// eslint-disable-next-line @typescript-eslint/no-explicit-any` para silenciar errores en lugar de tipar la respuesta del API correctamente.

**Archivos:**
- `src/modules/dashboard/infrastructure/http-dashboard.gateway.ts` (líneas 29, 38, 39, 47, 57)
- `src/modules/trash/infrastructure/http-trash.gateway.ts:26`
- `src/modules/calendar/infrastructure/http-calendar.gateway.ts:30`

### 7. Nombre inconsistente de la interfaz del cliente HTTP

El gateway de auth define `AuthApiClient` en lugar de `ApiClient` como el resto. No hay razón semántica para la diferencia.

---

## Resumen priorizado

| # | Problema | Severidad | Esfuerzo |
|---|---|---|---|
| 1 | `clearFilters` no resetea `status` y `view` | **Bug / P0** | Bajo (1 línea) |
| 2 | Type lie `user: undefined as unknown as User` en `refresh()` | **Bug / P0** | Bajo |
| 3 | `unwrap()` duplicada con variantes inconsistentes | **P1** | Medio |
| 4 | `interface ApiClient` duplicada | **P1** | Medio |
| 5 | 6 rutas sin `error.tsx` | **P1** | Bajo por ruta |
| 6 | Quote style inconsistente en calendar gateway | **P2** | Trivial |
| 7 | `eslint-disable` sin tipado real | **P2** | Bajo |
| 8 | Nombre `AuthApiClient` vs `ApiClient` | **P2** | Trivial |
