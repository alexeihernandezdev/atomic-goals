import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido.")
    .email("Formato de correo inválido."),
  password: z
    .string()
    .min(1, "La contraseña es requerida.")
    .min(6, "Mínimo 6 caracteres."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
