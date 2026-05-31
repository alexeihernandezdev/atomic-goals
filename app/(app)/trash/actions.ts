"use server";

import { serverContainer } from "@/shared/composition/server-container";
import type { TrashEntityType } from "@/modules/trash/domain/trashed-item";

export async function restoreItemAction(
  entityType: TrashEntityType,
  id: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    await container.trash.restore.execute(entityType, id);
    return { ok: true };
  } catch {
    return { ok: false, message: "No se pudo restaurar el elemento." };
  }
}

export async function permanentDeleteAction(
  entityType: TrashEntityType,
  id: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    await container.trash.permanentDelete.execute(entityType, id);
    return { ok: true };
  } catch {
    return { ok: false, message: "No se pudo eliminar el elemento." };
  }
}

export async function emptyTrashAction(): Promise<{ ok: boolean; message?: string }> {
  try {
    const container = await serverContainer();
    const list = await container.trash.listAll.execute();
    const all: { entityType: TrashEntityType; id: string }[] = [
      ...list.goals.map((i) => ({ entityType: "goal" as TrashEntityType, id: i.id })),
      ...list.categories.map((i) => ({ entityType: "category" as TrashEntityType, id: i.id })),
      ...list.steps.map((i) => ({ entityType: "step" as TrashEntityType, id: i.id })),
    ];
    await Promise.all(
      all.map(({ entityType, id }) =>
        container.trash.permanentDelete.execute(entityType, id),
      ),
    );
    return { ok: true };
  } catch {
    return { ok: false, message: "No se pudo vaciar la papelera." };
  }
}
