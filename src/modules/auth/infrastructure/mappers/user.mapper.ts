import type { User } from "@/modules/auth/domain/entities/user";

interface RawUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export class UserMapper {
  static toDomain(raw: RawUser): User {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    };
  }
}
