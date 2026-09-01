import type { Business, JobType, Lead, LeadStatus, Message, PlanId, Quote, QuoteStatus } from "@/lib/types";

export type BusinessRow = {
  id: string;
  user_id: string;
  name: string;
  owner_first_name: string;
  phone: string;
  notification_mobile: string;
  city: string;
  service_areas: string[] | null;
  services: string[] | null;
  call_out: number;
  emergency_call_out: number;
  hourly_labour: number;
  minimum_job: number;
  boiler_diagnostic: number;
  tone: string;
  plan: string;
  onboarded: boolean;
  owner_email?: string;
  created_at: string;
};

export type LeadRow = {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone: string;
  job_type: string;
  job_label: string;
  problem: string;
  answers: Record<string, string> | null;
  postcode: string;
  urgency: string;
  preferred_time: string;
  photo_note: string;
  likely_job: string;
  typical_min: number;
  typical_max: number;
  quoted_amount: number | null;
  won_amount: number | null;
  collected_amount: number | null;
  status: string;
  existing_customer: boolean;
  conversation: Message[] | null;
  created_at: string;
  updated_at: string;
};

export type QuoteRow = {
  id: string;
  business_id: string;
  lead_id: string;
  amount: number;
  description: string;
  status: string;
  sent_at: string | null;
  last_follow_up_at: string | null;
  created_at: string;
};

export function businessFromRow(row: BusinessRow): Business {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    ownerFirstName: row.owner_first_name,
    phone: row.phone,
    notificationMobile: row.notification_mobile,
    city: row.city,
    serviceAreas: row.service_areas ?? [],
    services: row.services ?? [],
    callOut: row.call_out,
    emergencyCallOut: row.emergency_call_out,
    hourlyLabour: row.hourly_labour,
    minimumJob: row.minimum_job,
    boilerDiagnostic: row.boiler_diagnostic,
    tone: row.tone,
    plan: row.plan as PlanId,
    onboarded: row.onboarded,
    ownerEmail: row.owner_email ?? "",
    createdAt: row.created_at,
  };
}

export function leadFromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    businessId: row.business_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    jobType: row.job_type as JobType,
    jobLabel: row.job_label,
    problem: row.problem,
    answers: row.answers ?? {},
    postcode: row.postcode,
    urgency: row.urgency,
    preferredTime: row.preferred_time,
    photoNote: row.photo_note,
    likelyJob: row.likely_job,
    typicalMin: row.typical_min,
    typicalMax: row.typical_max,
    quotedAmount: row.quoted_amount,
    wonAmount: row.won_amount,
    collectedAmount: row.collected_amount,
    status: row.status as LeadStatus,
    existingCustomer: row.existing_customer,
    conversation: row.conversation ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function quoteFromRow(row: QuoteRow): Quote {
  return {
    id: row.id,
    businessId: row.business_id,
    leadId: row.lead_id,
    amount: row.amount,
    description: row.description,
    status: row.status as QuoteStatus,
    sentAt: row.sent_at,
    lastFollowUpAt: row.last_follow_up_at,
    createdAt: row.created_at,
  };
}

const BUSINESS_PATCH: Record<string, string> = {
  name: "name",
  ownerFirstName: "owner_first_name",
  phone: "phone",
  notificationMobile: "notification_mobile",
  city: "city",
  serviceAreas: "service_areas",
  services: "services",
  callOut: "call_out",
  emergencyCallOut: "emergency_call_out",
  hourlyLabour: "hourly_labour",
  minimumJob: "minimum_job",
  boilerDiagnostic: "boiler_diagnostic",
  tone: "tone",
  plan: "plan",
  onboarded: "onboarded",
  ownerEmail: "owner_email",
};

export function businessPatchToRow(patch: Partial<Business>) {
  const row: Record<string, unknown> = {};
  for (const [from, to] of Object.entries(BUSINESS_PATCH)) {
    if (from in patch) row[to] = patch[from as keyof Business];
  }
  return row;
}
