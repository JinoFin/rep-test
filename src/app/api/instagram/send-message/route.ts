import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  console.log("Demo send-message request blocked from real sending", body);
  return NextResponse.json({ ok: true, sent: false, mode: "demo_safe_stub", message: "No real Instagram message was sent." });
}
