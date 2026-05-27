# Plan Frontend — Atomic Goals Web

Stack: **Next.js 16.2.6 + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Zustand + React Hook Form + Chart.js + OpenAPI-generated client**.
Arquitectura: **Clean Architecture** (Domain / Application / Infrastructure / Presentation) adaptada a Next.js App Router.
Repo: `atomic-goals/` (separado, hermano de `atomic-goals-api/`).

> ⚠️ **Next.js 16 tiene breaking changes**. Antes de implementar cada fase, leer la guía relevante en `node_modules/next/dist/docs/`. Este plan asume App Router + Server Components + Server Actions, pero los nombres exactos de APIs deben verificarse contra los docs locales (las APIs y convenciones pueden haber cambiado respecto a Next 15).

---

## 1. Decisiones de arquitectura

| Decisión | Valor |
|---|---|
| **Arquitectura** | **Clean Architecture** — 4 capas con dependencias unidireccionales hacia el dominio |
| Router | App Router (`app/`) — Server Components por defecto |
| Estado servidor | Server Components/Server Actions invocan **use cases**, no la API directamente |
| Estado cliente | Zustand para UI/efímero (modales, filtros locales, drafts, toasts) |
| Cliente HTTP | Generado desde Swagger del backend (`openapi-typescript` + `openapi-fetch`) — encapsulado en `infrastructure/api` |
| Auth | Access token en memoria (Zustand) + refresh cookie `httpOnly` manejado por el backend |
| Formularios | React Hook Form + Zod (resolver) — Zod vive en presentation como espejo de invariantes |
| UI Kit | shadcn/ui (Radix + Tailwind v4); instalación selectiva por componente |
| Estilos | Tailwind v4 (CSS-first config, `@theme inline`) |
| Charts | Chart.js + react-chartjs-2 |
| Calendar | `react-day-picker` (ya viene con shadcn) + vista custom mes/semana |
| Tablas/listas | Componentes propios con shadcn `<Table>` |
| Drag & drop | `@dnd-kit/core` para reordenar pasos |
| Icons | `lucide-react` |
| Dark mode | `next-themes` |
| Notificaciones | `sonner` (toasts) |

### 1.1 Clean Architecture en el frontend — reglas

```
Presentation (app/, components/) ──► Application (use cases) ──► Domain (entities, types)
Infrastructure (api client, storage, auth) ─────────────────────► Domain
Infrastructure ──► Application (implementa puertos / gateways)
```

- **Domain (`src/core/`)**: tipos puros del dominio (no son los tipos generados de OpenAPI), value objects, errores. No depende de React, Next, fetch, ni librerías externas.
- **Application (`src/core/application/`)**: casos de uso del cliente (`CreateGoalUseCase`, `RecalculateLocalProgressUseCase` para UI optimista, etc.) y **gateways** (interfaces) que necesita: `GoalGateway`, `AuthGateway`, `StorageGateway`.
- **Infrastructure (`src/infrastructure/`)**: implementa los gateways. `HttpGoalGateway` usa el cliente OpenAPI. `BrowserStorageGateway` usa localStorage. `NextCookieAuthGateway` usa `cookies()` de Next. **Aquí se hace el mapping** entre los tipos OpenAPI (`schema.d.ts`) y las entidades de dominio.
- **Presentation (`app/`, `components/`)**: páginas, componentes, Server Actions, hooks. Invocan use cases vía un **composition root** (`src/composition/`). Nunca llaman al cliente HTTP directamente.
- **Composition Root**: `src/composition/container.ts` instancia gateways y use cases. Hay dos containers:
  - `server-container.ts` para Server Components/Actions (usa cookies del request).
  - `client-container.ts` para Client Components (usa cookies via document/fetch).

---

## 2. Estructura de carpetas (Clean Architecture)

