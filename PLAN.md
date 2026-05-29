# Plan Frontend — Atomic Goals Web

Stack: **Next.js 16.2.6 + React 19 + TypeScript + Tailwind v4 + shadcn/ui (re-estilizado) + Zustand + React Hook Form + Chart.js + OpenAPI-generated client**.
Arquitectura: **Screaming + Clean Architecture** — top-level por feature/dominio (`src/modules/<feature>/`), y dentro de cada feature las 4 capas (Domain / Application / Infrastructure / Presentation) con dependencias hacia el dominio. Lo transversal vive en `src/shared/`.
Repo: `atomic-goals/` (separado, hermano de `atomic-goals-api/`).

> ⚠️ **Next.js 16 tiene breaking changes**. Antes de implementar cada fase, leer la guía relevante en `node_modules/next/dist/docs/`. Este plan asume App Router + Server Components + Server Actions, pero los nombres exactos de APIs deben verificarse contra los docs locales (las APIs y convenciones pueden haber cambiado respecto a Next 15).

---

## 1. Decisiones de arquitectura

| Decisión | Valor |
|---|---|
| **Arquitectura** | **Screaming + Clean Architecture** — el repo grita el dominio (auth, goals, steps, …) al primer nivel; dentro de cada feature, 4 capas con dependencias unidireccionales hacia el dominio |
| Router | App Router (`app/`) — Server Components por defecto. `app/` es solo entry-points; toda la lógica vive en `src/modules/<feature>/` |
| Estado servidor | Server Components/Server Actions invocan **use cases** del módulo, no la API directamente |
| Estado cliente | Zustand para UI/efímero (modales, filtros locales, drafts, toasts) — vive en el módulo dueño o en `shared/presentation/stores` si es global |
| Cliente HTTP | Generado desde Swagger del backend (`openapi-typescript` + `openapi-fetch`) — encapsulado en `shared/infrastructure/api` |
| Auth | Access token en memoria (Zustand) + refresh cookie `httpOnly` manejado por el backend |
| Formularios | React Hook Form + Zod (resolver) — schemas Zod en `presentation/schemas` de cada módulo |
| **UI Kit** | **shadcn/ui (Radix + Tailwind v4) re-estilizado**. shadcn aporta accesibilidad/comportamiento; los estilos los aportamos nosotros. Los HTMLs en `atomic-goals/htmls/` son la **fuente de verdad visual** — se atomizan en `src/shared/ui-kit/` (atoms + molecules) y el resto del código consume **siempre** desde ahí, **nunca** directo de shadcn |
| **Design system** | Tokens propios en `src/shared/ui-kit/tokens.css` + `app/globals.css` (`@theme inline`). Lenguaje "Vibrante / graphic / color blocks" (JetBrains Mono, bloques de color, animaciones `vibe-blink/pulse/fade`) |
| Estilos | Tailwind v4 (CSS-first config, `@theme inline`) |
| Charts | Chart.js + react-chartjs-2 |
| Calendar | `react-day-picker` (ya viene con shadcn) + vista custom mes/semana |
| Tablas/listas | Componentes propios sobre shadcn `<Table>` (re-estilizado) |
| Drag & drop | `@dnd-kit/core` para reordenar pasos |
| Icons | `lucide-react` (envuelto en `ui-kit/icons` para tamaños/strokes consistentes) |
| Dark mode | `next-themes` (el ui-kit expone variables CSS que cambian por tema) |
| Notificaciones | `sonner` (toasts) — envuelto en `ui-kit/molecules/Toast` |

### 1.1 Screaming + Clean — reglas

**Por qué combinarlas**:
- **Screaming Architecture** (Robert C. Martin): la estructura del proyecto debe **gritar el dominio** (auth, goals, steps, categories, dashboard, …), no el framework (controllers, services, pages). Abrir el repo debe contar de qué va la app antes que cómo está implementada.
- **Clean Architecture**: dentro de cada feature, las dependencias fluyen siempre hacia el dominio. Las capas externas dependen de las internas, nunca al revés.

**Resultado** — cada feature es un mini-Clean autocontenido:

```
src/modules/<feature>/
├── domain/          # entidades, value objects y errores propios del feature
├── application/     # use-cases + gateways (puertos)
├── infrastructure/  # implementación HTTP de los gateways + mappers OpenAPI → dominio
└── presentation/    # componentes, hooks, stores, schemas Zod, mappers form→command
```

Flujo de dependencias dentro de un módulo (idéntico a Clean):

```
presentation ──► application ──► domain
infrastructure ──► domain  + implementa puertos de application
```

- **Domain** (`<feature>/domain/`): tipos puros, VO, errores propios del feature. No conoce React, Next, fetch, ni librerías externas.
- **Application** (`<feature>/application/`): use-cases (`CreateGoalUseCase`, `UpdateStepProgressUseCase`, …) y **gateways** (interfaces): `GoalGateway`, `StepGateway`, `AuthGateway`, etc.
- **Infrastructure** (`<feature>/infrastructure/`): implementa los gateways del feature. `HttpGoalGateway` usa el cliente OpenAPI compartido. Aquí vive el **mapping** OpenAPI (`schema.d.ts`) ↔ entidades de dominio.
- **Presentation** (`<feature>/presentation/`): componentes, hooks, Zustand stores propios del feature, Zod schemas, mappers form→command. Invoca use-cases vía el **composition root**; nunca llama al cliente HTTP directamente.

