import { serverContainer } from "@/shared/composition/server-container";
import { ActivityScreen } from "@/modules/activity";
import { redirectIfUnauthorized } from "@/shared/presentation/auth/session-expired";

export const dynamic = "force-dynamic";
export const metadata = { title: "Actividad — Atomic Goals" };

export default async function ActivityPage() {
  const container = await serverContainer();
  const initialPage = await container.activity.list
    .execute({ limit: 20 })
    .catch(async (e: unknown) => {
      await redirectIfUnauthorized(e, "/activity");
      console.error("[activity] list failed:", e);
      return { items: [], nextCursor: null };
    });

  return <ActivityScreen initialPage={initialPage} />;
}
