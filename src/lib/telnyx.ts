export function telnyxNumber() {
  return (process.env.TELNYX_PHONE_NUMBER || "").replace(/\s+/g, "");
}

export function telnyxApiKey() {
  return process.env.TELNYX_API_KEY?.trim() || "";
}

export function inboundSms(body: {
  data?: {
    event_type?: string;
    payload?: {
      direction?: string;
      text?: string | null;
      from?: { phone_number?: string };
      to?: { phone_number?: string }[];
    };
  };
}) {
  const event = body.data;
  if (event?.event_type !== "message.received") return null;
  const payload = event.payload;
  if (!payload || payload.direction === "outbound") return null;
  const from = payload.from?.phone_number?.trim();
  const to = payload.to?.[0]?.phone_number?.trim();
  const text = (payload.text || "").trim();
  if (!from) return null;
  return { from, to: to || telnyxNumber(), text };
}

export async function sendSms(to: string, text: string) {
  const key = telnyxApiKey();
  const from = telnyxNumber();
  if (!key || !from || !to || !text) return;
  await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, text }),
  });
}