**Cross-cutting** — lo que pertenece a más de un feature vive en `src/shared/` con la misma estructura por capas: `domain/` (errores base, VO compartidos), `application/` (puertos cross-feature si surgen), `infrastructure/` (cliente OpenAPI, storage), `presentation/` (layout `AppShell`, ui-kit, hooks/utilidades), `composition/` (containers).

**Aislamiento entre módulos**: un módulo **nunca** importa de otro módulo (`modules/goals/...` no importa de `modules/steps/...`). Si dos módulos necesitan colaborar, una de tres:
1. Mover lo compartido a `src/shared/`.
2. Exponer un barrel `index.ts` del módulo (solo tipos del dominio o use-cases públicos) y consumirlo explícitamente.
3. Componer en el `composition` (caso típico: un use-case agregador en un módulo "host").

**Composition Root** (`src/shared/composition/`):
- `server-container.ts` para Server Components/Actions (usa cookies del request).
- `client-container.ts` para Client Components.
- Instancia gateways de cada módulo y resuelve use-cases. Es el **único** lugar que toca infrastructure de varios módulos a la vez.

**Routing en Next.js (`app/`)** es solo presentation entry-points: páginas y Server Actions delegan en `modules/<feature>/presentation/components` y en use-cases vía `serverContainer`. `app/` nunca contiene lógica de negocio.

### 1.2 UI Kit propio, shadcn re-estilizado y atomización de los HTMLs

**Decisión**: shadcn se queda, **pero no con su look-and-feel por defecto**. Los HTMLs en `atomic-goals/htmls/` son la fuente de verdad visual. shadcn aporta:
- Accesibilidad (Radix Primitives).
- Comportamiento (focus management, ARIA, navegación por teclado).
- Tipado y estructura para componer.

Lo que **cambiamos** de shadcn: colores, radios, sombras, espaciado, tipografía, microinteracciones y animaciones para coincidir con el lenguaje "Vibrante / graphic / color blocks" (JetBrains Mono, bloques de color, keyframes `vibe-blink/pulse/fade`, etc.).

**Estrategia de atomización (Atomic Design lite)** para cada HTML en `htmls/`:

1. **Identificar átomos y moléculas** reutilizables:
   - **Atoms** (`src/shared/ui-kit/atoms/`): `Button`, `Input`, `Label`, `Badge`, `Chip`, `Tab`, `Avatar`, `Icon`, `ProgressBar`, `Checkbox`, `Switch`, `StreakDot`, `ThemeToggle`, …
   - **Molecules** (`src/shared/ui-kit/molecules/`): `FormField` (Label+Input+Error), `TabGroup`, `BrandLogo`, `StepIndicator`, `QuoteCard`, `StreakWeek`, `CategoryProgressRow`, `Toast`, `ConfirmDialog`, …
   - **Organisms específicos** del feature: viven en `modules/<feature>/presentation/components/` (e.g. `LoginForm`, `AuthSidePanel`, `GoalCard`, `StepList`).

2. **Definir design tokens** en `src/shared/ui-kit/tokens.css` (colores, tipografía, espaciado, sombras, easings, keyframes) y exponerlos vía `@theme inline` de Tailwind v4 en `app/globals.css`. Los tokens cambian por tema (light/dark) cambiando variables CSS.

3. **Crear los átomos encima de los shadcn primitives**, reemplazando estilos:
   ```tsx
   // src/shared/ui-kit/atoms/Button.tsx
   import { Button as ShadButton } from '@/components/ui/button';
   import { cn } from '@/shared/presentation/utils/cn';

   export function Button({ className, ...props }: ButtonProps) {
     return <ShadButton className={cn('atomic-btn …', className)} {...props} />;
   }
   ```

4. **Regla dura**: el resto del código consume **siempre** desde `@/shared/ui-kit/*` y **nunca** desde `@/components/ui/*` (shadcn queda confinado al ui-kit). Esto lo enforzamos con `eslint-plugin-boundaries` (§2.1).

**Mapping HTML → componentes** (se irá completando conforme se agreguen más HTMLs):

| HTML | Atoms/Molecules a extraer | Organisms del feature |
|---|---|---|
| `B _ Vibrante _graphic_ color blocks_.html` (auth) | `BrandLogo`, `StreakBadge`, `ThemeToggle`, `StepIndicator`, `TabGroup`, `FormField` (con `PasswordInput` que tiene toggle show), `StreakWeek`, `CategoryProgressRow`, `QuoteCard` | `LoginForm`, `RegisterForm`, `AuthSidePanel`, `AuthScreen` |

---

## 2. Estructura de carpetas (Screaming + Clean)

