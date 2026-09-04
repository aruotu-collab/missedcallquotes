import { isSupabaseConfigured, supabasePublicUrl } from "@/lib/supabase/config";
import type { ConversationState } from "@/lib/types";

type SessionRow = {
  phone: string;
  event_id: string;
  state: ConversationState;
};

function rest() {
  const { url, key } = supabasePublicUrl();
  return {
    url,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  };
}

export async function loadSmsSession(phone: string): Promise<SessionRow | null> {
  if (!isSupabaseConfigured()) return null;
  const { url, headers } = rest();
  const query = new URLSearchParams({
    phone: `eq.${phone}`,
    select: "phone,event_id,state",
    limit: "1",
  });
  const res = await fetch(`${url}/rest/v1/sms_sessions?${query}`, { headers }).catch(() => null);
  if (!res?.ok) return null;
  const rows = (await res.json()) as SessionRow[];
  return rows[0] ?? null;
}

export async function saveSmsSession(phone: string, eventId: string, state: ConversationState) {
  if (!isSupabaseConfigured()) return;
  const { url, headers } = rest();
  await fetch(`${url}/rest/v1/sms_sessions`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      phone,
      event_id: eventId,
      state,
      updated_at: new Date().toISOString(),
    }),
  }).catch(() => undefined);
}

export async function resolveInboundBusiness(to: string) {
  if (!isSupabaseConfigured()) return null;
  const { url, headers } = rest();
  const res = await fetch(`${url}/rest/v1/rpc/resolve_inbound_business`, {
    method: "POST",
    headers,
    body: JSON.stringify({ p_to: to }),
  }).catch(() => null);
  if (!res?.ok) return null;
  const rows = (await res.json()) as { id: string; name: string }[];
  return rows[0] ?? null;
}

export async function ingestInboundLead(input: {
  to: string;
  from: string;
  state: ConversationState;
}) {
  const lead = input.state.lead;
  if (!lead || !isSupabaseConfigured()) return null;
  const { url, headers } = rest();
  const res = await fetch(`${url}/rest/v1/rpc/ingest_inbound_lead`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      p_to: input.to,
      p_from: input.from,
      p_customer_name: lead.customerName,
      p_job_type: lead.jobType,
      p_job_label: lead.jobLabel,
      p_problem: lead.problem,
      p_answers: lead.answers,
      p_postcode: lead.postcode,
      p_urgency: lead.urgency,
      p_preferred_time: lead.preferredTime,
      p_photo_note: lead.photoNote,
      p_likely_job: lead.likelyJob,
      p_typical_min: lead.typicalMin,
      p_typical_max: lead.typicalMax,
      p_conversation: input.state.messages,
    }),
  }).catch(() => null);
  if (!res?.ok) return null;
  const id = await res.json();
  return typeof id === "string" ? id : null;
}
