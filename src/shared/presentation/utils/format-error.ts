import { DomainError } from "@/shared/domain/errors/domain-error";

export function formatError(error: unknown): string {
  if (error instanceof DomainError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Ha ocurrido un error inesperado.";
}
