// app/api/chatkit/session/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { deviceId } = await req.json();

    const r = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        workflow: { id: process.env.CHATKIT_WORKFLOW_ID },
        user: deviceId ?? "anonymous",
      }),
    });

    if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: r.status });

    const { client_secret } = await r.json();
    return NextResponse.json({ client_secret });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown error" }, { status: 500 });
  }
}
