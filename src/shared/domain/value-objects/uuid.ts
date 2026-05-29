import { ValidationError } from "../errors/validation.error";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class Uuid {
  private constructor(readonly value: string) {}

  static create(value: string): Uuid {
    if (!UUID_REGEX.test(value)) {
      throw new ValidationError(`"${value}" no es un UUID válido.`);
    }
    return new Uuid(value);
  }

  toString(): string {
    return this.value;
  }
}
