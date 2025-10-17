"use client";

import { useEffect } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";

export default function ChatPage() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        // mark as used to satisfy eslint rule
        if (existing) {
          // no-op: could refresh the token here if you implement refresh
        }

        const makeDeviceId = () => {
          const stored = localStorage.getItem("deviceId");
          if (stored) return stored;
          const d = crypto.randomUUID();
          localStorage.setItem("deviceId", d);
          return d;
        };

        const deviceId =
          typeof window !== "undefined" ? makeDeviceId() : "server";

        const res = await fetch("/api/chatkit/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId }),
        });

        if (!res.ok) throw new Error(await res.text());
        const { client_secret } = (await res.json()) as { client_secret: string };
        return client_secret;
      },
    },
  });

  useEffect(() => {}, []);

  return <ChatKit control={control} />;
}