```
atomic-goals/
├── app/                                     # ── ROUTING (Next.js App Router, sin lógica)
│   ├── layout.tsx                           # ThemeProvider, Toaster, AuthInit
│   ├── page.tsx                             # landing / redirect a /dashboard si auth
│   ├── globals.css                          # Tailwind v4 + @theme inline → ui-kit tokens
│   ├── (auth)/                              # grupo público
│   │   ├── login/
│   │   │   ├── page.tsx                     # <AuthScreen mode="login"/> de modules/auth
│   │   │   └── actions.ts                   # Server Action → use case Login
│   │   └── register/
│   │       ├── page.tsx
│   │       └── actions.ts
│   ├── (app)/                               # grupo protegido (middleware)
│   │   ├── layout.tsx                       # <AppShell/> (Sidebar+Topbar) de shared
│   │   ├── dashboard/page.tsx               # <DashboardScreen/> de modules/dashboard
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
│           ├── refresh/route.ts             # delega en RefreshSessionUseCase
│           └── logout/route.ts
│
├── src/
│   ├── modules/                             # ── SCREAMING: el dominio al primer nivel
│   │   ├── auth/
│   │   │   ├── domain/
│   │   │   │   ├── entities/user.ts
│   │   │   │   ├── value-objects/email.ts
│   │   │   │   └── errors/{invalid-credentials,unauthorized}.error.ts
│   │   │   ├── application/
│   │   │   │   ├── gateways/{auth,session}.gateway.ts          # puertos
│   │   │   │   └── use-cases/
│   │   │   │       ├── login.use-case.ts
│   │   │   │       ├── register.use-case.ts
│   │   │   │       ├── logout.use-case.ts
│   │   │   │       ├── refresh-session.use-case.ts
│   │   │   │       └── get-current-user.use-case.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── http-auth.gateway.ts
│   │   │   │   ├── next-cookie-session.gateway.ts              # server
│   │   │   │   ├── browser-session.gateway.ts                  # client
│   │   │   │   └── mappers/user.mapper.ts
│   │   │   ├── presentation/
│   │   │   │   ├── components/                                 # organisms del feature
│   │   │   │   │   ├── AuthScreen.tsx
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── RegisterForm.tsx
│   │   │   │   │   └── AuthSidePanel.tsx                       # racha + categorías + cita
│   │   │   │   ├── hooks/use-auth.ts
│   │   │   │   ├── stores/auth-store.ts                        # Zustand
│   │   │   │   ├── schemas/{login,register}.schema.ts
│   │   │   │   └── mappers/{login,register}-form.mapper.ts
│   │   │   └── index.ts                                        # barrel público (organisms + tipos)
│   │   │
│   │   ├── categories/
│   │   │   ├── domain/{entities/category.ts, errors/}
│   │   │   ├── application/
│   │   │   │   ├── gateways/category.gateway.ts
│   │   │   │   └── use-cases/{create,update,delete,restore,list,get}-category.use-case.ts
│   │   │   ├── infrastructure/{http-category.gateway.ts, mappers/category.mapper.ts}
│   │   │   └── presentation/
│   │   │       ├── components/{CategoryListScreen,CategoryDetailScreen,CategoryCard,CategoryForm,CategoryColorPicker,CategoryIconPicker}.tsx
│   │   │       ├── hooks/use-categories.ts
│   │   │       ├── schemas/category.schema.ts
│   │   │       └── mappers/category-form.mapper.ts
│   │   │
│   │   ├── goals/
│   │   │   ├── domain/
│   │   │   │   ├── entities/{goal,goal-instance}.ts
│   │   │   │   ├── enums/cycle-period.ts
│   │   │   │   └── errors/
│   │   │   ├── application/
│   │   │   │   ├── gateways/{goal,goal-instance}.gateway.ts
│   │   │   │   └── use-cases/                                  # CRUD + ListInstances, CompleteInstance, …
│   │   │   ├── infrastructure/{http-goal.gateway.ts, http-goal-instance.gateway.ts, mappers/}
│   │   │   └── presentation/
│   │   │       ├── components/{GoalListScreen,GoalDetailScreen,GoalCard,GoalForm,GoalCycleHistory,GoalFilters}.tsx
│   │   │       ├── hooks/use-goals.ts
│   │   │       ├── stores/goal-filters-store.ts
│   │   │       ├── schemas/goal.schema.ts
│   │   │       └── mappers/goal-form.mapper.ts
│   │   │
│   │   ├── steps/
│   │   │   ├── domain/
│   │   │   │   ├── entities/step.ts                            # union discriminada de los 4 subtipos
│   │   │   │   ├── services/progress-calculator.ts             # mismo algoritmo que el back (optimistic UI)
│   │   │   │   └── errors/
│   │   │   ├── application/
│   │   │   │   ├── gateways/step.gateway.ts
│   │   │   │   └── use-cases/{create,update-metadata,update-progress,delete,restore,reorder}-step.use-case.ts
│   │   │   ├── infrastructure/{http-step.gateway.ts, mappers/step.mapper.ts}
│   │   │   └── presentation/
│   │   │       ├── components/
│   │   │       │   ├── StepList.tsx                            # @dnd-kit/sortable
│   │   │       │   ├── StepFormDialog.tsx                      # selector de tipo
│   │   │       │   ├── StatusEditor.tsx
│   │   │       │   └── subtypes/{ProgressBarStep,CheckStep,StatusStep,CounterStep}.tsx
│   │   │       ├── hooks/use-steps.ts                          # useOptimistic + sync
│   │   │       └── schemas/step.schema.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── domain/{summary.ts, timeline-point.ts}
│   │   │   ├── application/
│   │   │   │   ├── gateways/dashboard.gateway.ts
│   │   │   │   └── use-cases/{get-summary,get-timeline,get-calendar,get-upcoming}.use-case.ts
│   │   │   ├── infrastructure/{http-dashboard.gateway.ts, mappers/}
│   │   │   └── presentation/
│   │   │       └── components/{DashboardScreen,SummaryCards,StreakCard,CategoryBreakdownChart,ProgressTimelineChart,UpcomingList}.tsx
│   │   │
│   │   ├── calendar/
│   │   │   ├── domain/{calendar-event.ts}
│   │   │   ├── application/{gateways, use-cases/get-calendar-events.use-case.ts}
│   │   │   ├── infrastructure/
│   │   │   └── presentation/components/{CalendarScreen,MonthView,WeekView,EventPopover,CalendarFilters}.tsx
│   │   │
│   │   ├── activity/
│   │   │   ├── domain/{activity-log.ts}
│   │   │   ├── application/{gateways/activity.gateway.ts, use-cases/list-activity.use-case.ts}
│   │   │   ├── infrastructure/
│   │   │   └── presentation/components/{ActivityScreen,ActivityFeed,ActivityItem}.tsx
│   │   │
│   │   ├── trash/
│   │   │   ├── domain/
│   │   │   ├── application/{gateways/trash.gateway.ts, use-cases/{list-trash,restore,permanent-delete}.use-case.ts}
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │       ├── components/{TrashScreen,TrashTable,RestoreButton,PermanentDeleteButton}.tsx
│   │   │       └── stores/trash-selection-store.ts
│   │   │
│   │   └── settings/
│   │       ├── domain/
│   │       ├── application/{gateways, use-cases/{update-profile,change-password}.use-case.ts}
│   │       ├── infrastructure/
│   │       └── presentation/components/{SettingsScreen,ProfileForm,ChangePasswordForm,AppearanceSettings}.tsx
│   │
│   ├── shared/                              # ── CROSS-CUTTING (mismas 4 capas)
│   │   ├── domain/
│   │   │   ├── errors/{domain-error.ts, not-found.error.ts, validation.error.ts}
│   │   │   └── value-objects/{uuid.ts, progress-value.ts}
│   │   ├── application/
│   │   │   └── ports/{clock.gateway.ts}                        # puertos cross-feature (si surgen)
│   │   ├── infrastructure/
│   │   │   ├── api/
│   │   │   │   ├── openapi-client.ts                           # openapi-fetch (browser)
│   │   │   │   ├── server-client.ts                            # server-side con cookie forwarding
│   │   │   │   ├── schema.d.ts                                 # generado por openapi-typescript
│   │   │   │   └── http-error.ts                               # HTTP → DomainError
│   │   │   └── storage/local-storage.ts                        # wrapper tipado
│   │   ├── presentation/
│   │   │   ├── stores/ui-store.ts                              # sidebar collapsed, theme, etc.
│   │   │   ├── hooks/{use-debounce.ts, use-media-query.ts}
│   │   │   ├── layout/{AppShell,Sidebar,Topbar,UserMenu}.tsx
│   │   │   └── utils/{cn.ts, format-date.ts, format-error.ts}  # DomainError → mensaje
│   │   ├── composition/                     # ── COMPOSITION ROOT (único que junta módulos)
│   │   │   ├── tokens.ts                                       # symbols/keys
│   │   │   ├── server-container.ts                             # factories para RSC / Server Actions
│   │   │   └── client-container.ts                             # factories para Client Components
│   │   └── ui-kit/                          # ── DISEÑO PROPIO (atomización de htmls/)
│   │       ├── tokens.css                                      # design tokens (color, type, motion)
│   │       ├── atoms/{Button,Input,Label,Badge,Chip,Tab,Icon,ProgressBar,Checkbox,Switch,StreakDot,ThemeToggle,PasswordInput}.tsx
│   │       ├── molecules/{FormField,TabGroup,BrandLogo,StepIndicator,QuoteCard,StreakWeek,CategoryProgressRow,Toast,ConfirmDialog,DatePickerField}.tsx
│   │       └── icons/                                          # set custom + wrappers sobre lucide
│   │
│   └── components/ui/                       # shadcn primitives (CONFINADAS — solo ui-kit las consume)
│
├── htmls/                                   # fuente de verdad visual (diseños a atomizar)
│   └── B _ Vibrante _graphic_ color blocks_.html               # auth: login + side panel
├── middleware.ts                            # protege rutas /(app)
├── components.json                          # shadcn config (output → src/components/ui)
├── next.config.ts
├── tsconfig.json                            # paths: @/modules/*, @/shared/*, @/components/*
└── package.json
```

