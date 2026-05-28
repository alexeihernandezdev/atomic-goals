import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido.")
      .min(2, "Mínimo 2 caracteres."),
    email: z
      .string()
      .min(1, "El correo es requerido.")
      .email("Formato de correo inválido."),
    password: z
      .string()
      .min(1, "La contraseña es requerida.")
      .min(8, "Mínimo 8 caracteres."),
    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
