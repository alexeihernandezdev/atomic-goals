import type { RegisterCommand } from "@/modules/auth/domain/entities/user";
import type { RegisterFormValues } from "../schemas/register.schema";

export function toRegisterCommand(values: RegisterFormValues): RegisterCommand {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
  };
}
