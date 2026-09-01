import type { Business, Lead, LeadStatus, Quote } from "@/lib/types";
import {
  getBusinessByUserId as fileBusinessByUser,
  leadsFor as fileLeads,
  quotesFor as fileQuotes,
  readStore,
  uid,
  writeStore,
} from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  businessFromRow,
  businessPatchToRow,
  leadFromRow,
  quoteFromRow,
  type BusinessRow,
  type LeadRow,
  type QuoteRow,
} from "@/lib/supabase/map";
import { createClient } from "@/lib/supabase/server";

export type LeadAction = {
  status?: LeadStatus;
  quotedAmount?: number;
  wonAmount?: number;
  collectedAmount?: number;
  quoteDescription?: string;
  followUp?: boolean;
};

const NEW_BUSINESS = {
  phone: "",
  notification_mobile: "",
  city: "",
  service_areas: [] as string[],
  services: [] as string[],
  call_out: 95,
  emergency_call_out: 150,
  hourly_labour: 65,
  minimum_job: 80,
  boiler_diagnostic: 95,
  tone: "plain, calm, local plumber",
  plan: "founding",
  onboarded: false,
};

export async function getBusinessForUser(userId: string) {
  if (!isSupabaseConfigured()) return fileBusinessByUser(userId);
  const supabase = await createClient();
  const { data, error } = await supabase.from("businesses").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data ? businessFromRow(data as BusinessRow) : null;
}

export async function ensureMemberBusiness(input: {
  userId: string;
  firstName?: string;
  businessName?: string;
  email?: string;
}) {
  const existing = await getBusinessForUser(input.userId);
  if (existing) return existing;
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .insert({
      user_id: input.userId,
      name: input.businessName?.trim() || "",
      owner_first_name: input.firstName?.trim() || "",
      owner_email: input.email?.trim().toLowerCase() || "",
      ...NEW_BUSINESS,
    })
    .select("*")
    .single();

  if (error) {
    const again = await getBusinessForUser(input.userId);
    if (again) return again;
    throw error;
  }
  return businessFromRow(data as BusinessRow);
}

export async function listLeads(businessId: string) {
  if (!isSupabaseConfigured()) return fileLeads(businessId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => leadFromRow(row as LeadRow));
}

export async function listQuotes(businessId: string) {
  if (!isSupabaseConfigured()) return fileQuotes(businessId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => quoteFromRow(row as QuoteRow));
}

export async function updateBusiness(businessId: string, patch: Partial<Business>) {
  if (!isSupabaseConfigured()) {
    const store = readStore();
    const idx = store.businesses.findIndex((b) => b.id === businessId);
    if (idx < 0) return null;
    store.businesses[idx] = { ...store.businesses[idx], ...patch };
    writeStore(store);
    return store.businesses[idx];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .update(businessPatchToRow(patch))
    .eq("id", businessId)
    .select("*")
    .single();
  if (error) throw error;
  return businessFromRow(data as BusinessRow);
}

export async function insertLead(lead: Omit<Lead, "id"> & { id?: string }) {
  if (!isSupabaseConfigured()) {
    const store = readStore();
    const next: Lead = { ...lead, id: lead.id ?? uid("lead") };
    store.leads.push(next);
    writeStore(store);
    return next;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      business_id: lead.businessId,
      customer_name: lead.customerName,
      customer_phone: lead.customerPhone,
      job_type: lead.jobType,
      job_label: lead.jobLabel,
      problem: lead.problem,
      answers: lead.answers,
      postcode: lead.postcode,
      urgency: lead.urgency,
      preferred_time: lead.preferredTime,
      photo_note: lead.photoNote,
      likely_job: lead.likelyJob,
      typical_min: lead.typicalMin,
      typical_max: lead.typicalMax,
      quoted_amount: lead.quotedAmount,
      won_amount: lead.wonAmount,
      collected_amount: lead.collectedAmount,
      status: lead.status,
      existing_customer: lead.existingCustomer,
      conversation: lead.conversation,
    })
    .select("*")
    .single();
  if (error) throw error;
  return leadFromRow(data as LeadRow);
}

