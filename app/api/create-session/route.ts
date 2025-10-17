import { NextRequest, NextResponse } from "next/server";

type SessionBody = { deviceId?: string };

export async function POST(req: NextRequest) {
  try {
    const { deviceId } = (await req.json()) as SessionBody;

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

    if (!r.ok) {
      const txt = await r.text();
      return NextResponse.json({ error: txt }, { status: r.status });
    }

    const { client_secret } = (await r.json()) as { client_secret: string };
    return NextResponse.json({ client_secret });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
