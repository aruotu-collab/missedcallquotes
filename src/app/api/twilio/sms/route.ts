import { reply, startConversation } from "@/lib/engine";

export async function POST(req: Request) {
  const form = await req.formData();
  const body = String(form.get("Body") || "");
  const from = String(form.get("From") || "");
  const next = reply(startConversation("the plumber"), body);
  const text = next.messages.at(-1)?.text || "Thanks — we'll be in touch.";
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response><Message>${escapeXml(text)}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } },
  );
  void from;
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
