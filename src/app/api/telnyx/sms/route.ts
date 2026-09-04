import { reply, startConversation } from "@/lib/engine";
import { inboundSms, sendSms } from "@/lib/telnyx";

const sessions = new Map<string, ReturnType<typeof startConversation>>();

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Parameters<typeof inboundSms>[0] | null;
  if (!body) return new Response("ok");

  const inbound = inboundSms(body);
  if (!inbound) return new Response("ok");

  const existing = sessions.get(inbound.from);
  const incoming = existing && !existing.complete ? existing : startConversation("the plumber");
  const next = inbound.text ? reply(incoming, inbound.text, "the plumber") : incoming;
  sessions.set(inbound.from, next);

  const text = next.messages.at(-1)?.text;
  if (text && next.messages.at(-1)?.role === "assistant") {
    await sendSms(inbound.from, text);
  }

  return new Response("ok");
}