```
atomic-goals/
├── app/                                     # ── PRESENTATION (Next.js App Router)
│   ├── layout.tsx                           # ThemeProvider, Toaster, AuthInit
│   ├── page.tsx                             # landing / redirect a /dashboard si auth
│   ├── globals.css                          # tailwind v4 + tokens
│   ├── (auth)/                              # grupo público
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts                   # Server Actions → llaman use cases
│   │   └── register/
│   │       ├── page.tsx
│   │       └── actions.ts
│   ├── (app)/                               # grupo protegido (middleware)
│   │   ├── layout.tsx                       # Sidebar + Topbar
│   │   ├── dashboard/page.tsx
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── [categoryId]/page.tsx
│   │   ├── goals/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── [goalId]/
│   │   │       ├── page.tsx
│   │   │       └── history/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── activity/page.tsx
│   │   ├── trash/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       └── auth/
│           ├── refresh/route.ts             # Route Handler: para refresh desde client
│           └── logout/route.ts
│
├── src/
│   ├── core/                                # ── DOMAIN + APPLICATION
│   │   ├── domain/
│   │   │   ├── entities/                    # tipos puros (no clases pesadas, son types/objetos congelados)
│   │   │   │   ├── user.ts
│   │   │   │   ├── category.ts
│   │   │   │   ├── goal.ts
│   │   │   │   ├── goal-instance.ts
│   │   │   │   ├── step.ts                  # discriminated union de los 4 tipos
│   │   │   │   ├── activity-log.ts
│   │   │   │   └── progress.ts              # VO ProgressValue (0..100)
│   │   │   ├── value-objects/
│   │   │   │   ├── email.ts
│   │   │   │   └── uuid.ts
│   │   │   ├── errors/
│   │   │   │   ├── domain-error.ts
│   │   │   │   ├── not-found.error.ts
│   │   │   │   ├── unauthorized.error.ts
│   │   │   │   └── validation.error.ts
│   │   │   └── services/
│   │   │       └── progress-calculator.ts   # mismo algoritmo que el back (para optimistic UI)
│   │   │
│   │   └── application/
│   │       ├── gateways/                    # PUERTOS (interfaces)
│   │       │   ├── auth.gateway.ts
│   │       │   ├── category.gateway.ts
│   │       │   ├── goal.gateway.ts
│   │       │   ├── goal-instance.gateway.ts
│   │       │   ├── step.gateway.ts
│   │       │   ├── dashboard.gateway.ts
│   │       │   ├── activity.gateway.ts
│   │       │   ├── trash.gateway.ts
│   │       │   └── session.gateway.ts       # read/write cookies+tokens
│   │       └── use-cases/
│   │           ├── auth/
│   │           │   ├── login.use-case.ts
│   │           │   ├── register.use-case.ts
│   │           │   ├── logout.use-case.ts
│   │           │   └── get-current-user.use-case.ts
│   │           ├── categories/
│   │           ├── goals/
│   │           ├── steps/
│   │           │   ├── update-step-progress.use-case.ts   # optimista local + sync
│   │           │   └── ...
│   │           ├── dashboard/
│   │           ├── activity/
│   │           └── trash/
│   │
│   ├── infrastructure/                      # ── INFRASTRUCTURE
│   │   ├── api/
│   │   │   ├── openapi-client.ts            # openapi-fetch instance
│   │   │   ├── schema.d.ts                  # generado por openapi-typescript
│   │   │   ├── http-error.ts                # mapea errores HTTP → DomainError
│   │   │   └── server-client.ts             # variante server-side con cookie forwarding
│   │   ├── gateways/                        # implementaciones de los puertos
│   │   │   ├── http-auth.gateway.ts
│   │   │   ├── http-category.gateway.ts
│   │   │   ├── http-goal.gateway.ts
│   │   │   ├── http-goal-instance.gateway.ts
│   │   │   ├── http-step.gateway.ts
│   │   │   ├── http-dashboard.gateway.ts
│   │   │   ├── http-activity.gateway.ts
│   │   │   ├── http-trash.gateway.ts
│   │   │   ├── next-cookie-session.gateway.ts       # usa cookies() de Next (server)
│   │   │   └── browser-session.gateway.ts           # client-side
│   │   ├── mappers/                         # OpenAPI types ↔ Domain entities
│   │   │   ├── user.mapper.ts
│   │   │   ├── category.mapper.ts
│   │   │   ├── goal.mapper.ts
│   │   │   ├── goal-instance.mapper.ts
│   │   │   ├── step.mapper.ts               # switch por type para los 4 subtipos
│   │   │   └── activity.mapper.ts
│   │   └── storage/
│   │       └── local-storage.ts             # wrapper tipado (theme, sidebar collapsed)
│   │
│   ├── composition/                         # ── COMPOSITION ROOT
│   │   ├── tokens.ts                        # symbols de los gateways/use-cases
│   │   ├── server-container.ts              # factories para uso en RSC / Server Actions
│   │   └── client-container.ts              # factories para Client Components
│   │
│   └── presentation/                        # ── PRESENTATION (lógica de UI reutilizable)
│       ├── stores/                          # Zustand (estado de UI, no de dominio)
│       │   ├── ui-store.ts
│       │   ├── auth-store.ts                # accessToken + user (cliente)
│       │   ├── filters-store.ts
│       │   └── trash-selection-store.ts
│       ├── hooks/
│       │   ├── use-auth.ts                  # conecta auth-store + use cases
│       │   ├── use-goals.ts                 # wrappers sobre use cases + revalidation
│       │   ├── use-steps.ts
│       │   ├── use-dashboard.ts
│       │   └── use-debounce.ts
│       ├── schemas/                         # Zod schemas para RHF (presentation)
│       │   ├── login.schema.ts
│       │   ├── register.schema.ts
│       │   ├── category.schema.ts
│       │   ├── goal.schema.ts
│       │   └── step.schema.ts
│       ├── mappers/                         # form values → use-case command
│       │   ├── login-form.mapper.ts
│       │   └── goal-form.mapper.ts
│       └── utils/
│           ├── cn.ts
│           ├── format-date.ts
│           └── format-error.ts              # DomainError → mensaje user-friendly
│
├── components/                              # ── PRESENTATION (componentes React)
│   ├── ui/                                  # shadcn (button, card, dialog, form, ...)
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   └── user-menu.tsx
│   ├── categories/
│   ├── goals/
│   ├── steps/
│   │   └── types/                           # subtipos
│   ├── dashboard/
│   ├── calendar/
│   ├── activity/
│   └── shared/
│
├── middleware.ts                            # protege rutas /(app)
├── components.json                          # shadcn config
├── next.config.ts
├── tsconfig.json                            # paths: @/core, @/infrastructure, @/composition, @/presentation
└── package.json
```

