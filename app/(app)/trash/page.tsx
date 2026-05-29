import { serverContainer } from "@/shared/composition/server-container";
import { TrashScreen } from "@/modules/trash";
import { redirectIfUnauthorized } from "@/shared/presentation/auth/session-expired";

export const dynamic = "force-dynamic";
export const metadata = { title: "Papelera — Atomic Goals" };

export default async function TrashPage() {
  const container = await serverContainer();
  const list = await container.trash.listAll
    .execute()
    .catch(async (e: unknown) => {
      await redirectIfUnauthorized(e, "/trash");
      console.error("[trash] listAll failed:", e);
      return { goals: [], categories: [], steps: [] };
    });

  return <TrashScreen initialList={list} />;
}
