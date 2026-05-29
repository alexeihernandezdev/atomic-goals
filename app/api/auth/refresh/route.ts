import { NextResponse, type NextRequest } from "next/server";
import { serverContainer } from "@/shared/composition/server-container";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const container = await serverContainer();
    const result = await container.auth.refreshSession.execute(refreshToken);
    const res = NextResponse.json({ ok: true });
    res.cookies.set("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}
