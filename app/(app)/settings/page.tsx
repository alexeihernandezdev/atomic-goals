import { serverContainer } from "@/shared/composition/server-container";
import { SettingsScreen } from "@/modules/settings";
import { redirectIfUnauthorized } from "@/shared/presentation/auth/session-expired";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configuración — Atomic Goals" };

export default async function SettingsPage() {
  const container = await serverContainer();
  const initialProfile = await container.settings.getProfile
    .execute()
    .catch(async (e: unknown) => {
      await redirectIfUnauthorized(e, "/settings");
      return null;
    });

  return <SettingsScreen initialProfile={initialProfile} />;
}
