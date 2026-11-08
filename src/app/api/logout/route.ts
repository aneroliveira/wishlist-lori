import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";

export async function POST() {
  const session = await getAuthSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
