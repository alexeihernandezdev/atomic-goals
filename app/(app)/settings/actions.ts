"use server";

import { serverContainer } from "@/shared/composition/server-container";
import type { UpdateProfileCommand, ChangePasswordCommand } from "@/modules/settings/application/gateways/settings.gateway";

export async function updateProfileAction(
  command: UpdateProfileCommand,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    await container.settings.updateProfile.execute(command);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al guardar el perfil.";
    return { ok: false, message: msg };
  }
}

export async function changePasswordAction(
  command: ChangePasswordCommand,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    await container.settings.changePassword.execute(command);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al cambiar la contraseña.";
    return { ok: false, message: msg };
  }
}
