import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { readStore, uid, writeStore } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  businessFromRow,
  leadFromRow,
  quoteFromRow,
  type BusinessRow,
  type LeadRow,
  type QuoteRow,
} from "@/lib/supabase/map";
import { createClient } from "@/lib/supabase/server";
import type { Business, Lead, PageVisit, Quote } from "@/lib/types";

const DEFAULT_ADMINS = ["aruotu@gmail.com"];

export function adminEmails() {
  const extra = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean) ?? [];
  return [...new Set([...DEFAULT_ADMINS, ...extra])];
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || !isAdminEmail(user.email)) redirect("/dashboard");
  return user;
}

export async function listMembers(): Promise<Business[]> {
  if (!isSupabaseConfigured()) return readStore().businesses;
  const supabase = await createClient();
  const { data, error } = await supabase.from("businesses").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => businessFromRow(row as BusinessRow));
}

export async function listAllLeads(): Promise<Lead[]> {
  if (!isSupabaseConfigured()) {
    return [...readStore().leads].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []).map((row) => leadFromRow(row as LeadRow));
}

export async function listAllQuotes(): Promise<Quote[]> {
  if (!isSupabaseConfigured()) {
    return [...readStore().quotes].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("quotes").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []).map((row) => quoteFromRow(row as QuoteRow));
}

export async function getMember(id: string) {
  const members = await listMembers();
  return members.find((member) => member.id === id) ?? null;
}

export async function getLead(id: string) {
  if (!isSupabaseConfigured()) {
    return readStore().leads.find((lead) => lead.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? leadFromRow(data as LeadRow) : null;
}

function visitFromRow(row: {
  id: string;
  created_at: string;
  path: string;
  ip: string;
  user_agent: string;
  referrer: string;
  country: string;
}): PageVisit {
  return {
    id: row.id,
    createdAt: row.created_at,
    path: row.path,
    ip: row.ip,
    userAgent: row.user_agent,
    referrer: row.referrer,
    country: row.country,
  };
}

export async function listVisits(limit = 200): Promise<PageVisit[]> {
  if (!isSupabaseConfigured()) {
    return [...(readStore().pageVisits ?? [])].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, limit);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_visits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => visitFromRow(row as Parameters<typeof visitFromRow>[0]));
}

export function visitStats(visits: PageVisit[]) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const today = visits.filter((v) => now - +new Date(v.createdAt) < day);
  const week = visits.filter((v) => now - +new Date(v.createdAt) < 7 * day);
  const uniqueIps = new Set(week.map((v) => v.ip).filter(Boolean));
  return {
    total: visits.length,
    today: today.length,
    week: week.length,
    uniqueIps: uniqueIps.size,
  };
}

export async function visitCounts() {
  if (!isSupabaseConfigured()) return visitStats(readStore().pageVisits ?? []);

  const supabase = await createClient();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [total, today, week, weekIps] = await Promise.all([
    supabase.from("page_visits").select("id", { count: "exact", head: true }),
    supabase.from("page_visits").select("id", { count: "exact", head: true }).gte("created_at", dayAgo),
    supabase.from("page_visits").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("page_visits").select("ip").gte("created_at", weekAgo).limit(5000),
  ]);

  return {
    total: total.count ?? 0,
    today: today.count ?? 0,
    week: week.count ?? 0,
    uniqueIps: new Set((weekIps.data ?? []).map((row) => row.ip).filter(Boolean)).size,
  };
}

export function recordVisitLocal(visit: Omit<PageVisit, "id" | "createdAt">) {
  const store = readStore();
  store.pageVisits = store.pageVisits ?? [];
  store.pageVisits.unshift({
    id: uid("visit"),
    createdAt: new Date().toISOString(),
    ...visit,
  });
  store.pageVisits = store.pageVisits.slice(0, 2000);
  writeStore(store);
}
