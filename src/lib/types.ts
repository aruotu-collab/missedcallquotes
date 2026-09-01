export type PlanId = "founding" | "solo" | "growth" | "multivan";

export type JobType =
  | "boiler_breakdown"
  | "boiler_replacement"
  | "leak"
  | "burst_pipe"
  | "blocked_drain"
  | "blocked_toilet"
  | "radiator"
  | "tap"
  | "shower"
  | "bathroom"
  | "landlord"
  | "other";

export type LeadStatus =
  | "new"
  | "contacted"
  | "accepted"
  | "quoted"
  | "following_up"
  | "won"
  | "lost"
  | "declined";

export type QuoteStatus = "draft" | "sent" | "following_up" | "accepted" | "declined";

export type PricingMode = "fixed" | "range" | "approval";

export type User = {
  id: string;
  email: string;
  passwordHash?: string;
  createdAt: string;
};

export type Business = {
  id: string;
  userId: string;
  name: string;
  ownerFirstName: string;
  phone: string;
  notificationMobile: string;
  city: string;
  serviceAreas: string[];
  services: string[];
  callOut: number;
  emergencyCallOut: number;
  hourlyLabour: number;
  minimumJob: number;
  boilerDiagnostic: number;
  tone: string;
  plan: PlanId;
  onboarded: boolean;
  ownerEmail?: string;
  createdAt: string;
};

export type PageVisit = {
  id: string;
  createdAt: string;
  path: string;
  ip: string;
  userAgent: string;
  referrer: string;
  country: string;
};

export type Lead = {
  id: string;
  businessId: string;
  customerName: string;
  customerPhone: string;
  jobType: JobType;
  jobLabel: string;
  problem: string;
  answers: Record<string, string>;
  postcode: string;
  urgency: string;
  preferredTime: string;
  photoNote: string;
  likelyJob: string;
  typicalMin: number;
  typicalMax: number;
  quotedAmount: number | null;
  wonAmount: number | null;
  collectedAmount: number | null;
  status: LeadStatus;
  existingCustomer: boolean;
  conversation: Message[];
  createdAt: string;
  updatedAt: string;
};

export type Quote = {
  id: string;
  businessId: string;
  leadId: string;
  amount: number;
  description: string;
  status: QuoteStatus;
  sentAt: string | null;
  lastFollowUpAt: string | null;
  createdAt: string;
};

export type Message = {
  role: "assistant" | "customer";
  text: string;
  at: string;
};

export type ConversationState = {
  step: string;
  jobType: JobType | null;
  answers: Record<string, string>;
  messages: Message[];
  complete: boolean;
  safety: boolean;
  lead: Omit<
    Lead,
    | "id"
    | "businessId"
    | "status"
    | "quotedAmount"
    | "wonAmount"
    | "collectedAmount"
    | "createdAt"
    | "updatedAt"
    | "existingCustomer"
    | "conversation"
  > | null;
};

export type Store = {
  users: User[];
  businesses: Business[];
  leads: Lead[];
  quotes: Quote[];
  pageVisits?: PageVisit[];
};
