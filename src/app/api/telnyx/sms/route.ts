import {
  ingestInboundLead,
  loadSmsSession,
  resolveInboundBusiness,
  saveSmsSession,
} from "@/lib/sms";
import { reply, startConversation } from "@/lib/engine";
import { inboundSms, sendSms } from "@/lib/telnyx";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Parameters<typeof inboundSms>[0] | null;
  if (!body) return new Response("ok");

  const inbound = inboundSms(body);
  if (!inbound) return new Response("ok");

  const existing = await loadSmsSession(inbound.from);
  if (inbound.id && existing?.event_id === inbound.id) return new Response("ok");

  const business = await resolveInboundBusiness(inbound.to);
  const businessName = business?.name || "the plumber";

  const incoming =
    existing?.state && !existing.state.complete ? existing.state : startConversation(businessName);
  const next = inbound.text ? reply(incoming, inbound.text, businessName) : incoming;

  if (next.complete && next.lead && !existing?.state.complete) {
    await ingestInboundLead({ to: inbound.to, from: inbound.from, state: next });
  }

  await saveSmsSession(inbound.from, inbound.id, next);

  const text = next.messages.at(-1)?.text;
  if (text && next.messages.at(-1)?.role === "assistant") {
    await sendSms(inbound.from, text);
  }

  return new Response("ok");
}
