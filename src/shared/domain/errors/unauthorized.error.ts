import { DomainError } from "./domain-error";

export class UnauthorizedError extends DomainError {
  readonly code = "UNAUTHORIZED";

  constructor(message = "No estás autenticado o tu sesión ha expirado.") {
    super(message);
  }
}
