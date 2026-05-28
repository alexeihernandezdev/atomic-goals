import { DomainError } from "@/shared/domain/errors/domain-error";
import { NotFoundError } from "@/shared/domain/errors/not-found.error";
import { UnauthorizedError } from "@/shared/domain/errors/unauthorized.error";
import {
  ValidationError,
  type FieldErrors,
} from "@/shared/domain/errors/validation.error";

interface ApiErrorBody {
  message?: string | string[];
  statusCode?: number;
  error?: string;
}

export function mapHttpError(error: unknown): DomainError {
  if (typeof error !== "object" || error === null) {
    return new ValidationError("Error desconocido del servidor.");
  }

  const body = error as ApiErrorBody;
  const status = body.statusCode ?? 500;
  const msg = Array.isArray(body.message)
    ? body.message.join(", ")
    : (body.message ?? "Error del servidor.");

  if (status === 401) return new UnauthorizedError();
  if (status === 403)
    return new UnauthorizedError(
      "No tienes permiso para realizar esta acción.",
    );
  if (status === 404) return new NotFoundError(msg);
  if (status === 400 || status === 422) {
    const fieldErrors: FieldErrors = {};
    if (Array.isArray(body.message)) {
      fieldErrors["_"] = body.message;
    }
    return new ValidationError(msg, fieldErrors);
  }

  return new ValidationError(msg);
}