> Nota sobre shadcn: por defecto instala en `components/ui/` (raíz). Lo movemos a `src/components/ui/` ajustando `components.json` (`"aliases.ui": "@/components/ui"` con base `src`). Esto deja todo el código bajo `src/` excepto `app/` (routing).

### 2.1 Reglas de imports (linter)

`eslint-plugin-boundaries` configurado con dos dimensiones: **módulo** (auth, goals, …, shared) y **capa** (domain, application, infrastructure, presentation).

| Desde | Puede importar |
|---|---|
| `modules/<feature>/domain` | nada externo (TS puro). Permitido: `shared/domain` |
| `modules/<feature>/application` | su propio `domain`, `shared/domain`, `shared/application` |
| `modules/<feature>/infrastructure` | su propio `domain`+`application`, `shared/*` (excepto `presentation`), libs externas |
| `modules/<feature>/presentation` | su propio `domain`+`application`, `shared/presentation`, `shared/ui-kit`, `shared/composition`, libs UI |
| `shared/domain` | nada externo |
| `shared/application` | `shared/domain` |
| `shared/infrastructure` | `shared/domain`, `shared/application`, libs externas |
| `shared/composition` | **todo** (único que junta módulos) |
| `shared/ui-kit` | `shared/presentation/utils`, `src/components/ui` (shadcn), libs UI |
| `shared/presentation` | `shared/domain`, `shared/ui-kit`, `shared/composition`, libs UI |
| `app/` | `shared/composition`, `shared/ui-kit`, `shared/presentation`, **organisms de `modules/<feature>/presentation` solo vía `index.ts`** del módulo, libs UI |
| ❌ módulo → módulo | un módulo **NUNCA** importa de otro (`modules/goals/...` no toca `modules/steps/...`). Si surge necesidad: subir a `shared/`, exponerlo en `index.ts`, o componer en `composition` |
| ❌ presentation → infrastructure | `app/` y `modules/<feature>/presentation` no importan `infrastructure` (ni propia ni ajena) — siempre vía `composition` |
| ❌ shadcn directo | **nadie** importa `@/components/ui/*` excepto `@/shared/ui-kit/*` (shadcn queda encapsulado) |
| ❌ Next APIs en core | `domain` y `application` no importan `next/*`, `react`, fetch, etc. |

