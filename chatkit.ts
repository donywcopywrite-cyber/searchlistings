

export default async function getChatKitSessionToken(
deviceId: string
): Promise<string> {
const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "OpenAI-Beta": "chatkit_beta=v1",
    Authorization: "Bearer " + process.env.VITE_OPENAI_API_SECRET_KEY,
    },
    body: JSON.stringify({
    workflow: { id: "wf_68f11ef926888190a3785994ea8530e8052cc039ed15b5be" },
    user: deviceId,
    }),
});

const { client_secret } = await response.json();

return client_secret;
}
