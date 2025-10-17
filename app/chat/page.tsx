"use client";

import { useEffect } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";

export default function ChatPage() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        // (optional) handle token refresh using `existing`
        const id =
          typeof window !== "undefined"
            ? (localStorage.getItem("deviceId") ?? (() => {
                const d = crypto.randomUUID();
                localStorage.setItem("deviceId", d);
                return d;
              })())
            : "server";

        const res = await fetch("/api/chatkit/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId: id }),
        });

        if (!res.ok) throw new Error(await res.text());
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
  });

  // (optional) side effects, analytics, etc.
  useEffect(() => {}, []);

  return <ChatKit control={control} />;
}
