import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/** Returns the httpOnly access_token for client-side API calls (same-origin only). */
export async function GET() {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }
  return NextResponse.json({ accessToken: token });
}