---

## 3. Convenciones Next.js 16 + Screaming/Clean

> **Antes de codear**: abrir `node_modules/next/dist/docs/` y leer secciones de App Router, Server Actions, fetch caching, middleware. Lo siguiente es el plan de **uso**, sujeto a verificación de API exacta:

- **Server Components**: las páginas en `app/` importan el organism del módulo (`<GoalListScreen/>` desde `@/modules/goals`). El screen invoca use-cases vía `serverContainer.goals.list.execute(...)`. El container resuelve el gateway con cookie forwarding automático.
- **Server Actions**: `actions.ts` colocado junto a la página, marcado con `'use server'`. Cada action:
  1. Valida con el Zod schema del módulo (`@/modules/<feature>/presentation/schemas/...`).
  2. Mapea form values → command con el mapper del módulo.
  3. Invoca el use case desde `serverContainer`.
  4. Captura `DomainError` y devuelve `{ ok:false, fieldErrors }` o `{ ok:true, data }`.
  5. Revalida con `revalidateTag()` o `revalidatePath()`.
- **Client Components**: usan hooks de `@/modules/<feature>/presentation/hooks/` que internamente usan `clientContainer`. Marcados con `'use client'`.
- **Streaming**: `<Suspense>` con `loading.tsx` por carpeta.
- **Error handling**: `error.tsx` por segmento + `format-error.ts` (en `shared/presentation/utils`) que mapea `DomainError` → mensaje.
- **Caching**: tags por entidad (`categories`, `goals`, `goal:${id}`, `dashboard`); invalidar desde Server Actions.

### 3.1 Flujo Server Action (ejemplo Create Goal)

```ts
// app/(app)/goals/actions.ts
'use server';
import { serverContainer } from '@/shared/composition/server-container';
import { goalFormSchema } from '@/modules/goals/presentation/schemas/goal.schema';
import { toCreateGoalCommand } from '@/modules/goals/presentation/mappers/goal-form.mapper';
import { DomainError } from '@/shared/domain/errors/domain-error';
import { revalidateTag } from 'next/cache';

export async function createGoalAction(input: unknown) {
  const parsed = goalFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    const command = toCreateGoalCommand(parsed.data);
    const goal = await serverContainer().goals.create.execute(command);
    revalidateTag('goals');
    return { ok: true, data: goal };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, fieldErrors: { _: [e.message] } };
    throw e;
  }
}
```

### 3.2 Flujo Use Case

```ts
// src/modules/goals/application/use-cases/create-goal.use-case.ts
import type { GoalGateway } from '../gateways/goal.gateway';
import type { Goal, CreateGoalCommand } from '../../domain/entities/goal';

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
// src/modules/goals/infrastructure/http-goal.gateway.ts
import type { GoalGateway } from '../application/gateways/goal.gateway';
import type { OpenApiClient } from '@/shared/infrastructure/api/openapi-client';
import { mapHttpError } from '@/shared/infrastructure/api/http-error';
import { GoalMapper } from './mappers/goal.mapper';

export class HttpGoalGateway implements GoalGateway {
  constructor(private readonly client: OpenApiClient) {}
  async create(cmd: CreateGoalCommand): Promise<Goal> {
    const { data, error } = await this.client.POST('/goals', { body: cmd });
    if (error) throw mapHttpError(error);
    return GoalMapper.toDomain(data);
  }
}
```

### 3.4 Página `app/` (entry-point fino)