### 2.1 Reglas de imports (linter)

`eslint-plugin-boundaries` configurado:

| Desde | Puede importar |
|---|---|
| `src/core/domain` | nada externo, solo TS puro |
| `src/core/application` | `src/core/domain` |
| `src/infrastructure` | `src/core/*`, libs externas |
| `src/composition` | todo (es el único que junta) |
| `src/presentation` | `src/core/*`, `src/composition`, libs UI |
| `app/`, `components/` | `src/presentation`, `src/composition`, `src/core/*` (solo tipos), libs UI |
| `src/core/*` ❌ | nunca: `app/`, `components/`, `infrastructure/`, fetch, Next APIs |
| `app/`, `components/` ❌ | nunca importar `src/infrastructure/*` directamente |

---

## 3. Convenciones Next.js 16 + Clean Architecture

> **Antes de codear**: abrir `node_modules/next/dist/docs/` y leer secciones de App Router, Server Actions, fetch caching, middleware. Lo siguiente es el plan de **uso**, sujeto a verificación de API exacta:

- **Server Components**: invocan use cases vía `serverContainer.getGoals.execute(...)`. El container resuelve el gateway con cookie forwarding automático.
- **Server Actions**: `actions.ts` colocado junto a la página, marcado con `'use server'`. Cada action:
  1. Valida con Zod schema (presentation).
  2. Mapea form values → command (`src/presentation/mappers/`).
  3. Invoca use case desde `serverContainer`.
  4. Captura `DomainError` y devuelve `{ ok:false, fieldErrors }` o `{ ok:true, data }`.
  5. Revalida con `revalidateTag()` o `revalidatePath()`.
- **Client Components**: usan hooks de `src/presentation/hooks/` que internamente usan `clientContainer`. Marcados con `'use client'`.
- **Streaming**: `<Suspense>` con `loading.tsx` por carpeta.
- **Error handling**: `error.tsx` por segmento + `format-error.ts` que mapea `DomainError` → mensaje.
- **Caching**: tags por entidad (`categories`, `goals`, `goal:${id}`, `dashboard`); invalidar desde Server Actions.

