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

    const secure = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true, accessToken: result.accessToken });

    res.cookies.set("access_token", result.accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    if (result.refreshToken) {
      res.cookies.set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return res;
  } catch {
    const res = NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    res.cookies.delete("refresh_token");
    return res;
  }
}
