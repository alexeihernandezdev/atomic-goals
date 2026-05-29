"use server";

import { redirect } from "next/navigation";
import { serverContainer } from "@/shared/composition/server-container";
import { registerSchema } from "@/modules/auth/presentation/schemas/register.schema";
import { toRegisterCommand } from "@/modules/auth/presentation/mappers/register-form.mapper";
import { DomainError } from "@/shared/domain/errors/domain-error";

export async function registerAction(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const container = await serverContainer();
    const command = toRegisterCommand(parsed.data);
    await container.auth.register.execute(command);
  } catch (e) {
    if (e instanceof DomainError) {
      return { ok: false as const, fieldErrors: { _: [e.message] } };
    }
    throw e;
  }

  redirect("/dashboard");
}