### 3.1 Flujo Server Action (ejemplo Create Goal)

```ts
// app/(app)/goals/actions.ts
'use server';
import { serverContainer } from '@/composition/server-container';
import { goalFormSchema } from '@/presentation/schemas/goal.schema';
import { toCreateGoalCommand } from '@/presentation/mappers/goal-form.mapper';
import { DomainError } from '@/core/domain/errors/domain-error';
import { revalidateTag } from 'next/cache';

export async function createGoalAction(input: unknown) {
  const parsed = goalFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    const command = toCreateGoalCommand(parsed.data);
    const goal = await serverContainer().createGoal.execute(command);
    revalidateTag('goals');
    return { ok: true, data: goal };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, fieldErrors: { _: [e.message] } };
    throw e;
  }
}
```

### 3.2 Flujo Use Case (cliente)

```ts
// src/core/application/use-cases/goals/create-goal.use-case.ts
export class CreateGoalUseCase {
  constructor(private readonly gateway: GoalGateway) {}
  async execute(command: CreateGoalCommand): Promise<Goal> {
    // validaciones de invariantes locales si aplican (e.g., fechas coherentes)
    return this.gateway.create(command);
  }
}
```

### 3.3 Gateway (infrastructure)

```ts
// src/infrastructure/gateways/http-goal.gateway.ts
export class HttpGoalGateway implements GoalGateway {
  constructor(private readonly client: OpenApiClient) {}
  async create(cmd: CreateGoalCommand): Promise<Goal> {
    const { data, error } = await this.client.POST('/goals', { body: cmd });
    if (error) throw mapHttpError(error);
    return GoalMapper.toDomain(data);
  }
}
```

---

## 4. Auth — flujo concreto

1. **Login** (`/login`):
   - Form (RHF) → Server Action `loginAction(formData)` →
   - Server Action llama `POST {API}/auth/login` con `credentials: 'include'`.
   - El backend devuelve `{ accessToken, user }` y setea cookie `refresh_token` httpOnly.
   - La Server Action setea **otra cookie httpOnly** local `access_token` (15min) — porque el access también necesita estar disponible cookie-side para los Server Components que harán fetch al back con `Authorization: Bearer`.
   - Redirige a `/dashboard`.
2. **Server Components**: `lib/api/server-fetch.ts` lee `cookies()` del request, agrega `Authorization: Bearer <access>` y hace fetch al backend.
3. **Si el access expiró** (401 del back): el `server-fetch` intenta refresh transparente:
   - llama `POST {API}/auth/refresh` reenviando cookie refresh →
   - recibe nuevo access → setea cookie `access_token` (con `cookies().set()` en una Route Handler `/api/auth/refresh-from-server`, ya que cookies son read-only desde Server Components puros) → reintenta.
4. **Client Components**: usan `lib/api/client.ts` (openapi-fetch) que tiene interceptor que llama `/api/auth/refresh` si recibe 401.
5. **Logout**: Server Action `logoutAction()` → `POST {API}/auth/logout` → borra cookies locales → redirect `/login`.
6. **Middleware** (`middleware.ts`): verifica presencia de `access_token` o `refresh_token` cookie en rutas `(app)/*`. Si no hay ninguna → redirect `/login`.

---

## 5. Cliente OpenAPI

- Script en `package.json`:
  ```json
  "openapi:gen": "openapi-typescript http://localhost:4000/api/docs-json -o lib/api/schema.d.ts"
  ```
- Cliente base con `openapi-fetch`:
  ```ts
  // lib/api/client.ts
  import createClient from 'openapi-fetch';
  import type { paths } from './schema';
  export const api = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
  ```
- Tipado end-to-end automático para todas las llamadas.
- Regenerar tras cada cambio relevante del back.

---

## 6. Páginas y componentes — detalle por feature

### 6.1 `/login` y `/register`
- Card centrado con shadcn `<Card>`, `<Form>` (RHF) y validación con resolver custom que mapea errores de `class-validator` (vienen 400 del back con array `message`).
- Campos: email, password (+name, +confirm en register).
- Errores top-level + por campo.
- Link cruzado login ↔ register.

