import { NotFoundError } from "@/shared/domain/errors/not-found.error";

export class GoalNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Goal not found: ${id}`);
  }
}
