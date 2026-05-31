import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverContainer } from "@/shared/composition/server-container";
import { NextCookieSessionGateway } from "@/modules/auth/infrastructure/next-cookie-session.gateway";

/** Validates session for `(app)` routes; refreshes or redirects to login. */
export async function ensureAuthenticated(): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/login");
  }

  const container = await serverContainer();
  let user = await container.auth.getCurrentUser.execute();

  if (!user && refreshToken) {
    try {
      await container.auth.refreshSession.execute(refreshToken);
      user = await container.auth.getCurrentUser.execute();
    } catch {
      // refresh failed — clear and send to login below
    }
  }

  if (!user) {
    await new NextCookieSessionGateway().clearSession();
    redirect("/login?reason=session-expired");
  }
}
