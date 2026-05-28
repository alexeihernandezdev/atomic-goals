import type { LoginCommand } from "@/modules/auth/domain/entities/user";
import type { LoginFormValues } from "../schemas/login.schema";

export function toLoginCommand(values: LoginFormValues): LoginCommand {
  return { email: values.email.trim().toLowerCase(), password: values.password };
}
