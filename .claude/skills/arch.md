# Arquitectura Atomic Goals — Screaming + Clean

Este proyecto usa **Screaming + Clean Architecture**. Antes de escribir cualquier código, internaliza estas reglas y aplícalas sin excepción.

## Estructura de módulos

```
src/modules/<feature>/
├── domain/          # entidades, value objects, errores propios del feature
├── application/     # use-cases + gateways (puertos/interfaces)
├── infrastructure/  # implementación HTTP de los gateways + mappers OpenAPI → dominio
└── presentation/    # componentes, hooks, stores Zustand, schemas Zod, mappers form→command
```

Lo transversal vive en `src/shared/` con las mismas 4 capas.

## Flujo de dependencias (SAGRADO — nunca invertir)

```
presentation ──► application ──► domain
infrastructure ──► domain  +  implementa puertos de application
```

## Reglas de imports — no negociables

| Desde | Puede importar |
|---|---|
| `domain` | nada externo. Solo TypeScript puro. |
| `application` | su propio `domain`, `shared/domain`, `shared/application` |
| `infrastructure` | su `domain`+`application`, `shared/*` (excepto `presentation`), libs externas |
| `presentation` | su `domain`+`application`, `shared/presentation`, `shared/ui-kit`, `shared/composition`, libs UI |
| `shared/composition` | **todo** — es el único que junta módulos |
| `app/` (routing) | organisms de módulos vía `index.ts`, `shared/composition`, `shared/ui-kit`, `shared/presentation` |

**PROHIBIDO:**
- Un módulo importar de otro módulo (`modules/goals` NO toca `modules/steps`). Si hace falta: subir a `shared/`, usar `index.ts` del módulo, o componer en `composition`.
- `presentation` o `app/` importar `infrastructure` directamente — siempre vía `shared/composition`.
- Cualquier capa importar `@/components/ui/*` (shadcn) — solo `@/shared/ui-kit/*` puede hacerlo.
- `domain` o `application` importar `next/*`, `react`, fetch, ni cualquier librería externa.

## Naming conventions

- Use cases: `CreateGoalUseCase`, `UpdateStepProgressUseCase` — clase con `execute()`
- Gateways (puertos): `GoalGateway`, `StepGateway` — interface en `application/gateways/`
- Implementaciones HTTP: `HttpGoalGateway` — en `infrastructure/`
- Mappers: `GoalMapper.toDomain(dto)` — en `infrastructure/mappers/`
- Schemas Zod: `goal.schema.ts` — en `presentation/schemas/`
- Stores Zustand: `goal-filters-store.ts` — en `presentation/stores/`
- Hooks: `use-goals.ts` — en `presentation/hooks/`

## UI Kit — regla dura

- Los HTMLs en `htmls/` son la fuente de verdad visual.
- **Atoms** y **molecules** reutilizables van en `src/shared/ui-kit/atoms/` y `molecules/`.
- **Organisms** específicos de un feature van en `modules/<feature>/presentation/components/`.
- Antes de construir un organism, verificar que los atoms/molecules que necesita existen en `shared/ui-kit/`. Si no, crearlos primero.
- `shadcn` queda confinado en `src/components/ui/` — solo `ui-kit` los consume.

## Composition Root

- `src/shared/composition/server-container.ts` — para Server Components y Server Actions.
- `src/shared/composition/client-container.ts` — para Client Components.
- Es el **único** lugar que instancia gateways y use cases de múltiples módulos.

## Cómo hacer una nueva pantalla (checklist)

1. Verificar/crear atoms y molecules necesarios en `shared/ui-kit/`.
2. `modules/<feature>/domain/`: entidad + errores.
3. `modules/<feature>/application/`: interface del gateway + use case.
4. `modules/<feature>/infrastructure/`: implementación HTTP + mapper.
5. Registrar en `shared/composition/`.
6. `modules/<feature>/presentation/`: schema Zod, mapper form→command, hook, organisms.
7. `app/.../page.tsx` + `actions.ts`: entry-points finos que importan el organism del módulo.

## Quick reference

- **¿Un componente hace fetch directo?** Nunca. Siempre vía un use case del container.
- **¿Una Server Action importa `infrastructure`?** No. Importa `serverContainer`.
- **¿Dónde va una validación?**
  - Regla de negocio → `domain` o use case en `application`.
  - Forma del input (longitud, formato) → Zod schema en `presentation/schemas/`.
- **¿Dónde va Zustand?** Siempre en `presentation`, nunca en `domain` ni `application`.
- **¿Dónde manejo errores de red?** En el gateway HTTP — convierte a `DomainError`. El resto del código solo conoce `DomainError`.
