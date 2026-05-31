# Crear nuevo feature — Screaming + Clean

Sigue estos pasos en orden para crear un módulo completo en `src/modules/<feature>/`.
No te saltes capas ni mezcles responsabilidades.

## Paso 1 — Domain

Crea `src/modules/<feature>/domain/`:

```
domain/
├── entities/<feature>.ts          # tipo puro (type/interface, no clase pesada)
├── value-objects/                 # VOs propios del feature si aplica
└── errors/<feature>-not-found.error.ts  # extiende DomainError de shared
```

- Solo TypeScript puro. Sin React, sin Next, sin fetch.
- Si el tipo es compartido entre features → moverlo a `src/shared/domain/`.

## Paso 2 — Application (gateways + use cases)

Crea `src/modules/<feature>/application/`:

```
application/
├── gateways/<feature>.gateway.ts  # interface (puerto)
└── use-cases/
    ├── create-<feature>.use-case.ts
    ├── update-<feature>.use-case.ts
    ├── delete-<feature>.use-case.ts
    ├── restore-<feature>.use-case.ts
    ├── list-<feature>.use-case.ts
    └── get-<feature>.use-case.ts
```

Patrón de use case:
```ts
export class Create<Feature>UseCase {
  constructor(private readonly gateway: <Feature>Gateway) {}
  async execute(command: Create<Feature>Command): Promise<<Feature>> {
    // validaciones de invariantes de negocio aquí si aplica
    return this.gateway.create(command);
  }
}
```

## Paso 3 — Infrastructure

Crea `src/modules/<feature>/infrastructure/`:

```
infrastructure/
├── http-<feature>.gateway.ts      # implementa <Feature>Gateway
└── mappers/<feature>.mapper.ts    # OpenAPI types ↔ entidades de dominio
```

- Importa el cliente OpenAPI desde `@/shared/infrastructure/api/openapi-client`.
- Convierte errores HTTP a `DomainError` con `mapHttpError` de `@/shared/infrastructure/api/http-error`.
- El mapper usa tipos de `schema.d.ts` (OpenAPI) y devuelve entidades de dominio.

## Paso 4 — Registrar en Composition Root

En `src/shared/composition/server-container.ts` y `client-container.ts`:

```ts
// Instanciar gateway
const <feature>Gateway = new Http<Feature>Gateway(client);

// Exponer use cases
<feature>: {
  create: new Create<Feature>UseCase(<feature>Gateway),
  list:   new List<Feature>UseCase(<feature>Gateway),
  get:    new Get<Feature>UseCase(<feature>Gateway),
  update: new Update<Feature>UseCase(<feature>Gateway),
  delete: new Delete<Feature>UseCase(<feature>Gateway),
}
```

## Paso 5 — Presentation

Crea `src/modules/<feature>/presentation/`:

```
presentation/
├── components/              # organisms del feature
│   ├── <Feature>ListScreen.tsx
│   ├── <Feature>DetailScreen.tsx
│   ├── <Feature>Card.tsx
│   └── <Feature>Form.tsx   # dialog/sheet con RHF + Zod
├── hooks/use-<feature>.ts   # conecta use cases del clientContainer
├── stores/<feature>-filters-store.ts  # Zustand si hay filtros/selección
├── schemas/<feature>.schema.ts        # Zod schema para RHF
└── mappers/<feature>-form.mapper.ts   # form values → command
```

Hook pattern:
```ts
// use-<feature>.ts
'use client';
export function use<Feature>() {
  const container = clientContainer();
  // SWR / useOptimistic / useState según caso
}
```

Schema Zod:
```ts
// <feature>.schema.ts
export const <feature>FormSchema = z.object({
  name: z.string().min(1).max(100),
  // ...campos
});
export type <Feature>FormValues = z.infer<typeof <feature>FormSchema>;
```

Form mapper:
```ts
// <feature>-form.mapper.ts
export function toCreate<Feature>Command(values: <Feature>FormValues): Create<Feature>Command {
  return { ...values };
}
```

## Paso 6 — Barrel público

Crea `src/modules/<feature>/index.ts` con los organisms y tipos que `app/` necesita:

```ts
export { <Feature>ListScreen } from './presentation/components/<Feature>ListScreen';
export { <Feature>DetailScreen } from './presentation/components/<Feature>DetailScreen';
export type { <Feature> } from './domain/entities/<feature>';
```

## Paso 7 — Routing (app/)

Crea los entry-points finos en `app/(app)/<feature>/`:

```
app/(app)/<feature>/
├── page.tsx          # Server Component: obtiene datos via serverContainer, renderiza organism
├── actions.ts        # Server Actions: valida Zod → mapper → use case → revalidateTag
└── [id]/
    └── page.tsx
```

Server Action pattern:
```ts
'use server';
import { serverContainer } from '@/shared/composition/server-container';
import { <feature>FormSchema } from '@/modules/<feature>/presentation/schemas/<feature>.schema';
import { toCreate<Feature>Command } from '@/modules/<feature>/presentation/mappers/<feature>-form.mapper';

export async function create<Feature>Action(input: unknown) {
  const parsed = <feature>FormSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    const command = toCreate<Feature>Command(parsed.data);
    const result = await serverContainer().<feature>.create.execute(command);
    revalidateTag('<feature>s');
    return { ok: true, data: result };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, fieldErrors: { _: [e.message] } };
    throw e;
  }
}
```

Page pattern:
```tsx
// app/(app)/<feature>/page.tsx
import { <Feature>ListScreen } from '@/modules/<feature>';
import { serverContainer } from '@/shared/composition/server-container';

export default async function <Feature>Page() {
  const items = await serverContainer().<feature>.list.execute({});
  return <<Feature>ListScreen initialItems={items} />;
}
```

## Verificación final

- [ ] `domain` no importa nada externo
- [ ] `application` no importa `infrastructure` ni libs externas
- [ ] `infrastructure` solo importa su propio dominio/application + `shared/*` (no presentation) + libs externas
- [ ] `presentation` no importa `infrastructure`
- [ ] `app/` importa solo vía `index.ts` del módulo y `shared/composition`
- [ ] Ningun componente hace fetch directo
- [ ] No hay import entre módulos (goals no toca steps, etc.)
