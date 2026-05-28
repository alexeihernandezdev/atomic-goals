import { DomainError } from "@/shared/domain/errors/domain-error";

export class StepNotFoundError extends DomainError {
  readonly code = "STEP_NOT_FOUND";

  constructor(id: string) {
    super(`Step not found: ${id}`);
  }
}
