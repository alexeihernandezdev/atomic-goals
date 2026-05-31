# Crear nuevo atom o molecule en el UI Kit

Antes de construir cualquier organism o pantalla, verifica que los atoms y molecules que necesita existen en `src/shared/ui-kit/`. Si no existen, créalos aquí primero.

## Cuándo es atom vs molecule

- **Atom** (`src/shared/ui-kit/atoms/`): elemento UI indivisible — `Button`, `Input`, `Label`, `Badge`, `Chip`, `Icon`, `ProgressBar`, `Checkbox`, `StreakDot`, `ThemeToggle`, `PasswordInput`, `Skeleton`, `Switch`.
- **Molecule** (`src/shared/ui-kit/molecules/`): combinación de atoms con un propósito claro — `FormField` (Label+Input+Error), `TabGroup`, `BrandLogo`, `StepIndicator`, `QuoteCard`, `StreakWeek`, `CategoryProgressRow`, `Toast`, `ConfirmDialog`, `DatePickerField`, `EmptyState`.
- **Organism** (específico del feature): si solo se usa en un módulo, va en `modules/<feature>/presentation/components/`, NO en el ui-kit.

## Proceso de atomización desde los HTMLs

1. Abrir el HTML de referencia en `htmls/` para la pantalla que estás construyendo.
2. Identificar los elementos repetibles o reutilizables entre pantallas → son atoms/molecules.
3. Revisar si ya existen en `src/shared/ui-kit/atoms/` o `molecules/`. Si sí, usar el existente.
4. Si no existe, crearlo siguiendo el patrón de abajo.

## Patrón de atom (sobre shadcn primitivo)

```tsx
// src/shared/ui-kit/atoms/Button.tsx
import { Button as ShadButton, type ButtonProps as ShadButtonProps } from '@/components/ui/button';
import { cn } from '@/shared/presentation/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'atomic-btn font-mono transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground',
        ghost: 'hover:bg-accent',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

interface ButtonProps extends ShadButtonProps, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ShadButton
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## Patrón de molecule

```tsx
// src/shared/ui-kit/molecules/FormField.tsx
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';

interface FormFieldProps {
  label: string;
  error?: string;
  children?: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children ?? <Input />}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
```

## Design tokens disponibles

Los tokens están en `src/shared/ui-kit/tokens.css` e `app/globals.css`. Usa siempre variables CSS en lugar de valores hardcoded:

- Colores: `var(--color-primary)`, `var(--color-secondary)`, `--color-accent`, `--color-destructive`, `--color-muted`
- Tipografía: `font-mono` (JetBrains Mono), `font-sans`
- Animaciones: `animate-vibe-blink`, `animate-vibe-pulse`, `animate-vibe-fade`
- Espaciado: escala de Tailwind v4

## Regla de importación

Todos los consumers (`app/`, `modules/*/presentation/`) importan SIEMPRE desde `@/shared/ui-kit/*`.
**Nunca** importan desde `@/components/ui/*` (shadcn) directamente.

```ts
// ✅ Correcto
import { Button } from '@/shared/ui-kit/atoms/Button';

// ❌ Prohibido
import { Button } from '@/components/ui/button';
```

## Después de crear el atom/molecule

1. Exportarlo desde el barrel del ui-kit si existe (`src/shared/ui-kit/index.ts`).
2. Documentar variantes con props claras (TypeScript, no prop-types).
3. Solo entonces proceder a construir el organism que lo usa.
