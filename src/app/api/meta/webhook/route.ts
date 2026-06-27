import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ ok: false, message: "Demo webhook verification endpoint" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => ({}));
  console.log("Demo Meta webhook event received", payload);
  return NextResponse.json({ ok: true, stored: false, mode: "demo_safe_stub" });
}
