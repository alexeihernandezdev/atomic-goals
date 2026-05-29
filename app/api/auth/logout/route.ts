import { NextResponse } from "next/server";
import { serverContainer } from "@/shared/composition/server-container";

export async function POST() {
  try {
    const container = await serverContainer();
    await container.auth.logout.execute();
  } catch {
    // best-effort
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete("access_token");
  res.cookies.delete("refresh_token");
  return res;
}
