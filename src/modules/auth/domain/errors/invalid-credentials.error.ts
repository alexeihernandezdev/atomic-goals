import { DomainError } from "@/shared/domain/errors/domain-error";

export class InvalidCredentialsError extends DomainError {
  readonly code = "INVALID_CREDENTIALS";

  constructor() {
    super("Correo o contraseña incorrectos.");
  }
}