### 6.2 Layout `(app)/layout.tsx`
- **Sidebar** colapsable (estado en `ui-store`): logo, nav (Dashboard, Categorías, Metas, Calendario, Actividad, Papelera, Settings), user menu abajo.
- **Topbar**: breadcrumbs (derivado de pathname), search global (futuro), botón "Nueva meta" (abre dialog), avatar.
- Toaster global (`sonner`).
- Theme switcher (light/dark/system).

### 6.3 Dashboard (`/dashboard`)
Server Component que hace 4 fetch en paralelo: `summary`, `timeline?range=month`, `calendar?from=now&to=+7d`, `upcoming`, `activity?limit=10`.
Componentes:
- `<SummaryCards>`: 4 KPI cards — Total metas, Completadas, En curso, Streak actual.
- `<CategoryBreakdownChart>`: doughnut (Chart.js) — % por categoría.
- `<ProgressTimelineChart>`: line chart con selector de rango (week/month/year), revalida por tag.
- `<UpcomingList>`: próximas metas/pasos a vencer.
- `<ActivityFeed limit={5}>`: últimos eventos.

### 6.4 Categorías
- `/categories`: grid de `<CategoryCard>` (nombre, color, icono, contador de metas, % promedio). Botón "+ Nueva".
- Dialog `<CategoryForm>` para crear/editar (name, description, color picker, icon picker).
- `/categories/[id]`: detalle con lista de metas filtradas por categoría (reutiliza `<GoalList>`).

### 6.5 Metas
- `/goals`: lista con filtros (categoría, tipo CONCLUSIVE/CYCLIC, status). Filtros persistidos en `filters-store` + querystring.
- `<GoalCard>`: nombre, categoría (chip color), tipo, barra de progreso, fechas, acciones (... menú: editar, archivar, eliminar).
- `<GoalForm>`: dialog/sheet con:
  - name, description, category select.
  - type radio: Conclusiva | Cíclica.
  - si Cíclica → period select (daily/weekly/monthly/yearly/custom) + customCycleDays input si custom.
  - startDate, endDate (DatePicker).
  - estimatedDurationMinutes.
- `/goals/[id]`: detalle.
  - Header: nombre, categoría, badges (tipo, status instancia), progreso grande, fechas.
  - Tabs: "Pasos (instancia actual)" | "Histórico" (lista de `GoalInstance` pasadas con su progress final).
  - Pestaña pasos: `<StepList>` con drag & drop y botón "+ Añadir paso".

### 6.6 Pasos (`<StepList>` y subtipos)
- Selector de tipo al crear (dialog).
- Cada subtipo es un componente client con su UI:
  - **`<ProgressBarStep>`**: input number `current` + display `target`, barra visual.
  - **`<CheckStep>`**: checkbox grande, toggle done.
  - **`<StatusStep>`**: dropdown con los statuses definidos + botón "editar statuses" (lista con drag-reorder, edit label y percentage).
  - **`<CounterStep>`**: input numérico + botones `+` `-` (steppers configurables), display `current/max` + unit.
- Cada paso muestra: title, peso (`weight` editable inline), fechas si hay, % calculado.
- Cambios disparan una **optimistic update** local + Server Action que persiste y revalida.
- Drag & drop con `@dnd-kit/sortable` → al soltar dispara `reorderAction`.

### 6.7 Calendario (`/calendar`)
- Vista mes por defecto, toggle a vista semana.
- Eventos = pasos + metas con fechas en el rango.
- Click en día → popover con lista.
- Filtros: por categoría, por estado.

### 6.8 Actividad (`/activity`)
- Feed paginado por cursor.
- Iconos por tipo de acción (CREATED, UPDATED, COMPLETED, DELETED, RESTORED).
- Agrupado por día.

### 6.9 Papelera (`/trash`)
- Tabs: Categorías | Metas | Pasos.
- Tabla con checkbox selección múltiple.
- Acciones: Restaurar | Eliminar permanentemente (con `<ConfirmDialog>`).

### 6.10 Settings (`/settings`)
- Perfil: nombre, email, cambiar password.
- Apariencia: tema.
- Cuenta: cerrar sesión, eliminar cuenta (futuro).

---

