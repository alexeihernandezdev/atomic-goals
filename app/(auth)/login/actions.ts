"use server";

import { redirect } from "next/navigation";
import { serverContainer } from "@/shared/composition/server-container";
import { loginSchema } from "@/modules/auth/presentation/schemas/login.schema";
import { toLoginCommand } from "@/modules/auth/presentation/mappers/login-form.mapper";
import { DomainError } from "@/shared/domain/errors/domain-error";

export async function loginAction(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const container = await serverContainer();
    const command = toLoginCommand(parsed.data);
    await container.auth.login.execute(command);
  } catch (e) {
    if (e instanceof DomainError) {
      return { ok: false as const, fieldErrors: { _: [e.message] } };
    }
    throw e;
  }

  redirect("/dashboard");
}
