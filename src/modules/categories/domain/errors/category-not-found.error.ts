import { NotFoundError } from "@/shared/domain/errors/not-found.error";

export class CategoryNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Categoría ${id} no encontrada.`);
  }
}
