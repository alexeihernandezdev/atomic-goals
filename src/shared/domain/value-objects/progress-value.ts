import { ValidationError } from "../errors/validation.error";

export class ProgressValue {
  private constructor(readonly value: number) {}

  static create(value: number): ProgressValue {
    if (value < 0 || value > 100) {
      throw new ValidationError(
        `El progreso debe estar entre 0 y 100, recibido: ${value}.`,
      );
    }
    return new ProgressValue(Math.round(value * 100) / 100);
  }

  static zero(): ProgressValue {
    return new ProgressValue(0);
  }

  static full(): ProgressValue {
    return new ProgressValue(100);
  }

  isComplete(): boolean {
    return this.value >= 100;
  }

  toString(): string {
    return `${this.value}%`;
  }
}