## 7. Formularios — patrón

```tsx
'use client';
const schema = z.object({...}); // o validamos en submit con el error 400 del back
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
const onSubmit = form.handleSubmit(async (data) => {
  const result = await createGoalAction(data); // Server Action
  if (!result.ok) {
    Object.entries(result.fieldErrors).forEach(([k,v]) => form.setError(k, { message: v }));
    return;
  }
  toast.success('Meta creada');
  router.push(`/goals/${result.data.id}`);
});
```

Decisión: aunque el back usa `class-validator`, en el front usamos **Zod** (compatibilidad con `react-hook-form`'s resolver). Los schemas Zod se escriben a mano espejando los DTOs; cuando hay mismatch, el 400 del back es el árbitro y se mapea a `setError`.

---

## 8. Fases de implementación

### Fase 0 — Setup + esqueleto Clean (1 día)
- [ ] Instalar deps: `zustand react-hook-form @hookform/resolvers zod openapi-fetch openapi-typescript chart.js react-chartjs-2 @dnd-kit/core @dnd-kit/sortable lucide-react next-themes sonner date-fns clsx tailwind-merge class-variance-authority`.
- [ ] Dev deps: `eslint-plugin-boundaries`.
- [ ] `pnpm dlx shadcn@latest init` + agregar: `button card dialog form input label select textarea dropdown-menu sheet tabs avatar badge checkbox table tooltip skeleton sonner toggle separator scroll-area popover calendar date-picker`.
- [ ] Crear estructura completa de `src/{core,infrastructure,composition,presentation}` con stubs.
- [ ] `src/core/domain/errors/` con `DomainError`, `NotFoundError`, `UnauthorizedError`, `ValidationError`.
- [ ] `tsconfig.json` paths: `@/core/*`, `@/infrastructure/*`, `@/composition/*`, `@/presentation/*`.
- [ ] `eslint-plugin-boundaries` configurado con reglas de §2.1.
- [ ] `next-themes` provider en `app/layout.tsx`.
- [ ] `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`, `API_INTERNAL_URL=http://localhost:4000/api/v1`.
- [ ] Composition root vacío con tokens y factories que devuelven stubs.
- [ ] Healthcheck: Server Component que invoca un `HealthCheckUseCase` (vía `serverContainer`) y muestra status.

### Fase 1 — Auth + Layout protegido (2.5 días)
**Bloqueada por backend Fase 1.**
- [ ] Script `openapi:gen` + primera generación de `schema.d.ts`.
- [ ] `src/infrastructure/api/openapi-client.ts` + `server-client.ts` (con cookie forwarding).
- [ ] `src/infrastructure/api/http-error.ts` que mapea status → DomainError.
- [ ] **Domain**: `User`, `Email` VO, errores de auth.
- [ ] **Application**: gateway `AuthGateway`, `SessionGateway`. Use cases `Login`, `Register`, `Logout`, `RefreshSession`, `GetCurrentUser`.
- [ ] **Infrastructure**: `HttpAuthGateway`, `NextCookieSessionGateway` (server), `BrowserSessionGateway` (client).
- [ ] **Mappers**: `UserMapper`.
- [ ] **Composition**: registrar gateways y use cases en server-container y client-container.
- [ ] **Presentation**: `auth-store` (Zustand), schemas Zod login/register, mappers form→command.
- [ ] **Presentation**: hook `useAuth()`.
- [ ] Páginas `/login`, `/register` con `actions.ts` que invocan use cases.
- [ ] `middleware.ts` (lee cookies, redirect si no auth).
- [ ] Route Handler `app/api/auth/refresh/route.ts` que delega al use case.
- [ ] Layout `(app)/layout.tsx` con Sidebar + Topbar.
- [ ] User menu con logout (Server Action que invoca `LogoutUseCase`).

### Fase 2 — Categorías (1.5 días)
- [ ] **Domain**: tipo `Category`.
- [ ] **Application**: gateway `CategoryGateway`. Use cases `Create`, `Update`, `Delete`, `Restore`, `List`, `Get`.
- [ ] **Infrastructure**: `HttpCategoryGateway`, `CategoryMapper`.
- [ ] **Composition**: registrar.
- [ ] **Presentation**: schemas Zod, hook `useCategories`, mapper form→command.
- [ ] Server Actions en `app/(app)/categories/actions.ts`.
- [ ] Componentes `<CategoryCard>`, `<CategoryForm>` (dialog), `<CategoryList>`.
- [ ] Páginas `/categories` y `/categories/[id]`.
- [ ] Color picker (chips predefinidos) + icon picker (subset de lucide).

### Fase 3 — Metas (2.5 días)
**Bloqueada por backend Fase 3.**
- [ ] **Domain**: tipos `Goal`, `GoalInstance`, enum `CyclePeriod`, errores propios.
- [ ] **Application**: gateways `GoalGateway`, `GoalInstanceGateway`. Use cases CRUD + `ListInstances`, `CompleteInstance`.
- [ ] **Infrastructure**: gateways HTTP + mappers.
- [ ] **Presentation**: schemas Zod con validaciones condicionales (cíclica → periodo requerido).
- [ ] Server Actions `app/(app)/goals/actions.ts`.
- [ ] `<GoalForm>` con campos condicionales (cíclica vs conclusiva).
- [ ] `<GoalCard>`, `<GoalList>` con filtros (sincronizados a querystring + `filters-store`).
- [ ] Páginas `/goals` y `/goals/[goalId]` con tabs Pasos | Histórico.
- [ ] `<GoalCycleHistory>` para metas cíclicas.

### Fase 4 — Pasos y subtipos (3.5 días)
**Bloqueada por backend Fase 4.**
- [ ] **Domain**: union discriminada `Step = ProgressBarStep | CheckStep | StatusStep | CounterStep`, función `stepProgress(step)`.
- [ ] **Domain**: `ProgressCalculator` (mismo algoritmo que el back) para optimistic UI.
- [ ] **Application**: gateway `StepGateway`. Use cases `Create`, `UpdateMetadata`, `UpdateProgress`, `Delete`, `Restore`, `Reorder`.
- [ ] **Application**: `UpdateStepProgressUseCase` calcula progreso local optimista y luego sincroniza.
- [ ] **Infrastructure**: `HttpStepGateway`, `StepMapper` con switch por type.
- [ ] **Presentation**: hook `useSteps` con estado optimista (useOptimistic).
- [ ] `<StepList>` con `@dnd-kit/sortable`.
- [ ] `<StepFormDialog>` con selector de tipo.
- [ ] 4 componentes de subtipo con interacciones in-line.
- [ ] Editor de statuses para `StatusStep`.

### Fase 5 — Dashboard real + Charts (2 días)
**Bloqueada por backend Fase 5.**
- [ ] **Application**: gateway `DashboardGateway`, use cases `GetSummary`, `GetTimeline`, `GetCalendar`, `GetUpcoming`.
- [ ] **Infrastructure**: `HttpDashboardGateway`.
- [ ] Configurar Chart.js (registrar componentes).
- [ ] `<SummaryCards>`, `<StreakCard>`.
- [ ] `<CategoryBreakdownChart>` (doughnut).
- [ ] `<ProgressTimelineChart>` (line) con selector de rango.
- [ ] `<UpcomingList>`, `<ActivityFeed>`.
- [ ] Empty states.

### Fase 6 — Calendario (1 día)
- [ ] Use case `GetCalendarEvents`.
- [ ] `<MonthView>` sobre `react-day-picker` + overlay de eventos.
- [ ] `<EventPopover>` con detalles del día.
- [ ] Filtros (categoría, estado).
- [ ] Toggle mes/semana.

### Fase 7 — Actividad + Papelera (1.5 días)
- [ ] **Application**: gateways `ActivityGateway`, `TrashGateway`. Use cases `ListActivity` (paginación cursor), `ListTrash`, `Restore`, `PermanentDelete`.
- [ ] **Infrastructure**: gateways HTTP.
- [ ] `<ActivityFeed>` paginado infinito (intersection observer + use case).
- [ ] Página `/trash` con tabs + tabla seleccionable (selección en `trash-selection-store`).
- [ ] `<ConfirmDialog>` reutilizable.
- [ ] Server Actions restore y permanent delete.

### Fase 8 — Settings + polish (1.5 días)
- [ ] Use cases `UpdateProfile`, `ChangePassword`.
- [ ] `/settings` con tabs perfil/apariencia.
- [ ] Cambio de password (form aparte).
- [ ] Loading skeletons en todas las páginas.
- [ ] `error.tsx` por segmento con `format-error.ts`.
- [ ] Empty states bonitos.
- [ ] Accesibilidad: labels, focus rings, navegación por teclado.

---

## 9. Estado — separación clara

| Tipo de estado | Dónde vive | Capa |
|---|---|---|
| Datos del servidor (categorías, metas, pasos) | Server Components invocando use cases + `revalidateTag` | application via composition |
| Auth (accessToken, user) | Zustand `auth-store` | presentation |
| Cookie session | httpOnly cookie + `NextCookieSessionGateway` | infrastructure |
| UI efímera (sidebar collapsed, theme) | Zustand `ui-store` (con persist en localStorage vía `LocalStorageAdapter`) | presentation + infrastructure |
| Filtros de listas | Querystring (URL) + Zustand para defaults | presentation |
| Drafts de forms | RHF (en el form) | presentation |
| Optimistic updates | useOptimistic + use cases que calculan progreso local con `ProgressCalculator` | presentation + domain |
| Toasts | Sonner | presentation |

---

## 10. Performance — checklist
- [ ] Server Components por defecto, `'use client'` solo donde sea necesario.
- [ ] Suspense + loading.tsx por segmento.
- [ ] `revalidateTag` granular (tag por entidad: `categories`, `goals`, `goal:${id}`).
- [ ] Imágenes con `next/image`.
- [ ] Fuentes con `next/font`.
- [ ] Charts cargados con `dynamic(() => import(...), { ssr: false })`.

---

## 11. Bloqueos y orden global

| Frontend fase | Bloqueada por backend |
|---|---|
| 0 — Setup | nada |
| 1 — Auth | Back F1 + F7 (OpenAPI) |
| 2 — Categorías | Back F2 |
| 3 — Metas | Back F3 |
| 4 — Pasos | Back F4 |
| 5 — Dashboard | Back F5 |
| 6 — Calendario | Back F5 (endpoint calendar) |
| 7 — Actividad + Papelera | Back F5 + F6 |
| 8 — Polish | nada |

**Estrategia recomendada**: arrancar Front F0 en paralelo con Back F0–F1, luego ir en lockstep (Back fase N termina → Front fase N empieza).

---

## 12. Comandos de dev

```bash
# Backend (en atomic-goals-api/)
docker compose up -d postgres
pnpm install
pnpm start:dev          # http://localhost:4000

# Frontend (en atomic-goals/)
pnpm install
pnpm openapi:gen        # regenerar tipos tras cambios del back
pnpm dev                # http://localhost:3000
```

---

## 13. Convenciones Clean Architecture — quick reference

- **¿Un componente puede hacer fetch directo?** Nunca. Siempre vía un use case obtenido del container.
- **¿Una Server Action puede importar `infrastructure`?** No directamente; importa el `serverContainer` y obtiene los use cases ya cableados.
- **¿Los tipos generados por OpenAPI son los del dominio?** No. Viven en `infrastructure/api/schema.d.ts` y solo los usan los gateways HTTP + mappers. El resto del código usa entidades de dominio.
- **¿Dónde va una validación nueva?**
  - Si es **regla de negocio** (e.g., "una meta cíclica requiere periodo") → en la entidad de dominio o en el use case.
  - Si es **forma del input** (e.g., longitud máxima del nombre) → Zod schema en `presentation/schemas`.
- **¿Zustand en `core/`?** Nunca. Zustand es presentation.
- **¿Server Components leyendo de Zustand?** Imposible (Zustand es client-only); usar el `serverContainer` y los use cases.
- **¿Dónde manejo errores de red?** En el gateway HTTP — los convierte a `DomainError`. El resto del código solo conoce `DomainError`.
- **¿Cómo hago una nueva pantalla?** 1) entidad y errores en `core/domain`. 2) gateway interface + use case en `core/application`. 3) implementación HTTP + mapper en `infrastructure`. 4) registrar en composition. 5) hook/schema/mapper en `presentation`. 6) componente y página en `app/`/`components/`.
