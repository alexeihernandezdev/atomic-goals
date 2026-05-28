import { DomainError } from "./domain-error";

export interface FieldErrors {
  [field: string]: string[];
}

export class ValidationError extends DomainError {
  readonly code = "VALIDATION_ERROR";
  readonly fieldErrors: FieldErrors;

  constructor(message: string, fieldErrors: FieldErrors = {}) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}