```tsx
// app/(app)/goals/page.tsx
import { GoalListScreen } from '@/modules/goals';      // barrel del módulo
import { serverContainer } from '@/shared/composition/server-container';

export default async function GoalsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const filters = await searchParams;
  const goals = await serverContainer().goals.list.execute(filters);
  return <GoalListScreen initialGoals={goals} initialFilters={filters} />;
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

> Para cada feature listo el **HTML de referencia** (cuando exista en `htmls/`). Si todavía no hay HTML para una pantalla, se irán agregando y este plan se actualiza.

### 6.1 `/login` y `/register` — módulo `auth`
**Diseño de referencia**: `htmls/B _ Vibrante _graphic_ color blocks_.html`.

Layout split en dos paneles:
- **Panel izquierdo (`<LoginForm/>` / `<RegisterForm/>`)**:
  - Header con `<BrandLogo/>` ("atomic / goals"), `<StreakBadge>` (racha + "ahora" con `vibe-blink`) y `<ThemeToggle/>` (sun/moon).
  - Título grande tipo "Vuelve al ritmo." + `<StepIndicator label="01 de 02"/>`.
  - `<TabGroup>` "Entrar" | "Crear cuenta" (cambia el organism, no la ruta — o se mantiene una ruta por modo, decidir en Fase 1).
  - `<FormField>` correo + `<PasswordInput>` con toggle "show", link "recuperar →".
  - Botón submit `<Button variant="primary">entrar →</Button>` con animación `vibe-fade` al estado loading.
  - Footer pequeño: "demo · cualquier correo válido" (placeholder mientras no haya endpoint real).
- **Panel derecho (`<AuthSidePanel/>`)** — bloques de color decorativos:
  - `<StreakWeekCard/>`: "tu racha · semana actual", número grande "23 días seguidos", `<StreakWeek>` con puntos L M X J V S D, "récord personal · 47 días".
  - `<CategoriesProgressCard/>`: header "tus categorías 5/12", lista de `<CategoryProgressRow>` (nombre + barra + %).
  - `<QuoteCard/>`: "cita del día", quote + autor.
- Validación: Zod en `modules/auth/presentation/schemas/`. El 400 del back (`class-validator`) se mapea a `setError` en cada campo.
- Errores top-level (alert) + por campo. Link cruzado login ↔ register.
- Atomización exhaustiva en `shared/ui-kit/` — ver §1.2 tabla de mapping.

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

### Fase 0 — Setup + esqueleto Screaming/Clean + UI Kit base (1.5 días)
- [ ] Instalar deps: `zustand react-hook-form @hookform/resolvers zod openapi-fetch openapi-typescript chart.js react-chartjs-2 @dnd-kit/core @dnd-kit/sortable lucide-react next-themes sonner date-fns clsx tailwind-merge class-variance-authority`.
- [ ] Dev deps: `eslint-plugin-boundaries`.
- [ ] `pnpm dlx shadcn@latest init` con output `src/components/ui` (editar `components.json`: `aliases.ui = "@/components/ui"`, `aliases.components = "@/components"`).
- [ ] Agregar primitives shadcn: `button card dialog form input label select textarea dropdown-menu sheet tabs avatar badge checkbox table tooltip skeleton sonner toggle separator scroll-area popover calendar date-picker`.
- [ ] Crear estructura `src/modules/{auth,categories,goals,steps,dashboard,calendar,activity,trash,settings}/{domain,application,infrastructure,presentation}` con stubs (un README.md por módulo describiendo su responsabilidad).
- [ ] Crear estructura `src/shared/{domain,application,infrastructure,presentation,composition,ui-kit}`.
- [ ] `src/shared/domain/errors/`: `DomainError`, `NotFoundError`, `UnauthorizedError`, `ValidationError`.
- [ ] `tsconfig.json` paths: `@/modules/*`, `@/shared/*`, `@/components/*`, `@/app/*`.
- [ ] `eslint-plugin-boundaries` configurado con las reglas de §2.1 (módulos aislados entre sí + capas dentro de cada módulo + shadcn solo desde ui-kit).
- [ ] **Design tokens y UI Kit base** (atomización inicial desde `htmls/B _ Vibrante_...html`):
  - [ ] `src/shared/ui-kit/tokens.css`: paleta "Vibrante / color blocks" (primarios, neutrales, semánticos), tipografía (JetBrains Mono + sans), espacios, radios, sombras, keyframes (`vibe-blink`, `vibe-pulse`, `vibe-fade`), easings.
  - [ ] `app/globals.css`: importa tokens + Tailwind v4 (`@theme inline`).
  - [ ] `src/shared/ui-kit/atoms/`: primer batch — `Button`, `Input`, `PasswordInput`, `Label`, `Badge`, `Chip`, `Tab`, `Icon`, `ProgressBar`, `Checkbox`, `StreakDot`, `ThemeToggle`.
  - [ ] `src/shared/ui-kit/molecules/`: `FormField`, `TabGroup`, `BrandLogo`, `StepIndicator`, `QuoteCard`, `StreakWeek`, `CategoryProgressRow`.
  - [ ] Storybook **opcional** o página interna `/__styleguide` para visualizar el ui-kit.
- [ ] `next-themes` provider en `app/layout.tsx` (los tokens cambian por tema).
- [ ] `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`, `API_INTERNAL_URL=http://localhost:4000/api/v1`.
- [ ] `src/shared/composition/` con tokens y factories que devuelven stubs por módulo (`{ auth: {...}, goals: {...}, ... }`).
- [ ] Healthcheck: Server Component que invoca `HealthCheckUseCase` (vía `serverContainer`) y muestra status.

### Fase 1 — Auth + Layout protegido (2.5 días)
**Bloqueada por backend Fase 1.**
- [ ] Script `openapi:gen` + primera generación de `schema.d.ts` en `src/shared/infrastructure/api/`.
- [ ] `src/shared/infrastructure/api/openapi-client.ts` + `server-client.ts` (con cookie forwarding) + `http-error.ts`.
- [ ] **`modules/auth/domain`**: `User`, `Email` VO, errores `InvalidCredentialsError`, `UnauthorizedError`.
- [ ] **`modules/auth/application`**: gateways `AuthGateway`, `SessionGateway`. Use cases `Login`, `Register`, `Logout`, `RefreshSession`, `GetCurrentUser`.
- [ ] **`modules/auth/infrastructure`**: `HttpAuthGateway`, `NextCookieSessionGateway` (server), `BrowserSessionGateway` (client), `UserMapper`.
- [ ] **`shared/composition`**: registrar gateways y use cases del módulo `auth` en `serverContainer.auth` y `clientContainer.auth`.
- [ ] **`modules/auth/presentation`**:
  - `stores/auth-store.ts` (Zustand: accessToken + user).
  - `schemas/{login,register}.schema.ts` Zod.
  - `mappers/{login,register}-form.mapper.ts` (form → command).
  - `hooks/use-auth.ts`.
  - **Atomizar el HTML del auth**: completar `AuthScreen`, `LoginForm`, `RegisterForm`, `AuthSidePanel` reutilizando los atoms/molecules del ui-kit (§6.1).
- [ ] Páginas `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx` (entry-points finos) + `actions.ts` que invocan use cases.
- [ ] `middleware.ts` (lee cookies, redirect si no auth).
- [ ] Route Handler `app/api/auth/refresh/route.ts` que delega en `RefreshSessionUseCase`.
- [ ] `shared/presentation/layout/AppShell` (Sidebar + Topbar) usado en `app/(app)/layout.tsx`.
- [ ] User menu con logout (Server Action que invoca `LogoutUseCase`).

### Fase 2 — Categorías (1.5 días)
**Módulo: `modules/categories/`. HTML pendiente.**
- [ ] **domain**: tipo `Category`.
- [ ] **application**: gateway `CategoryGateway`. Use cases `Create`, `Update`, `Delete`, `Restore`, `List`, `Get`.
- [ ] **infrastructure**: `HttpCategoryGateway`, `CategoryMapper`.
- [ ] **composition**: registrar `categories` en server/client containers.
- [ ] **presentation**: schemas Zod, hook `useCategories`, mapper form→command.
- [ ] Server Actions en `app/(app)/categories/actions.ts`.
- [ ] Organisms en el módulo: `<CategoryListScreen>`, `<CategoryDetailScreen>`, `<CategoryCard>`, `<CategoryForm>` (dialog).
- [ ] Páginas `/categories` y `/categories/[id]` (entry-points finos).
- [ ] Color picker (chips predefinidos del ui-kit) + icon picker (subset de lucide envuelto en `ui-kit/icons`).
- [ ] Cuando llegue el HTML de esta vista → revisar tabla §1.2 y extraer atoms/molecules nuevos al ui-kit antes de armar organisms.

### Fase 3 — Metas (2.5 días)
**Módulo: `modules/goals/`. Bloqueada por backend Fase 3.**
- [ ] **domain**: tipos `Goal`, `GoalInstance`, enum `CyclePeriod`, errores propios.
- [ ] **application**: gateways `GoalGateway`, `GoalInstanceGateway`. Use cases CRUD + `ListInstances`, `CompleteInstance`.
- [ ] **infrastructure**: gateways HTTP + mappers.
- [ ] **presentation**: schemas Zod con validaciones condicionales (cíclica → periodo requerido), `goal-filters-store` (Zustand).
- [ ] Server Actions `app/(app)/goals/actions.ts`.
- [ ] Organisms: `<GoalListScreen>`, `<GoalDetailScreen>`, `<GoalForm>` con campos condicionales (cíclica vs conclusiva), `<GoalCard>`, `<GoalFilters>` (sincronizados a querystring + store), `<GoalCycleHistory>`.
- [ ] Páginas `/goals` y `/goals/[goalId]` con tabs Pasos | Histórico.

### Fase 4 — Pasos y subtipos (3.5 días)
**Módulo: `modules/steps/`. Bloqueada por backend Fase 4.**
- [ ] **domain**: union discriminada `Step = ProgressBarStep | CheckStep | StatusStep | CounterStep`, función `stepProgress(step)`, `ProgressCalculator` (mismo algoritmo que el back) para optimistic UI.
- [ ] **application**: gateway `StepGateway`. Use cases `Create`, `UpdateMetadata`, `UpdateProgress`, `Delete`, `Restore`, `Reorder`. `UpdateStepProgressUseCase` calcula progreso local optimista y luego sincroniza.
- [ ] **infrastructure**: `HttpStepGateway`, `StepMapper` con switch por type.
- [ ] **presentation**: hook `useSteps` con estado optimista (useOptimistic).
- [ ] `<StepList>` con `@dnd-kit/sortable`, `<StepFormDialog>` con selector de tipo, los 4 subtipos en `presentation/components/subtypes/`, `<StatusEditor>` para `StatusStep`.

### Fase 5 — Dashboard real + Charts (2 días)
**Módulo: `modules/dashboard/`. Bloqueada por backend Fase 5.**
- [ ] **application**: gateway `DashboardGateway`, use cases `GetSummary`, `GetTimeline`, `GetCalendar`, `GetUpcoming`.
- [ ] **infrastructure**: `HttpDashboardGateway`.
- [ ] Configurar Chart.js (registrar componentes; envoltorios "themed" en `ui-kit/molecules/Chart*` para que usen los tokens).
- [ ] Organisms: `<DashboardScreen>`, `<SummaryCards>`, `<StreakCard>`, `<CategoryBreakdownChart>` (doughnut), `<ProgressTimelineChart>` (line con selector de rango), `<UpcomingList>`, `<ActivityFeed>`.
- [ ] Empty states (en `ui-kit/molecules/EmptyState`).

### Fase 6 — Calendario (1 día)
**Módulo: `modules/calendar/`.**
- [ ] Use case `GetCalendarEvents` (puede consumir gateways de `goals`/`steps` vía composition o vivir en `dashboard`; decidir en Fase 5).
- [ ] `<CalendarScreen>`, `<MonthView>` sobre `react-day-picker` (re-estilizado via ui-kit) + overlay de eventos, `<WeekView>`, `<EventPopover>`, `<CalendarFilters>`.

### Fase 7 — Actividad + Papelera (1.5 días)
**Módulos: `modules/activity/` y `modules/trash/`.**
- [ ] **application**: gateways `ActivityGateway`, `TrashGateway`. Use cases `ListActivity` (paginación cursor), `ListTrash`, `Restore`, `PermanentDelete`.
- [ ] **infrastructure**: gateways HTTP.
- [ ] `<ActivityFeed>` paginado infinito (intersection observer + use case).
- [ ] `<TrashScreen>` con tabs + tabla seleccionable (selección en `trash-selection-store`).
- [ ] `<ConfirmDialog>` reutilizable (vive en `ui-kit/molecules/`).
- [ ] Server Actions restore y permanent delete.

### Fase 8 — Settings + polish (1.5 días)
**Módulo: `modules/settings/`.**
- [ ] Use cases `UpdateProfile`, `ChangePassword`.
- [ ] `<SettingsScreen>` con tabs perfil/apariencia.
- [ ] Cambio de password (form aparte).
- [ ] Loading skeletons en todas las páginas (`ui-kit/atoms/Skeleton`).
- [ ] `error.tsx` por segmento con `format-error.ts` (en `shared/presentation/utils`).
- [ ] Empty states bonitos en todos los listados.
- [ ] Accesibilidad: labels, focus rings, navegación por teclado.
- [ ] **Auditoría visual**: revisar todo el app contra los HTMLs en `htmls/` y corregir desviaciones.

---

## 9. Estado — separación clara

| Tipo de estado | Dónde vive | Capa |
|---|---|---|
| Datos del servidor (categorías, metas, pasos) | Server Components invocando use-cases del módulo + `revalidateTag` | `modules/<feature>/application` vía `shared/composition` |
| Auth (accessToken, user) | Zustand `modules/auth/presentation/stores/auth-store` | presentation (módulo `auth`) |
| Cookie session | httpOnly cookie + `NextCookieSessionGateway` | `modules/auth/infrastructure` |
| UI global efímera (sidebar collapsed, theme) | Zustand `shared/presentation/stores/ui-store` (persist en localStorage vía `shared/infrastructure/storage`) | shared presentation + infrastructure |
| Filtros de listas | Querystring (URL) + Zustand del módulo (e.g. `goal-filters-store`) | presentation del módulo |
| Drafts de forms | RHF (en el form) | presentation del módulo |
| Optimistic updates | `useOptimistic` + use cases (e.g. `UpdateStepProgressUseCase`) que calculan progreso local con `ProgressCalculator` | presentation + domain del módulo |
| Toasts | Sonner envuelto en `shared/ui-kit/molecules/Toast` | shared/ui-kit |

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

## 13. Convenciones Screaming + Clean — quick reference

- **¿Un componente puede hacer fetch directo?** Nunca. Siempre vía un use case obtenido del container.
- **¿Una Server Action puede importar `infrastructure`?** No directamente; importa `serverContainer` (`@/shared/composition/server-container`) y obtiene los use cases ya cableados.
- **¿Un módulo puede importar de otro módulo?** No. `modules/goals` no toca `modules/steps`. Si hace falta colaboración: subir a `shared/`, exponer en el `index.ts` del módulo, o componer en `composition`.
- **¿Los tipos generados por OpenAPI son los del dominio?** No. Viven en `shared/infrastructure/api/schema.d.ts` y solo los usan los gateways HTTP + mappers de cada módulo. El resto del código usa entidades del dominio del módulo.
- **¿Dónde va una validación nueva?**
  - Si es **regla de negocio** (e.g., "una meta cíclica requiere periodo") → en la entidad o el use case del módulo (`modules/<feature>/domain` o `application`).
  - Si es **forma del input** (e.g., longitud máxima del nombre) → Zod schema en `modules/<feature>/presentation/schemas`.
- **¿Zustand en `domain` o `application`?** Nunca. Zustand es siempre `presentation` (del módulo o de `shared`).
- **¿Server Components leyendo de Zustand?** Imposible (Zustand es client-only); usar `serverContainer` + use cases.
- **¿Dónde manejo errores de red?** En el gateway HTTP del módulo — convierte a `DomainError` (base en `shared/domain/errors`). El resto del código solo conoce `DomainError`.
- **¿Puedo usar `@/components/ui/button` (shadcn) en una pantalla?** No. Solo `@/shared/ui-kit/*` usa shadcn. El resto usa el ui-kit. Si falta un atom o molecule en el ui-kit, agrégalo allí primero.
- **¿Cómo hago una nueva pantalla?**
  1. Asegurarse de que los atoms/molecules necesarios existan en `shared/ui-kit/` (si no, atomizar del HTML de referencia primero).
  2. `modules/<feature>/domain`: entidad y errores.
  3. `modules/<feature>/application`: gateway interface + use case.
  4. `modules/<feature>/infrastructure`: implementación HTTP + mapper.
  5. Registrar en `shared/composition`.
  6. `modules/<feature>/presentation`: schema Zod, mapper form→command, hook, organisms.
  7. `app/.../page.tsx` y `actions.ts`: entry-points finos que importan el organism del módulo.
- **¿Dónde añado un nuevo atom/molecule?** En `src/shared/ui-kit/atoms` o `molecules`. Si es específico de un feature (no reutilizable), va dentro del módulo: `modules/<feature>/presentation/components`.