export async function applyLeadAction(businessId: string, leadId: string, body: LeadAction) {
  if (!isSupabaseConfigured()) {
    return applyLeadActionFile(businessId, leadId, body);
  }

  const supabase = await createClient();
  const { data: leadRow, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .eq("business_id", businessId)
    .maybeSingle();
  if (leadError) throw leadError;
  if (!leadRow) return null;

  const lead = leadFromRow(leadRow as LeadRow);
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { updated_at: now };

  if (body.status) {
    lead.status = body.status;
    patch.status = body.status;
  }
  if (typeof body.quotedAmount === "number") {
    lead.quotedAmount = body.quotedAmount;
    lead.status = "quoted";
    patch.quoted_amount = body.quotedAmount;
    patch.status = "quoted";
    const { error: quoteError } = await supabase.from("quotes").insert({
      business_id: businessId,
      lead_id: lead.id,
      amount: body.quotedAmount,
      description: body.quoteDescription || lead.jobLabel,
      status: "sent",
      sent_at: now,
    });
    if (quoteError) throw quoteError;
  }
  if (typeof body.wonAmount === "number") {
    lead.wonAmount = body.wonAmount;
    lead.status = "won";
    patch.won_amount = body.wonAmount;
    patch.status = "won";
    const { error: winError } = await supabase
      .from("quotes")
      .update({ status: "accepted" })
      .eq("lead_id", lead.id)
      .eq("business_id", businessId);
    if (winError) throw winError;
  }
  if (typeof body.collectedAmount === "number") {
    lead.collectedAmount = body.collectedAmount;
    patch.collected_amount = body.collectedAmount;
  }
  if (body.followUp) {
    lead.status = "following_up";
    patch.status = "following_up";
    const { data: quotes, error: listError } = await supabase
      .from("quotes")
      .select("id")
      .eq("lead_id", lead.id)
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (listError) throw listError;
    const quoteId = quotes?.[0]?.id;
    if (quoteId) {
      const { error: followError } = await supabase
        .from("quotes")
        .update({ status: "following_up", last_follow_up_at: now })
        .eq("id", quoteId);
      if (followError) throw followError;
    }
  }

  const { error: updateError } = await supabase.from("leads").update(patch).eq("id", lead.id);
  if (updateError) throw updateError;
  return lead;
}

function applyLeadActionFile(businessId: string, leadId: string, body: LeadAction) {
  const store = readStore();
  const lead = store.leads.find((l) => l.id === leadId && l.businessId === businessId);
  if (!lead) return null;

  if (body.status) lead.status = body.status;
  if (typeof body.quotedAmount === "number") {
    lead.quotedAmount = body.quotedAmount;
    lead.status = "quoted";
    const quote: Quote = {
      id: uid("quote"),
      businessId,
      leadId: lead.id,
      amount: body.quotedAmount,
      description: body.quoteDescription || lead.jobLabel,
      status: "sent",
      sentAt: new Date().toISOString(),
      lastFollowUpAt: null,
      createdAt: new Date().toISOString(),
    };
    store.quotes.push(quote);
  }
  if (typeof body.wonAmount === "number") {
    lead.wonAmount = body.wonAmount;
    lead.status = "won";
    const quote = store.quotes.find((q) => q.leadId === lead.id);
    if (quote) quote.status = "accepted";
  }
  if (typeof body.collectedAmount === "number") {
    lead.collectedAmount = body.collectedAmount;
  }
  if (body.followUp) {
    lead.status = "following_up";
    const quote = [...store.quotes].reverse().find((q) => q.leadId === lead.id);
    if (quote) {
      quote.status = "following_up";
      quote.lastFollowUpAt = new Date().toISOString();
    }
  }
  lead.updatedAt = new Date().toISOString();
  writeStore(store);
  return lead;
}
