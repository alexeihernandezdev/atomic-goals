import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Valid access token — proceed normally
  if (accessToken) {
    if (isPublic) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // No access token but have a refresh token — try to get a new access token silently
  if (refreshToken && !isPublic) {
    try {
      const refreshUrl = new URL("/api/auth/refresh", request.nextUrl.origin);
      const refreshRes = await fetch(refreshUrl, {
        method: "POST",
        headers: { Cookie: `refresh_token=${refreshToken}` },
      });

      if (refreshRes.ok) {
        const json = (await refreshRes.json()) as { accessToken?: string };
        const newAccessToken = json.accessToken;
        if (newAccessToken) {
          const secure = request.nextUrl.protocol === "https:";
          const response = NextResponse.next();
          response.cookies.set("access_token", newAccessToken, {
            ...COOKIE_OPTIONS,
            secure,
            maxAge: 60 * 60,
          });
          // Forward rotated refresh_token if the route returned one
          const setCookieHeader = refreshRes.headers.get("set-cookie") ?? "";
          const rotatedMatch = setCookieHeader.match(/refresh_token=([^;]+)/);
          if (rotatedMatch) {
            response.cookies.set("refresh_token", rotatedMatch[1], {
              ...COOKIE_OPTIONS,
              secure,
              maxAge: 60 * 60 * 24 * 30,
            });
          }
          return response;
        }
      }
    } catch {
      // Refresh attempt failed — fall through to login redirect
    }
  }

  // Not authenticated
  if (!isPublic) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
