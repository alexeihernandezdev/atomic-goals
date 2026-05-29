import { DomainError } from "./domain-error";

export class NotFoundError extends DomainError {
  readonly code = "NOT_FOUND";

  constructor(resource: string, id?: string) {
    super(id ? `${resource} con id "${id}" no encontrado.` : `${resource} no encontrado.`);
  }
}
