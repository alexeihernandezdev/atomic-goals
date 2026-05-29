import { ValidationError } from "@/shared/domain/errors/validation.error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(readonly value: string) {}

  static create(raw: string): Email {
    const trimmed = raw.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new ValidationError("Correo electrónico inválido.", {
        email: ["Formato de correo inválido."],
      });
    }
    return new Email(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
