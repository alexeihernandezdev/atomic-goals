import { z } from "zod";

export const CATEGORY_ICONS = [
  "heart",
  "book",
  "leaf",
  "briefcase",
  "users",
  "coin",
] as const;

export const CATEGORY_PRESET_COLORS = [
  "#FF3D6E",
  "#2E5BFF",
  "#C8FF1F",
  "#FFB400",
  "#7C5CFF",
  "#1FD1F9",
  "#FF8A4C",
  "#00C896",
  "#F5446B",
  "#9D7AFF",
  "#0E0E0E",
  "#5F5F5F",
] as const;

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio.")
    .max(64, "Máximo 64 caracteres."),
  description: z.string().max(256, "Máximo 256 caracteres.").optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color inválido."),
  icon: z.enum(CATEGORY_ICONS, { message: "Icono inválido." }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
